import { OperationProject, CustomerCommsLog, CustomerEmailCadence, buildCustomerKickoffPortalUrl, getCSMCalendarBookingProfile, isLockBOMItem } from '../types';
import { loadStoredProjects, saveStoredProjects } from '../data/initialData';
import { saveLiveProject } from './realtimeSyncService';

export interface MatchedPortfolioPropertyDetail {
  project: OperationProject;
  roleOrTitle?: string;
  contactName?: string;
  isCommunitySiteContact: boolean;
  isStaffMember: boolean;
}

export interface MatchedPortfolioContact {
  email: string;
  contactName?: string;
  roleOrTitle?: string;
  tiedProperties: OperationProject[];
  propertyDetails: MatchedPortfolioPropertyDetail[];
}

export interface PortfolioDetectionResult {
  hasMatches: boolean;
  matchedContacts: MatchedPortfolioContact[];
  allTiedProjects: OperationProject[];
}

/**
 * Scans candidate projects to detect if any of the recipient emails are Community Site Contacts,
 * onsite staff members, digest subscribers, or configured customer contacts across OTHER properties.
 */
export function detectPortfolioContacts(
  recipientEmails: string[] | string,
  currentProjectId?: string,
  allProjects?: OperationProject[]
): PortfolioDetectionResult {
  const projects = allProjects && allProjects.length > 0 ? allProjects : loadStoredProjects();
  const candidateProjects = currentProjectId
    ? projects.filter((p) => p.id !== currentProjectId)
    : projects;

  const rawTokens = Array.isArray(recipientEmails)
    ? recipientEmails.flatMap((r) => r.split(/[,;\s]+/))
    : recipientEmails.split(/[,;\s]+/);

  const normalizedRecipients = Array.from(
    new Set(
      rawTokens
        .map((r) => r.trim().toLowerCase())
        .filter((r) => r && r.includes('@'))
    )
  );

  const matchedContactsMap = new Map<string, MatchedPortfolioContact>();

  for (const email of normalizedRecipients) {
    const tiedProperties: OperationProject[] = [];
    const propertyDetails: MatchedPortfolioPropertyDetail[] = [];
    let detectedName: string | undefined;
    let detectedRole: string | undefined;

    for (const proj of candidateProjects) {
      let isMatch = false;
      let isCommunitySiteContact = false;
      let isStaffMember = false;
      let matchedRole: string | undefined;
      let matchedName: string | undefined;

      // 1. Check Community Site Contact and Subscriber emails
      const communityEmail = proj.customerIntake?.communityEmail?.trim().toLowerCase();
      const subscriberEmail = proj.customerIntake?.subscriberEmail?.trim().toLowerCase();

      if (communityEmail && communityEmail === email) {
        isMatch = true;
        isCommunitySiteContact = true;
        matchedRole = 'Community Site Contact';
        matchedName = proj.clientName;
      } else if (subscriberEmail && subscriberEmail === email) {
        isMatch = true;
        isCommunitySiteContact = true;
        matchedRole = 'Digest Subscriber Contact';
        matchedName = proj.clientName;
      }

      // 2. Check Onsite Staff Roles (Community Manager, Regional PM, Maintenance, etc.)
      const matchingStaff = (proj.customerIntake?.staffRoles || []).find(
        (s) => s.email && s.email.trim().toLowerCase() === email
      );
      if (matchingStaff) {
        isMatch = true;
        isStaffMember = true;
        matchedRole = matchingStaff.roleOrTitle || 'Property Staff Member';
        matchedName = `${matchingStaff.firstName} ${matchingStaff.lastName}`.trim();
      }

      // 3. Check Additional Customer Distribution Emails
      const additionalEmails = [
        ...(proj.additionalCustomerEmails || []),
        ...(proj.customerIntake?.additionalCustomerEmails || []),
      ].map((e) => e.trim().toLowerCase());

      if (additionalEmails.includes(email)) {
        isMatch = true;
        matchedRole = matchedRole || 'Designated Customer Stakeholder';
      }

      if (isMatch) {
        tiedProperties.push(proj);
        propertyDetails.push({
          project: proj,
          roleOrTitle: matchedRole,
          contactName: matchedName,
          isCommunitySiteContact,
          isStaffMember,
        });
        if (!detectedName && matchedName) detectedName = matchedName;
        if (!detectedRole && matchedRole) detectedRole = matchedRole;
      }
    }

    if (tiedProperties.length > 0) {
      matchedContactsMap.set(email, {
        email,
        contactName: detectedName,
        roleOrTitle: detectedRole,
        tiedProperties,
        propertyDetails,
      });
    }
  }

  const matchedContacts = Array.from(matchedContactsMap.values());
  const allTiedMap = new Map<string, OperationProject>();
  matchedContacts.forEach((mc) => {
    mc.tiedProperties.forEach((p) => allTiedMap.set(p.id, p));
  });

  return {
    hasMatches: matchedContacts.length > 0,
    matchedContacts,
    allTiedProjects: Array.from(allTiedMap.values()),
  };
}

export type PortfolioCommunicationType =
  | 'kickoff'
  | 'digest'
  | 'csm'
  | 'csm_calendar'
  | 'sow_forecast'
  | 'stress_test'
  | 'shipping'
  | 'general';

interface BuildPortfolioUpdateEmailParams {
  primaryProject: OperationProject;
  includedProjects: OperationProject[];
  matchedContacts: MatchedPortfolioContact[];
  communicationType: PortfolioCommunicationType;
  originalSubject: string;
  originalSummary: string;
  cadence?: CustomerEmailCadence;
  senderName?: string;
  senderEmail?: string;
  customNote?: string;
}

/**
 * Builds the complete "Portfolio Update" email subject and rich responsive HTML body,
 * consolidating status, milestones, kickoff links, and roadmap across all tied properties.
 */
export function buildPortfolioUpdateEmailContent({
  primaryProject,
  includedProjects,
  matchedContacts,
  communicationType,
  originalSubject,
  originalSummary,
  cadence = 'weekly',
  senderName,
  senderEmail,
  customNote,
}: BuildPortfolioUpdateEmailParams): {
  subject: string;
  summary: string;
  htmlBody: string;
  logType: CustomerCommsLog['type'];
} {
  const allProjects = includedProjects.length > 0 ? includedProjects : [primaryProject];
  const totalProperties = allProjects.length;
  const totalUnits = allProjects.reduce((sum, p) => sum + (Number(p.unitsCount) || 0), 0);

  // Compute portfolio average progress
  const progressList = allProjects.map((p) => {
    const totalM = p.milestones.length;
    const completedM = p.milestones.filter((m) => m.status === 'Completed').length;
    return totalM > 0 ? Math.round((completedM / totalM) * 100) : 0;
  });
  const avgProgress =
    progressList.length > 0
      ? Math.round(progressList.reduce((a, b) => a + b, 0) / progressList.length)
      : 0;

  const contactSummary = matchedContacts
    .map((c) => (c.contactName ? `${c.contactName} (${c.email})` : c.email))
    .join(', ');

  const clientName = primaryProject.clientName || allProjects[0]?.clientName || 'Portfolio';

  // Construct Portfolio Subject
  let typeLabel = 'Portfolio Update';
  if (communicationType === 'digest') {
    typeLabel = `${cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly'} Portfolio Digest`;
  } else if (communicationType === 'kickoff') {
    typeLabel = 'Portfolio Kickoff & Hardware Guide';
  } else if (communicationType === 'csm_calendar') {
    typeLabel = 'CSM Portfolio Training Booking';
  } else if (communicationType === 'sow_forecast') {
    typeLabel = 'Portfolio Installation Scope Summary';
  } else if (communicationType === 'csm') {
    typeLabel = 'CSM Portfolio Handoff Transition';
  } else if (communicationType === 'shipping') {
    typeLabel = 'Portfolio Hardware Shipping Status';
  }

  const projectNamesSummary =
    allProjects.length <= 3
      ? allProjects.map((p) => p.propertyName).join(', ')
      : `${allProjects[0].propertyName}, ${allProjects[1].propertyName} + ${allProjects.length - 2} more`;

  const subject = `[Portfolio Update] ${typeLabel} — ${clientName} (${allProjects.length} Properties: ${projectNamesSummary})`;

  const logoImgTag = `<img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 30px; width: auto; display: inline-block; vertical-align: middle;" />`;

  // Build property cards HTML
  const propertyCardsHtml = allProjects
    .map((proj, idx) => {
      const isPrimary = proj.id === primaryProject.id;
      const totalM = proj.milestones.length;
      const completedM = proj.milestones.filter((m) => m.status === 'Completed').length;
      const currentM =
        proj.milestones.find((m) => m.status === 'In Progress') ||
        proj.milestones.find((m) => m.status === 'Upcoming') ||
        proj.milestones[proj.milestones.length - 1];
      const pct = totalM > 0 ? Math.round((completedM / totalM) * 100) : 0;
      const kickoffUrl = buildCustomerKickoffPortalUrl(proj.id);
      const csmProfile = getCSMCalendarBookingProfile(proj.assignedCSM);
      const sowItems = proj.sowForecastItems || [];

      let specificSectionHtml = '';

      if (communicationType === 'kickoff') {
        specificSectionHtml = `
          <div style="margin-top: 12px; padding: 12px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase; margin-bottom: 6px;">
              Interactive Kickoff Portal Link:
            </div>
            <a href="${kickoffUrl}" style="display: inline-block; background-color: #01C38D; color: #0f172a; font-weight: bold; font-size: 12px; padding: 8px 16px; border-radius: 6px; text-decoration: none;">
              Open Kickoff Walkthrough (${proj.propertyName})
            </a>
            <div style="font-size: 11px; color: #475569; margin-top: 6px;">
              PMS Integration: <strong>${proj.customerIntake?.pmsSoftware || 'Yardi'}</strong> • ${proj.customerIntake?.commonAreaDoors?.length || 0} Common Doors
            </div>
          </div>
        `;
      } else if (communicationType === 'csm_calendar') {
        specificSectionHtml = `
          <div style="margin-top: 12px; padding: 12px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase; margin-bottom: 4px;">
              Designated CSM: ${csmProfile.name} (${csmProfile.title})
            </div>
            <p style="margin: 0 0 8px 0; font-size: 11px; font-style: italic; color: #15803d;">&ldquo;${csmProfile.quote}&rdquo;</p>
            <a href="${csmProfile.bookingUrl}" style="display: inline-block; background-color: #01C38D; color: #0f172a; font-weight: bold; font-size: 12px; padding: 7px 14px; border-radius: 6px; text-decoration: none;">
              Book Training Session with ${csmProfile.name.split(' ')[0]}
            </a>
          </div>
        `;
      } else if (communicationType === 'sow_forecast') {
        specificSectionHtml = `
          <div style="margin-top: 12px; padding: 12px; background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; font-size: 12px;">
            <div style="font-weight: 700; color: #3730a3; margin-bottom: 4px;">Installation Scope Forecast:</div>
            <div style="color: #4338ca;">${sowItems.length} Scope Line Items • ${sowItems.reduce((s, it) => s + (Number(it.forecastedQuantity) || 0), 0)} Forecasted Units</div>
          </div>
        `;
      } else if (communicationType === 'csm') {
        specificSectionHtml = `
          <div style="margin-top: 12px; padding: 12px; background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; font-size: 12px; color: #6b21a8;">
            <strong>CSM Handoff Lead:</strong> ${csmProfile.name} (${csmProfile.email || 'csm@onequext.com'})
          </div>
        `;
      }

      return `
        <div style="margin-bottom: 20px; border: 1px solid ${isPrimary ? '#01C38D' : '#cbd5e1'}; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <!-- Property Header Bar -->
          <div style="background-color: ${isPrimary ? '#0f172a' : '#1e293b'}; color: #ffffff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 14px; font-weight: 900; color: #ffffff;">${idx + 1}. ${proj.propertyName}</span>
              ${isPrimary ? '<span style="background-color: #01C38D; color: #0f172a; font-size: 9px; font-weight: 900; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">Originating Property</span>' : ''}
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
                ${proj.address}, ${proj.city}, ${proj.state} • <strong>${proj.unitsCount} Units</strong>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 11px; font-weight: 800; background-color: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 6px; color: #f8fafc;">
                ${proj.statusTag}
              </span>
            </div>
          </div>

          <!-- Property Body Details -->
          <div style="padding: 16px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 12px;">
              <tr>
                <td style="padding: 4px 8px 4px 0; color: #64748b; width: 45%;">
                  <strong>Assigned PM:</strong> ${proj.assignedPM?.name || 'Quext Operations'}
                </td>
                <td style="padding: 4px 0 4px 8px; color: #64748b; width: 55%;">
                  <strong>Assigned CSM:</strong> ${proj.assignedCSM || 'Nicole Franklin'}
                </td>
              </tr>
              <tr>
                <td style="padding: 4px 8px 4px 0; color: #64748b;">
                  <strong>Active Milestone:</strong> <span style="color: #0f172a; font-weight: bold;">${currentM?.title || 'In Progress'}</span>
                </td>
                <td style="padding: 4px 0 4px 8px; color: #64748b;">
                  <strong>Target Go-Live:</strong> ${proj.targetCompletionDate}
                </td>
              </tr>
            </table>

            <!-- Milestone Progress Bar -->
            <div style="background-color: #f1f5f9; border-radius: 6px; height: 10px; overflow: hidden; margin-bottom: 6px;">
              <div style="background-color: #01C38D; height: 10px; width: ${pct}%;"></div>
            </div>
            <div style="font-size: 11px; color: #64748b; display: flex; justify-content: space-between;">
              <span>Milestone Progress: <strong>${completedM} of ${totalM}</strong> (${pct}%)</span>
              <span>Stage: <strong>${currentM?.title || 'Active'}</strong></span>
            </div>

            ${specificSectionHtml}
          </div>
        </div>
      `;
    })
    .join('');

  const htmlBody = `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; color: #1e293b; background-color: #f8fafc;">
      <!-- Header Banner -->
      <div style="background-color: #0f172a; padding: 18px 20px; border-radius: 10px; margin-bottom: 20px; border-bottom: 3px solid #01C38D;">
        <table style="width: 100%;">
          <tr>
            <td>
              ${logoImgTag}
            </td>
            <td style="text-align: right;">
              <span style="font-size: 10px; font-weight: 900; color: #01C38D; text-transform: uppercase; letter-spacing: 1px; background-color: rgba(1, 195, 141, 0.15); border: 1px solid rgba(1, 195, 141, 0.4); padding: 4px 8px; border-radius: 6px;">
                Portfolio Update
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Greeting & Intro -->
      <div style="background-color: #ffffff; padding: 18px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
        <p style="font-size: 15px; font-weight: bold; margin: 0 0 8px 0; color: #0f172a;">
          Hello ${clientName} Leadership &amp; Community Operations Team,
        </p>
        <p style="font-size: 13px; line-height: 1.6; color: #334155; margin: 0 0 12px 0;">
          Below is your consolidated <strong>Portfolio Update</strong> covering all <strong>${allProjects.length} properties</strong> associated with your account${contactSummary ? ` (Contact: <strong>${contactSummary}</strong>)` : ''}.
        </p>
        ${
          customNote
            ? `<div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; border-left: 4px solid #01C38D; font-size: 12px; color: #0f172a; margin-bottom: 12px;"><strong>Operations Note:</strong> ${customNote}</div>`
            : ''
        }

        <!-- KPI Strip -->
        <div style="display: flex; gap: 10px; margin-top: 14px; text-align: center;">
          <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 6px;">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #64748b;">Properties</div>
            <div style="font-size: 18px; font-weight: 900; color: #0f172a; margin-top: 2px;">${totalProperties}</div>
          </div>
          <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 6px;">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #64748b;">Total Units</div>
            <div style="font-size: 18px; font-weight: 900; color: #0f172a; margin-top: 2px;">${totalUnits.toLocaleString()}</div>
          </div>
          <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 6px;">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #64748b;">Avg Completion</div>
            <div style="font-size: 18px; font-weight: 900; color: #01C38D; margin-top: 2px;">${avgProgress}%</div>
          </div>
        </div>
      </div>

      <!-- Property Breakdown Cards -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin-bottom: 12px;">
          Property-by-Property Status Breakdown (${allProjects.length} Properties):
        </div>
        ${propertyCardsHtml}
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b; line-height: 1.5;">
        <p style="margin: 0 0 4px 0;">
          Best regards,<br/>
          <strong>${senderName || primaryProject.assignedPM.name}</strong> • Quext Implementation Operations &amp; Customer Success
          ${senderEmail ? `<br/><span style="color: #0284c7;">${senderEmail}</span>` : ''}
        </p>
        <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">
          This consolidated portfolio update was automatically dispatched to verified Community Site Contacts &amp; leadership across your Quext smart community properties.
        </p>
      </div>
    </div>
  `;

  let logType: CustomerCommsLog['type'] = 'deployment_overview_email';
  if (communicationType === 'kickoff') logType = 'kickoff_submission';
  else if (communicationType === 'csm_calendar') logType = 'csm_training_portal';
  else if (communicationType === 'sow_forecast') logType = 'sow_forecast_email';
  else if (communicationType === 'csm') logType = 'csm_handoff_email';

  const summary = `Dispatched consolidated Portfolio Update covering ${allProjects.length} properties (${allProjects.map((p) => p.propertyName).join(', ')}). ${originalSummary}`;

  return { subject, summary, htmlBody, logType };
}

/**
 * Automatically records a CustomerCommsLog across all properties included in the portfolio update dispatch,
 * ensuring each property's communication history stays in sync.
 */
export function logPortfolioDispatchAcrossProjects({
  includedProjects,
  primaryProject,
  recipients,
  subject,
  summary,
  logType,
  sentBy,
  cadence = 'weekly',
  onUpdateProject,
}: {
  includedProjects: OperationProject[];
  primaryProject: OperationProject;
  recipients: string[];
  subject: string;
  summary: string;
  logType: CustomerCommsLog['type'];
  sentBy: string;
  cadence?: CustomerEmailCadence;
  onUpdateProject?: (updated: OperationProject) => void;
}) {
  const nowStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const allStored = loadStoredProjects();
  const includedIds = new Set(includedProjects.map((p) => p.id));

  const updatedStored = allStored.map((proj) => {
    if (includedIds.has(proj.id)) {
      const newLog: CustomerCommsLog = {
        id: `portfolio-comm-${Date.now()}-${proj.id}`,
        projectId: proj.id,
        timestamp: nowStr,
        type: logType,
        recipientEmail: recipients.join(', '),
        subject,
        summary: `[Portfolio Update] ${summary}`,
        sentBy,
        cadence,
        status: 'Delivered',
      };
      return {
        ...proj,
        customerCommsLogs: [newLog, ...(proj.customerCommsLogs || [])],
        lastUpdated: new Date().toISOString(),
      };
    }
    return proj;
  });

  saveStoredProjects(updatedStored);

  // Sync updated projects to Cloud Firestore
  updatedStored.forEach((proj) => {
    if (includedIds.has(proj.id)) {
      saveLiveProject(proj).catch(() => {});
    }
  });

  // Update primary project in active React state
  const updatedPrimary = updatedStored.find((p) => p.id === primaryProject.id);
  if (updatedPrimary && onUpdateProject) {
    onUpdateProject(updatedPrimary);
  }
}

export type AiEmailTone = 'executive' | 'action_oriented' | 'technical';

export interface MilestoneCardHighlight {
  badge: string;
  title: string;
  detail: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

export interface GeneratedAiCardDigest {
  subject: string;
  summary: string;
  aiExecutiveHeadline: string;
  aiMilestoneTagline: string;
  quextNextStep: string;
  customerActionItem: string;
  highlights: MilestoneCardHighlight[];
  htmlBody: string;
  logType: CustomerCommsLog['type'];
}

/**
 * Generates structured AI card highlights & concise executive copy tailored to a project's milestone.
 */
export function buildMilestoneSpecificCardHighlights(
  project: OperationProject,
  milestoneTitle: string,
  tone: AiEmailTone = 'executive',
  variantSeed: number = 0
): {
  aiExecutiveHeadline: string;
  aiMilestoneTagline: string;
  quextNextStep: string;
  customerActionItem: string;
  highlights: MilestoneCardHighlight[];
} {
  const norm = milestoneTitle.toLowerCase();
  const totalQuoted = project.bomItems.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
  const totalInstalled = project.bomItems.reduce((a, b) => a + (Number(b.installedCount) || 0), 0);
  const hwPct = totalQuoted > 0 ? Math.round((totalInstalled / totalQuoted) * 100) : 0;
  const pmsName = project.customerIntake?.pmsSoftware || 'Yardi';
  const doorsCount = project.customerIntake?.commonAreaDoors?.length || 0;
  const staffCount = project.customerIntake?.staffRoles?.length || 0;
  const csmProfile = getCSMCalendarBookingProfile(project.assignedCSM);
  const shipmentsCount = project.shippingDockItems?.length || 0;
  const sowCount = project.sowForecastItems?.length || 0;

  const tonePrefix =
    tone === 'action_oriented'
      ? 'Action Focus: '
      : tone === 'technical'
      ? 'Engineering Telemetry: '
      : '';

  if (norm.includes('kickoff')) {
    const headlines = [
      `${tonePrefix}${project.propertyName} is in Project Kickoff — aligning PMS integration (${pmsName}), staff permissions, and common area access schedules.`,
      `${tonePrefix}Kickoff orientation is underway for ${project.propertyName} (${project.unitsCount} units) with initial portal and hardware alignment in motion.`,
      `${tonePrefix}Operations kickoff is active for ${project.propertyName}; site intake and ${pmsName} property management sync are being finalized.`,
    ];
    return {
      aiExecutiveHeadline: headlines[variantSeed % headlines.length],
      aiMilestoneTagline: 'Stage 1 of 7 • Site Orientation & Intake Alignment',
      quextNextStep: `Validate ${pmsName} credentials and finalize hardware BOM lock finishes for Portal Buildout.`,
      customerActionItem:
        doorsCount > 0 && staffCount > 0
          ? `Intake verified (${staffCount} staff roles, ${doorsCount} common doors). No open client blockers.`
          : 'Complete the interactive Kickoff Walkthrough (confirm PMS credentials, staff roles & common doors).',
      highlights: [
        {
          badge: 'PMS INTEGRATION',
          title: `${pmsName} Sync Alignment`,
          detail: project.customerIntake?.submittedAt
            ? 'Credentials & property roster submitted'
            : 'Preparing automated resident sync',
          accentColor: '#0284c7',
          bgColor: '#f0f9ff',
          borderColor: '#bae6fd',
        },
        {
          badge: 'ACCESS & STAFF',
          title: `${staffCount} Staff Roles • ${doorsCount} Common Doors`,
          detail:
            doorsCount > 0
              ? 'Common area door tree mapped for access control'
              : 'Awaiting common door schedule confirmation',
          accentColor: '#059669',
          bgColor: '#ecfdf5',
          borderColor: '#a7f3d0',
        },
        {
          badge: 'COMMUNITY SCOPE',
          title: `${project.unitsCount} Units • ${totalQuoted.toLocaleString()} Devices`,
          detail: `Assigned PM: ${project.assignedPM.name} (${project.statusTag})`,
          accentColor: '#4f46e5',
          bgColor: '#eef2ff',
          borderColor: '#c7d2fe',
        },
      ],
    };
  }

  if (norm.includes('portal')) {
    const headlines = [
      `${tonePrefix}${project.propertyName} is in Portal Buildout — configuring ${pmsName} unit hierarchy, staff access tiers, and digital credentials.`,
      `${tonePrefix}Cloud environment and resident access hierarchy for ${project.propertyName} are actively being provisioned.`,
      `${tonePrefix}Portal Buildout is progressing on schedule for ${project.propertyName} ahead of hardware fulfillment.`,
    ];
    return {
      aiExecutiveHeadline: headlines[variantSeed % headlines.length],
      aiMilestoneTagline: 'Stage 2 of 7 • Cloud Environment & PMS Provisioning',
      quextNextStep: 'Complete unit-level portal mapping and transition BOM to Product Acquisition.',
      customerActionItem: 'Verify onsite staff admin email logins and review NFC / QR branding assets.',
      highlights: [
        {
          badge: 'CLOUD PORTAL',
          title: 'Unit & Building Hierarchy',
          detail: `${project.unitsCount} residential units structured in Quext Cloud`,
          accentColor: '#0284c7',
          bgColor: '#f0f9ff',
          borderColor: '#bae6fd',
        },
        {
          badge: 'DIGITAL CREDENTIALS',
          title: `${project.useNfcWallet ? 'NFC Wallet Enabled' : 'BLE Mobile Access'} • ${project.useQrIntercom ? 'QR Intercom Active' : 'Standard Access'}`,
          detail: `Connected with ${pmsName} resident feed`,
          accentColor: '#7c3aed',
          bgColor: '#f5f3ff',
          borderColor: '#ddd6fe',
        },
        {
          badge: 'STAFF ROLES',
          title: `${staffCount || 1} Property Admins Configured`,
          detail: 'Role-based permissions staged for community go-live',
          accentColor: '#059669',
          bgColor: '#ecfdf5',
          borderColor: '#a7f3d0',
        },
      ],
    };
  }

  if (norm.includes('acquisition') || norm.includes('product')) {
    const headlines = [
      `${tonePrefix}${project.propertyName} is in Product Acquisition — staging ${totalQuoted.toLocaleString()} smart devices for warehouse fulfillment and site delivery.`,
      `${tonePrefix}Hardware procurement and batch allocation are active for ${project.propertyName} (${totalQuoted.toLocaleString()} total BOM units).`,
      `${tonePrefix}Product Acquisition is underway for ${project.propertyName}; shipping dock batches are being coordinated for site arrival.`,
    ];
    return {
      aiExecutiveHeadline: headlines[variantSeed % headlines.length],
      aiMilestoneTagline: 'Stage 3 of 7 • Hardware Procurement & Logistics',
      quextNextStep: 'Finalize warehouse QA, dispatch tracking numbers, and initiate CSM Pre-Implementation Intro.',
      customerActionItem: 'Confirm onsite receiving dock contact and secure storage room availability.',
      highlights: [
        {
          badge: 'HARDWARE BOM',
          title: `${totalQuoted.toLocaleString()} Total Devices Allocated`,
          detail: `${project.bomItems.length} hardware line items verified against quote #${project.quoteNumber}`,
          accentColor: '#4f46e5',
          bgColor: '#eef2ff',
          borderColor: '#c7d2fe',
        },
        {
          badge: 'SHIPPING & LOGISTICS',
          title: shipmentsCount > 0 ? `${shipmentsCount} Shipment Batch(es) Tracked` : 'Warehouse Allocation Active',
          detail: shipmentsCount > 0 ? 'Carrier tracking active on Shipping Dock' : 'Preparing pallet dispatch & tracking IDs',
          accentColor: '#d97706',
          bgColor: '#fffbeb',
          borderColor: '#fde68a',
        },
        {
          badge: 'TARGET TIMELINE',
          title: `Target Go-Live: ${project.targetCompletionDate}`,
          detail: `Schedule Health: ${project.statusTag}`,
          accentColor: '#059669',
          bgColor: '#ecfdf5',
          borderColor: '#a7f3d0',
        },
      ],
    };
  }

  if (norm.includes('csm intro') || norm.includes('pre-implementation')) {
    const headlines = [
      `${tonePrefix}${project.propertyName} has reached CSM Intro (Pre-Implementation) — onboarding with ${csmProfile.name} and finalizing installation scope.`,
      `${tonePrefix}Pre-implementation readiness is active for ${project.propertyName} with Customer Success Manager ${csmProfile.name}.`,
      `${tonePrefix}${project.propertyName} is aligning staff training and SOW field schedules ahead of onsite hardware installation.`,
    ];
    return {
      aiExecutiveHeadline: headlines[variantSeed % headlines.length],
      aiMilestoneTagline: 'Stage 4 of 7 • CSM Onboarding & Pre-Installation Alignment',
      quextNextStep: `Coordinate 1-on-1 staff training with ${csmProfile.name} and mobilize field installation crew.`,
      customerActionItem: `Book your 1-on-1 pre-implementation training session with ${csmProfile.name} and prepare resident install notices.`,
      highlights: [
        {
          badge: 'DESIGNATED CSM',
          title: csmProfile.name,
          detail: `${csmProfile.title} • 1-on-1 Calendar Booking Ready`,
          accentColor: '#059669',
          bgColor: '#ecfdf5',
          borderColor: '#a7f3d0',
        },
        {
          badge: 'INSTALL SCOPE (SOW)',
          title: `${sowCount > 0 ? `${sowCount} Scheduled Scope Phases` : 'Field Crew Mobilization'}`,
          detail: `Partner Crew: ${(project.integratorPartners || ['SKBM']).join(', ')}`,
          accentColor: '#4f46e5',
          bgColor: '#eef2ff',
          borderColor: '#c7d2fe',
        },
        {
          badge: 'HARDWARE READY',
          title: `${totalQuoted.toLocaleString()} Devices Staged`,
          detail: `Install Start: ${project.installationStartDate || project.startDate}`,
          accentColor: '#0284c7',
          bgColor: '#f0f9ff',
          borderColor: '#bae6fd',
        },
      ],
    };
  }

  if (norm.includes('implementation')) {
    const headlines = [
      `${tonePrefix}Active Field Implementation is underway at ${project.propertyName} — ${totalInstalled.toLocaleString()} of ${totalQuoted.toLocaleString()} devices (${hwPct}%) installed.`,
      `${tonePrefix}Field installation crews are actively deploying smart hardware across ${project.propertyName} (${hwPct}% hardware installed).`,
      `${tonePrefix}${project.propertyName} Implementation telemetry: ${totalInstalled.toLocaleString()} devices commissioned and online.`,
    ];
    return {
      aiExecutiveHeadline: headlines[variantSeed % headlines.length],
      aiMilestoneTagline: 'Stage 5 of 7 • Active Onsite Hardware Installation & Commissioning',
      quextNextStep: `Continue unit-by-unit hardware installation (${Math.max(0, totalQuoted - totalInstalled).toLocaleString()} devices remaining) and network commissioning.`,
      customerActionItem: 'Coordinate daily unit key access with onsite maintenance for the installation crew.',
      highlights: [
        {
          badge: 'FIELD PROGRESS',
          title: `${totalInstalled.toLocaleString()} / ${totalQuoted.toLocaleString()} Installed (${hwPct}%)`,
          detail: `${Math.max(0, totalQuoted - totalInstalled).toLocaleString()} devices remaining across ${project.unitsCount} units`,
          accentColor: '#0284c7',
          bgColor: '#f0f9ff',
          borderColor: '#bae6fd',
        },
        {
          badge: 'FIELD OPS TEAM',
          title: `Tech Lead: ${project.assignedFieldTech || 'Sean Gates'}`,
          detail: `Integrator Partner: ${(project.integratorPartners || ['SKBM']).join(', ')}`,
          accentColor: '#4f46e5',
          bgColor: '#eef2ff',
          borderColor: '#c7d2fe',
        },
        {
          badge: 'COMMISSIONING QA',
          title: `${project.installLogs?.length || 0} Field Log Updates Recorded`,
          detail: `Target Completion: ${project.installationEndDate || project.targetCompletionDate}`,
          accentColor: '#059669',
          bgColor: '#ecfdf5',
          borderColor: '#a7f3d0',
        },
      ],
    };
  }

  if (norm.includes('handoff')) {
    const headlines = [
      `${tonePrefix}${project.propertyName} has reached CSM Handoff — transitioning from Implementation Operations to Dedicated CSM ${csmProfile.name}.`,
      `${tonePrefix}Installation at ${project.propertyName} is transitioning to ongoing Customer Success care under ${csmProfile.name}.`,
      `${tonePrefix}CSM Handoff is active for ${project.propertyName}; final 7-day transition review is underway.`,
    ];
    return {
      aiExecutiveHeadline: headlines[variantSeed % headlines.length],
      aiMilestoneTagline: 'Stage 6 of 7 • Customer Success Transition & Final Review',
      quextNextStep: `Complete 7-day post-handoff monitoring and transition ${project.propertyName} to Project Closed.`,
      customerActionItem: `Connect with ${csmProfile.name} for ongoing community adoption and resident support.`,
      highlights: [
        {
          badge: 'CUSTOMER SUCCESS LEAD',
          title: csmProfile.name,
          detail: `${csmProfile.title} • Primary Post-Launch Point of Contact`,
          accentColor: '#7c3aed',
          bgColor: '#f5f3ff',
          borderColor: '#ddd6fe',
        },
        {
          badge: 'DEPLOYMENT SUMMARY',
          title: `${totalInstalled.toLocaleString()} / ${totalQuoted.toLocaleString()} Devices (${hwPct}%)`,
          detail: `${project.unitsCount} residential units configured on ${pmsName}`,
          accentColor: '#059669',
          bgColor: '#ecfdf5',
          borderColor: '#a7f3d0',
        },
        {
          badge: 'AUTO-CLOSE WINDOW',
          title: '7-Day Transition Review',
          detail: 'Seamless handoff from Implementation PM to Customer Success',
          accentColor: '#0284c7',
          bgColor: '#f0f9ff',
          borderColor: '#bae6fd',
        },
      ],
    };
  }

  // Project Closed
  return {
    aiExecutiveHeadline: `${tonePrefix}${project.propertyName} deployment is 100% Complete & Closed — fully live under Customer Success care with ${csmProfile.name}.`,
    aiMilestoneTagline: 'Stage 7 of 7 • Deployment Complete & Live Operations',
    quextNextStep: 'Ongoing cloud monitoring and proactive Customer Success check-ins.',
    customerActionItem: 'No open implementation actions — reach out to your CSM anytime for support.',
    highlights: [
      {
        badge: 'PROJECT COMPLETE',
        title: 'All 7 Milestones Completed',
        detail: `${project.propertyName} is 100% live across ${project.unitsCount} units`,
        accentColor: '#059669',
        bgColor: '#ecfdf5',
        borderColor: '#a7f3d0',
      },
      {
        badge: 'HARDWARE LIVE',
        title: `${totalQuoted.toLocaleString()} Smart Devices Commissioned`,
        detail: 'Locks, Thermostats, Gateways & Common Access online',
        accentColor: '#0284c7',
        bgColor: '#f0f9ff',
        borderColor: '#bae6fd',
      },
      {
        badge: 'ONGOING SUPPORT',
        title: `CSM: ${csmProfile.name}`,
        detail: 'Dedicated Customer Success partnership active',
        accentColor: '#7c3aed',
        bgColor: '#f5f3ff',
        borderColor: '#ddd6fe',
      },
    ],
  };
}

/**
 * Builds an AI-generated, visually digestible Card-Based HTML email for a project's automated bi-weekly / weekly milestone cadence.
 */
export function buildDigestibleMilestoneCardEmailContent({
  project,
  cadence = 'biweekly',
  overrideMilestoneTitle,
  aiTone = 'executive',
  customAiSummary,
  variantSeed = 0,
}: {
  project: OperationProject;
  cadence?: CustomerEmailCadence;
  overrideMilestoneTitle?: string;
  aiTone?: AiEmailTone;
  customAiSummary?: string;
  variantSeed?: number;
}): GeneratedAiCardDigest {
  const logoImgTag = `<img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 26px; width: auto; display: inline-block; vertical-align: middle;" />`;

  const totalMilestones = project.milestones.length || 7;
  const currentMilestoneObj =
    (overrideMilestoneTitle
      ? project.milestones.find((m) => m.title === overrideMilestoneTitle)
      : undefined) ||
    project.milestones.find((m) => m.status === 'In Progress') ||
    project.milestones.find((m) => m.status === 'Upcoming') ||
    project.milestones[project.milestones.length - 1];

  const activeMilestoneTitle = overrideMilestoneTitle || currentMilestoneObj?.title || 'Project kickoff';
  const activeIdx = Math.max(
    0,
    project.milestones.findIndex((m) => m.title === activeMilestoneTitle)
  );
  const completedMilestones = overrideMilestoneTitle
    ? activeIdx
    : project.milestones.filter((m) => m.status === 'Completed').length;
  const milestonePct = Math.min(
    100,
    Math.round((completedMilestones / Math.max(1, totalMilestones)) * 100)
  );

  // Hardware metrics
  const totalQuoted = project.bomItems.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
  const totalInstalled = project.bomItems.reduce((a, b) => a + (Number(b.installedCount) || 0), 0);
  const hwPct = totalQuoted > 0 ? Math.min(100, Math.round((totalInstalled / totalQuoted) * 100)) : 0;

  const lockItems = project.bomItems.filter((b) => isLockBOMItem(b));
  const locksQuoted = lockItems.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
  const locksInstalled = lockItems.reduce((a, b) => a + (Number(b.installedCount) || 0), 0);

  const statItems = project.bomItems.filter(
    (b) => b.category === 'Smart Thermostats' || b.name.toLowerCase().includes('thermostat')
  );
  const statsQuoted = statItems.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
  const statsInstalled = statItems.reduce((a, b) => a + (Number(b.installedCount) || 0), 0);

  const gwItems = project.bomItems.filter(
    (b) => b.category === 'Gateways and Hubs' || b.name.toLowerCase().includes('gateway')
  );
  const gwQuoted = gwItems.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
  const gwInstalled = gwItems.reduce((a, b) => a + (Number(b.installedCount) || 0), 0);

  const aiData = buildMilestoneSpecificCardHighlights(
    project,
    activeMilestoneTitle,
    aiTone,
    variantSeed
  );
  const finalHeadline =
    customAiSummary && customAiSummary.trim().length > 0
      ? customAiSummary.trim()
      : aiData.aiExecutiveHeadline;

  const cadenceLabel = cadence === 'biweekly' ? 'Bi-Weekly (Every 2 Weeks)' : cadence === 'weekly' ? 'Weekly' : 'Milestone';
  const shortCadence = cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly';
  const clientPortalUrl = buildCustomerKickoffPortalUrl(project.id);
  const csmProfile = getCSMCalendarBookingProfile(project.assignedCSM);

  const subject = `[${shortCadence} Milestone Update • ${activeMilestoneTitle}] ${project.propertyName} (${milestonePct}% Milestone Progress)`;
  const summary = `Dispatched AI-formatted ${shortCadence} Card Digest for ${project.propertyName} at stage "${activeMilestoneTitle}" (${milestonePct}% milestones, ${hwPct}% hardware).`;

  // 7-stage visual pills HTML
  const milestonePillsHtml = project.milestones
    .map((m, idx) => {
      const isDone = overrideMilestoneTitle ? idx < activeIdx : m.status === 'Completed';
      const isCurrent = m.title === activeMilestoneTitle;
      const bg = isDone ? '#ecfdf5' : isCurrent ? '#0f172a' : '#f8fafc';
      const color = isDone ? '#047857' : isCurrent ? '#01C38D' : '#64748b';
      const border = isDone ? '#6ee7b7' : isCurrent ? '#01C38D' : '#e2e8f0';
      const icon = isDone ? '✓' : isCurrent ? '●' : `${idx + 1}`;
      return `
        <div style="display: inline-block; margin: 3px 4px 3px 0; padding: 5px 9px; border-radius: 8px; background-color: ${bg}; color: ${color}; border: 1px solid ${border}; font-size: 10px; font-weight: 800; line-height: 1.2;">
          <span>${icon} ${m.title}</span>
        </div>
      `;
    })
    .join('');

  // 3 Highlight mini-cards HTML
  const highlightCardsHtml = aiData.highlights
    .map(
      (h) => `
      <td style="width: 33.33%; padding: 4px; vertical-align: top;">
        <div style="background-color: ${h.bgColor}; border: 1px solid ${h.borderColor}; border-radius: 10px; padding: 12px; height: 100%; box-sizing: border-box;">
          <div style="font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: ${h.accentColor}; margin-bottom: 4px;">
            ${h.badge}
          </div>
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
            ${h.title}
          </div>
          <div style="font-size: 11px; color: #475569; line-height: 1.35;">
            ${h.detail}
          </div>
        </div>
      </td>
    `
    )
    .join('');

  const htmlBody = `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 660px; margin: 0 auto; padding: 20px; background-color: #f1f5f9; border-radius: 16px; color: #0f172a;">
      
      <!-- TOP HEADER CARD -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 20px; border-radius: 14px; margin-bottom: 14px; border-bottom: 3px solid #01C38D;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              ${logoImgTag}
              <span style="margin-left: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; background-color: rgba(1, 195, 141, 0.18); color: #01C38D; border: 1px solid rgba(1, 195, 141, 0.4); padding: 3px 8px; border-radius: 999px;">
                ${cadenceLabel} Update
              </span>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="font-size: 11px; font-weight: 800; background-color: rgba(255,255,255,0.12); color: #f8fafc; padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);">
                ${project.statusTag}
              </span>
            </td>
          </tr>
        </table>

        <div style="margin-top: 14px;">
          <div style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
            ${project.propertyName}
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 3px;">
            ${project.clientName} • ${project.city}, ${project.state} • <strong>${project.unitsCount} Residential Units</strong> • Quote #${project.quoteNumber}
          </div>
        </div>

        <!-- AI Executive Snapshot Pill Box -->
        <div style="margin-top: 14px; padding: 12px 14px; background-color: rgba(255, 255, 255, 0.07); border-left: 3px solid #01C38D; border-radius: 8px; font-size: 12px; color: #e2e8f0; line-height: 1.5;">
          <span style="font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: #01C38D; display: block; margin-bottom: 3px;">
            ✨ AI Executive Snapshot
          </span>
          ${finalHeadline}
        </div>
      </div>

      <!-- CARD 1: ACTIVE MILESTONE & 7-STAGE ROADMAP CARD -->
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td>
              <span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b;">
                CARD 1 • ACTIVE MILESTONE STAGE
              </span>
              <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin-top: 2px;">
                ${activeMilestoneTitle}
              </div>
              <div style="font-size: 11px; color: #059669; font-weight: 700;">
                ${aiData.aiMilestoneTagline}
              </div>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 6px 12px; border-radius: 10px; text-align: right;">
                <div style="font-size: 16px; font-weight: 900; color: #047857;">${milestonePct}%</div>
                <div style="font-size: 9px; font-weight: 800; color: #065f46; text-transform: uppercase;">${completedMilestones}/${totalMilestones} Milestones</div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Progress Bar -->
        <div style="background-color: #f1f5f9; border-radius: 999px; height: 8px; overflow: hidden; margin-bottom: 12px;">
          <div style="background-color: #01C38D; height: 8px; width: ${Math.max(8, milestonePct)}%; border-radius: 999px;"></div>
        </div>

        <!-- 7-Stage Visual Pills -->
        <div style="margin-bottom: 4px;">
          ${milestonePillsHtml}
        </div>
      </div>

      <!-- CARD 2: CURRENT MILESTONE HIGHLIGHTS (3 EMBEDDED MINI-CARDS) -->
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
        <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin-bottom: 8px;">
          CARD 2 • MILESTONE KEY HIGHLIGHTS (${activeMilestoneTitle.toUpperCase()})
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 0 -4px;">
          <tr>
            ${highlightCardsHtml}
          </tr>
        </table>
      </div>

      <!-- CARD 3: HARDWARE & DEPLOYMENT METRICS CARD -->
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
        <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin-bottom: 10px;">
          CARD 3 • HARDWARE &amp; FIELD TELEMETRY SNAPSHOT
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 25%; padding: 4px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase;">Total Devices</div>
                <div style="font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 3px;">${totalInstalled.toLocaleString()} / ${totalQuoted.toLocaleString()}</div>
                <div style="font-size: 10px; font-weight: 800; color: #059669; margin-top: 2px;">${hwPct}% Installed</div>
              </div>
            </td>
            <td style="width: 25%; padding: 4px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase;">Smart Locks</div>
                <div style="font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 3px;">${locksInstalled.toLocaleString()} / ${locksQuoted.toLocaleString()}</div>
                <div style="font-size: 10px; color: #475569; margin-top: 2px;">Access Control</div>
              </div>
            </td>
            <td style="width: 25%; padding: 4px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase;">Thermostats</div>
                <div style="font-size: 15px; font-weight: 900; color: #0f172a; margin-top: 3px;">${statsInstalled.toLocaleString()} / ${statsQuoted.toLocaleString()}</div>
                <div style="font-size: 10px; color: #475569; margin-top: 2px;">Gateways: ${gwInstalled}/${gwQuoted}</div>
              </div>
            </td>
            <td style="width: 25%; padding: 4px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase;">Target Go-Live</div>
                <div style="font-size: 13px; font-weight: 900; color: #0f172a; margin-top: 5px;">${project.targetCompletionDate}</div>
                <div style="font-size: 10px; color: #0284c7; font-weight: 700; margin-top: 2px;">CSM: ${csmProfile.name.split(' ')[0]}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- CARD 4: NEXT 2 WEEKS FOCUS & STAKEHOLDER ACTION CARD -->
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
        <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin-bottom: 8px;">
          CARD 4 • NEXT 14-DAY CADENCE FOCUS &amp; ACTION ITEMS
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 4px; vertical-align: top;">
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px;">
                <div style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #166534; margin-bottom: 4px;">
                  ⚡ QUEXT OPERATIONS NEXT STEP
                </div>
                <div style="font-size: 12px; font-weight: 700; color: #0f172a; line-height: 1.4;">
                  ${aiData.quextNextStep}
                </div>
              </div>
            </td>
            <td style="width: 50%; padding: 4px; vertical-align: top;">
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px;">
                <div style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #1e40af; margin-bottom: 4px;">
                  📋 PROPERTY TEAM ACTION ITEM
                </div>
                <div style="font-size: 12px; font-weight: 700; color: #0f172a; line-height: 1.4;">
                  ${aiData.customerActionItem}
                </div>
              </div>
            </td>
          </tr>
        </table>

        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
          <a href="${clientPortalUrl}" style="display: inline-block; background-color: #01C38D; color: #0f172a; font-weight: 800; font-size: 12px; padding: 9px 16px; border-radius: 8px; text-decoration: none;">
            Open Live Client Portal &amp; Tracker →
          </a>
          <span style="font-size: 11px; color: #64748b; margin-left: 12px;">
            PM: <strong>${project.assignedPM.name}</strong> (${project.assignedPM.email})
          </span>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="text-align: center; font-size: 11px; color: #64748b; padding: 6px 12px;">
        Automated ${cadenceLabel} Milestone Digest dispatched via Quext Communications Tunnel • ${project.propertyName}
      </div>
    </div>
  `;

  return {
    subject,
    summary,
    aiExecutiveHeadline: finalHeadline,
    aiMilestoneTagline: aiData.aiMilestoneTagline,
    quextNextStep: aiData.quextNextStep,
    customerActionItem: aiData.customerActionItem,
    highlights: aiData.highlights,
    htmlBody,
    logType: 'deployment_overview_email',
  };
}

/**
 * Builds a dedicated, card-based Portfolio-Wide Update email specifically for a single recipient
 * who is subscribed to multiple projects, organizing all their shared projects into embedded cards.
 */
export function buildRecipientPortfolioWideCardEmail({
  recipientEmail,
  recipientName,
  sharedProjects,
  primaryProject,
  cadence = 'biweekly',
  aiTone = 'executive',
  customNote,
  senderName,
  senderEmail,
}: {
  recipientEmail: string;
  recipientName?: string;
  sharedProjects: OperationProject[];
  primaryProject: OperationProject;
  cadence?: CustomerEmailCadence;
  aiTone?: AiEmailTone;
  customNote?: string;
  senderName?: string;
  senderEmail?: string;
}): {
  subject: string;
  summary: string;
  htmlBody: string;
  logType: CustomerCommsLog['type'];
} {
  const logoImgTag = `<img src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png" alt="Quext" style="height: 26px; width: auto; display: inline-block; vertical-align: middle;" />`;
  const projects = sharedProjects.length > 0 ? sharedProjects : [primaryProject];
  const totalProperties = projects.length;
  const totalUnits = projects.reduce((acc, p) => acc + (Number(p.unitsCount) || 0), 0);

  let totalDevicesAll = 0;
  let totalInstalledAll = 0;
  const milestonePcts: number[] = [];

  projects.forEach((p) => {
    const q = p.bomItems.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
    const i = p.bomItems.reduce((a, b) => a + (Number(b.installedCount) || 0), 0);
    totalDevicesAll += q;
    totalInstalledAll += i;
    const totM = p.milestones.length || 7;
    const doneM = p.milestones.filter((m) => m.status === 'Completed').length;
    milestonePcts.push(Math.round((doneM / totM) * 100));
  });

  const avgMilestonePct =
    milestonePcts.length > 0
      ? Math.round(milestonePcts.reduce((a, b) => a + b, 0) / milestonePcts.length)
      : 0;
  const overallHwPct =
    totalDevicesAll > 0 ? Math.round((totalInstalledAll / totalDevicesAll) * 100) : 0;

  const shortCadence = cadence === 'biweekly' ? 'Bi-Weekly' : 'Weekly';
  const projectNamesList =
    projects.length <= 3
      ? projects.map((p) => p.propertyName).join(', ')
      : `${projects[0].propertyName}, ${projects[1].propertyName} + ${projects.length - 2} more`;

  const subject = `[${shortCadence} Portfolio-Wide Update] ${totalProperties} Shared Properties (${projectNamesList}) — ${avgMilestonePct}% Avg Milestone Progress`;
  const summary = `Dispatched consolidated ${shortCadence} Portfolio-Wide Card Digest to ${recipientEmail} covering ${totalProperties} shared projects (${projects.map((p) => p.propertyName).join(', ')}).`;

  const projectCardsHtml = projects
    .map((proj, index) => {
      const totM = proj.milestones.length || 7;
      const doneM = proj.milestones.filter((m) => m.status === 'Completed').length;
      const curM =
        proj.milestones.find((m) => m.status === 'In Progress') ||
        proj.milestones.find((m) => m.status === 'Upcoming') ||
        proj.milestones[proj.milestones.length - 1];
      const activeTitle = curM?.title || 'Project kickoff';
      const mPct = Math.round((doneM / totM) * 100);

      const qDev = proj.bomItems.reduce((a, b) => a + (Number(b.quantity) || 0), 0);
      const iDev = proj.bomItems.reduce((a, b) => a + (Number(b.installedCount) || 0), 0);
      const dPct = qDev > 0 ? Math.round((iDev / qDev) * 100) : 0;

      const aiCardInfo = buildMilestoneSpecificCardHighlights(proj, activeTitle, aiTone, index);
      const portalUrl = buildCustomerKickoffPortalUrl(proj.id);

      const highlightBadges = aiCardInfo.highlights
        .map(
          (h) => `
          <td style="width: 33.33%; padding: 3px; vertical-align: top;">
            <div style="background-color: ${h.bgColor}; border: 1px solid ${h.borderColor}; border-radius: 8px; padding: 8px 10px;">
              <div style="font-size: 8px; font-weight: 900; color: ${h.accentColor}; text-transform: uppercase;">${h.badge}</div>
              <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 2px;">${h.title}</div>
              <div style="font-size: 10px; color: #475569; margin-top: 1px;">${h.detail}</div>
            </div>
          </td>
        `
        )
        .join('');

      return `
        <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 14px; overflow: hidden; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <!-- Project Card Top Bar -->
          <div style="background-color: #0f172a; color: #ffffff; padding: 12px 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td>
                  <span style="font-size: 10px; font-weight: 900; color: #01C38D; text-transform: uppercase; letter-spacing: 0.06em;">
                    PROJECT CARD ${index + 1} OF ${totalProperties}
                  </span>
                  <div style="font-size: 16px; font-weight: 900; color: #ffffff; margin-top: 2px;">
                    ${proj.propertyName}
                  </div>
                  <div style="font-size: 11px; color: #94a3b8;">
                    ${proj.city}, ${proj.state} • <strong>${proj.unitsCount} Units</strong> • PM: ${proj.assignedPM.name}
                  </div>
                </td>
                <td style="text-align: right; vertical-align: top;">
                  <span style="display: inline-block; font-size: 10px; font-weight: 800; background-color: rgba(1, 195, 141, 0.2); color: #01C38D; border: 1px solid rgba(1, 195, 141, 0.4); padding: 3px 8px; border-radius: 6px;">
                    ● ${activeTitle}
                  </span>
                  <div style="font-size: 10px; color: #cbd5e1; margin-top: 4px;">
                    Go-Live: <strong>${proj.targetCompletionDate}</strong>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Project Card Body -->
          <div style="padding: 14px 16px;">
            <div style="font-size: 12px; color: #334155; margin-bottom: 10px; line-height: 1.45;">
              ${aiCardInfo.aiExecutiveHeadline}
            </div>

            <!-- Progress Strip -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 11px;">
              <tr>
                <td style="font-weight: 800; color: #0f172a;">
                  Milestones: ${doneM}/${totM} (${mPct}%)
                </td>
                <td style="text-align: right; font-weight: 800; color: #0284c7;">
                  Hardware Installed: ${iDev.toLocaleString()}/${qDev.toLocaleString()} (${dPct}%)
                </td>
              </tr>
            </table>
            <div style="background-color: #f1f5f9; border-radius: 999px; height: 7px; overflow: hidden; margin-bottom: 12px;">
              <div style="background-color: #01C38D; height: 7px; width: ${Math.max(8, mPct)}%; border-radius: 999px;"></div>
            </div>

            <!-- 3 Mini Highlight Cards -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
              <tr>
                ${highlightBadges}
              </tr>
            </table>

            <!-- Next Step & Action Bar -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: #0f172a;">Next Step:</strong> <span style="color: #475569;">${aiCardInfo.quextNextStep}</span>
              </div>
              <a href="${portalUrl}" style="background-color: #0f172a; color: #01C38D; font-weight: 800; font-size: 10px; padding: 6px 10px; border-radius: 6px; text-decoration: none; white-space: nowrap; margin-left: 8px;">
                View Project →
              </a>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const htmlBody = `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 20px; background-color: #f1f5f9; border-radius: 16px; color: #0f172a;">
      <!-- PORTFOLIO HEADER CARD -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #132d46 100%); color: #ffffff; padding: 20px; border-radius: 14px; margin-bottom: 14px; border-bottom: 3px solid #01C38D;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td>
              ${logoImgTag}
              <span style="margin-left: 10px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; background-color: rgba(1, 195, 141, 0.2); color: #01C38D; border: 1px solid rgba(1, 195, 141, 0.45); padding: 3px 9px; border-radius: 999px;">
                Portfolio-Wide Consolidated Digest
              </span>
            </td>
            <td style="text-align: right; font-size: 11px; color: #cbd5e1;">
              ${shortCadence} Cadence • <strong>${totalProperties} Shared Projects</strong>
            </td>
          </tr>
        </table>

        <div style="margin-top: 14px;">
          <div style="font-size: 19px; font-weight: 900; color: #ffffff;">
            Consolidated Multi-Property Deployment Update
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
            Prepared specifically for <strong style="color: #ffffff;">${recipientName ? `${recipientName} (${recipientEmail})` : recipientEmail}</strong> — combining all ${totalProperties} Quext projects associated with your email into a single, easy-to-scan digest.
          </div>
        </div>

        ${
          customNote && customNote.trim()
            ? `<div style="margin-top: 12px; padding: 10px 12px; background-color: rgba(255,255,255,0.08); border-left: 3px solid #01C38D; border-radius: 8px; font-size: 12px; color: #e2e8f0;">${customNote.trim()}</div>`
            : ''
        }

        <!-- PORTFOLIO KPI SUMMARY CARDS -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 14px;">
          <tr>
            <td style="width: 25%; padding: 4px;">
              <div style="background-color: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; text-transform: uppercase; font-weight: 800; color: #94a3b8;">Shared Projects</div>
                <div style="font-size: 18px; font-weight: 900; color: #ffffff; margin-top: 2px;">${totalProperties}</div>
              </div>
            </td>
            <td style="width: 25%; padding: 4px;">
              <div style="background-color: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; text-transform: uppercase; font-weight: 800; color: #94a3b8;">Total Units</div>
                <div style="font-size: 18px; font-weight: 900; color: #ffffff; margin-top: 2px;">${totalUnits.toLocaleString()}</div>
              </div>
            </td>
            <td style="width: 25%; padding: 4px;">
              <div style="background-color: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; text-transform: uppercase; font-weight: 800; color: #94a3b8;">Avg Milestone</div>
                <div style="font-size: 18px; font-weight: 900; color: #01C38D; margin-top: 2px;">${avgMilestonePct}%</div>
              </div>
            </td>
            <td style="width: 25%; padding: 4px;">
              <div style="background-color: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; text-transform: uppercase; font-weight: 800; color: #94a3b8;">Hardware Installed</div>
                <div style="font-size: 18px; font-weight: 900; color: #38bdf8; margin-top: 2px;">${overallHwPct}%</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- EMBEDDED PROJECT CARDS -->
      ${projectCardsHtml}

      <!-- FOOTER -->
      <div style="text-align: center; font-size: 11px; color: #64748b; padding: 8px 12px;">
        Sent by <strong>${senderName || primaryProject.assignedPM.name}</strong> (${senderEmail || primaryProject.assignedPM.email}) via Quext Communications Tunnel • Single-Email Portfolio Consolidation
      </div>
    </div>
  `;

  return {
    subject,
    summary,
    htmlBody,
    logType: 'deployment_overview_email',
  };
}

