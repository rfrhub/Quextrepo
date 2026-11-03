import { OperationProject, CustomerCommsLog, CustomerEmailCadence, buildCustomerKickoffPortalUrl, getCSMCalendarBookingProfile } from '../types';
import { loadStoredProjects, saveStoredProjects } from '../data/initialData';

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

  // Update primary project in active React state
  const updatedPrimary = updatedStored.find((p) => p.id === primaryProject.id);
  if (updatedPrimary && onUpdateProject) {
    onUpdateProject(updatedPrimary);
  }
}
