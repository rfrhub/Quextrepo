import {
  OperationProject,
  CustomerCommsLog,
  CustomerEmailCadence,
  formatCustomerEmailCadenceLabel,
  CommsTunnelConfiguration,
  InstallLogEntry,
  buildCustomerKickoffPortalUrl,
  getCSMCalendarBookingProfile,
  isLockBOMItem,
  getLockFinishSummaryTag,
  getDockItemTrackingNumbers,
} from '../types';
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

const IGNORED_PLACEHOLDER_EMAILS = new Set([
  'property@client.com',
  'asset.manager@equitylifestyle.com',
  'vip.investor@realestatecorp.com',
  'pending-intake@onequext.com',
  'stakeholder@property.com',
  'regional@property.com',
  'vp@equity.com',
  'owner@property.com',
  'unk',
  'n/a',
  'none',
  'tbd',
]);

export function isGenuineStakeholderEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes('@')) return false;
  if (IGNORED_PLACEHOLDER_EMAILS.has(clean)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
}

/**
 * Merges live React/Firestore projects (`allProjects`) with `loadStoredProjects()` (`localStorage`)
 * so that any recipient email added or updated on any project is genuinely and immediately discoverable.
 */
export function getUnifiedGenuineProjectsPool(
  allProjects?: OperationProject[],
  currentProjectOverride?: OperationProject
): OperationProject[] {
  const stored = loadStoredProjects();
  const map = new Map<string, OperationProject>();

  stored.forEach((p) => {
    map.set(p.id, p);
  });

  if (allProjects && allProjects.length > 0) {
    allProjects.forEach((liveProj) => {
      const existing = map.get(liveProj.id);
      if (!existing) {
        map.set(liveProj.id, liveProj);
      } else {
        const liveTime = liveProj.lastUpdated ? new Date(liveProj.lastUpdated).getTime() : 0;
        const storedTime = existing.lastUpdated ? new Date(existing.lastUpdated).getTime() : 0;
        const newer = liveTime >= storedTime ? liveProj : existing;
        const older = liveTime >= storedTime ? existing : liveProj;

        // Preserve any genuine communityEmail / staffRoles / additionalCustomerEmails if one side was empty
        const mergedAdditional = Array.from(
          new Set([
            ...(newer.additionalCustomerEmails || []),
            ...(newer.customerIntake?.additionalCustomerEmails || []),
            ...(liveTime === storedTime ? older.additionalCustomerEmails || [] : []),
          ])
        ).filter((em) => isGenuineStakeholderEmail(em));

        map.set(liveProj.id, {
          ...newer,
          additionalCustomerEmails: mergedAdditional,
          customerIntake: {
            ...(newer.customerIntake || {
              pmsSoftware: 'None',
              commonAreaDoors: [],
              staffRoles: [],
            }),
            communityEmail:
              newer.customerIntake?.communityEmail ||
              older.customerIntake?.communityEmail ||
              '',
            subscriberEmail:
              newer.customerIntake?.subscriberEmail ||
              older.customerIntake?.subscriberEmail ||
              '',
            additionalCustomerEmails: mergedAdditional,
          },
        });
      }
    });
  }

  if (currentProjectOverride) {
    map.set(currentProjectOverride.id, currentProjectOverride);
  }

  return Array.from(map.values());
}

export interface GenuineProjectEmailEntry {
  email: string;
  roleOrTitle: string;
  contactName?: string;
  isCommunitySiteContact: boolean;
  isStaffMember: boolean;
  isExplicitTunnelRecipient: boolean;
}

/**
 * Extracts all genuine customer/stakeholder email addresses configured on a project across all real fields:
 * - customerIntake.communityEmail
 * - customerIntake.subscriberEmail
 * - customerIntake.staffRoles
 * - additionalCustomerEmails & customerIntake.additionalCustomerEmails
 * - productAcceptanceSubmission.signedByEmail
 * - sowSubmissions (customerContactEmail / respondentEmail)
 */
export function extractGenuineProjectRecipientEntries(
  proj: OperationProject
): GenuineProjectEmailEntry[] {
  const results = new Map<string, GenuineProjectEmailEntry>();
  const isMockProject = (proj.propertyName || '').toUpperCase().includes('MOCK PROJECT');

  const addTokens = (
    raw: string | undefined | null,
    meta: Omit<GenuineProjectEmailEntry, 'email'>
  ) => {
    if (!raw) return;
    const tokens = raw.split(/[,;\s\n]+/).map((t) => t.trim());
    for (const token of tokens) {
      if (!isGenuineStakeholderEmail(token)) continue;
      const lower = token.toLowerCase();
      // For the seeded mock project, ignore canned mock emails unless explicitly added to additionalCustomerEmails
      if (
        isMockProject &&
        !meta.isExplicitTunnelRecipient &&
        (lower === 'pm@sageinvestment.com' ||
          lower.includes('@oonequext') ||
          lower.includes('@onequext.com'))
      ) {
        continue;
      }
      if (!results.has(lower)) {
        results.set(lower, {
          email: lower,
          ...meta,
        });
      }
    }
  };

  // 1. Community Site Contact & Digest Subscriber
  addTokens(proj.customerIntake?.communityEmail, {
    roleOrTitle: 'Community Site Contact',
    contactName: proj.clientName,
    isCommunitySiteContact: true,
    isStaffMember: false,
    isExplicitTunnelRecipient: false,
  });

  addTokens(proj.customerIntake?.subscriberEmail, {
    roleOrTitle: 'Digest Subscriber Contact',
    contactName: proj.clientName,
    isCommunitySiteContact: true,
    isStaffMember: false,
    isExplicitTunnelRecipient: false,
  });

  // 2. Onsite Staff Roles (Community Manager, Regional PM, Property POC, etc.)
  (proj.customerIntake?.staffRoles || []).forEach((s) => {
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim();
    const cleanName =
      fullName && !['unk', 'n/a', 'contact'].includes(fullName.toLowerCase())
        ? fullName
        : proj.clientName;
    addTokens(s.email, {
      roleOrTitle: s.roleOrTitle || `${s.permissionLevel || 'Property'} Staff Role`,
      contactName: cleanName,
      isCommunitySiteContact: false,
      isStaffMember: true,
      isExplicitTunnelRecipient: false,
    });
  });

  // 3. Communications Tunnel / Additional Customer Distribution Emails
  const additionalList = [
    ...(proj.additionalCustomerEmails || []),
    ...(proj.customerIntake?.additionalCustomerEmails || []),
    ...(proj.portfolioConsolidatedEmails || []),
  ];
  additionalList.forEach((em) => {
    addTokens(em, {
      roleOrTitle: 'Communications Tunnel Recipient',
      contactName: proj.clientName,
      isCommunitySiteContact: false,
      isStaffMember: false,
      isExplicitTunnelRecipient: true,
    });
  });

  // 4. Product Acceptance Signer Email
  if (proj.productAcceptanceSubmission?.signedByEmail) {
    addTokens(proj.productAcceptanceSubmission.signedByEmail, {
      roleOrTitle: proj.productAcceptanceSubmission.signedByTitle || 'Delivery Acceptance Signer',
      contactName: proj.productAcceptanceSubmission.signedByName || proj.clientName,
      isCommunitySiteContact: false,
      isStaffMember: true,
      isExplicitTunnelRecipient: false,
    });
  }

  // 5. SOW Submissions Customer Email
  (proj.sowSubmissions || []).forEach((sub: any) => {
    const sowEmail = sub?.customerContactEmail || sub?.respondentEmail || sub?.contactEmail;
    if (sowEmail) {
      addTokens(sowEmail, {
        roleOrTitle: 'SOW Submission Contact',
        contactName: sub?.customerContactName || proj.clientName,
        isCommunitySiteContact: true,
        isStaffMember: false,
        isExplicitTunnelRecipient: false,
      });
    }
  });

  return Array.from(results.values());
}

/**
 * Scans all real candidate projects to detect if any of the recipient emails are genuinely registered
 * on OTHER properties in the portfolio.
 */
export function detectPortfolioContacts(
  recipientEmails: string[] | string,
  currentProjectId?: string,
  allProjects?: OperationProject[]
): PortfolioDetectionResult {
  const projects = getUnifiedGenuineProjectsPool(allProjects);
  const candidateProjects = projects.filter(
    (p) =>
      (!currentProjectId || p.id !== currentProjectId) &&
      !(p.propertyName || '').toUpperCase().includes('MOCK PROJECT')
  );

  const rawTokens = Array.isArray(recipientEmails)
    ? recipientEmails.flatMap((r) => r.split(/[,;\s\n]+/))
    : recipientEmails.split(/[,;\s\n]+/);

  const normalizedRecipients = Array.from(
    new Set(
      rawTokens
        .map((r) => r.trim().toLowerCase())
        .filter((r) => isGenuineStakeholderEmail(r))
    )
  );

  const matchedContactsMap = new Map<string, MatchedPortfolioContact>();

  for (const email of normalizedRecipients) {
    const tiedProperties: OperationProject[] = [];
    const propertyDetails: MatchedPortfolioPropertyDetail[] = [];
    let detectedName: string | undefined;
    let detectedRole: string | undefined;

    for (const proj of candidateProjects) {
      const entries = extractGenuineProjectRecipientEntries(proj);
      const matchedEntry = entries.find((e) => e.email === email);

      if (matchedEntry) {
        tiedProperties.push(proj);
        propertyDetails.push({
          project: proj,
          roleOrTitle: matchedEntry.roleOrTitle,
          contactName: matchedEntry.contactName,
          isCommunitySiteContact: matchedEntry.isCommunitySiteContact,
          isStaffMember: matchedEntry.isStaffMember,
        });
        if (!detectedName && matchedEntry.contactName) detectedName = matchedEntry.contactName;
        if (!detectedRole && matchedEntry.roleOrTitle) detectedRole = matchedEntry.roleOrTitle;
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

/**
 * Genuine live search across all projects in the database for any customer email or domain.
 * Never invents or mocks data — strictly returns real project associations from the database.
 */
export function searchGenuinePortfolioEmails(
  searchQuery: string,
  currentProjectId?: string,
  allProjects?: OperationProject[]
): {
  email: string;
  contactName?: string;
  projects: { project: OperationProject; roleOrTitle: string }[];
}[] {
  const pool = getUnifiedGenuineProjectsPool(allProjects);
  const byEmail = new Map<
    string,
    {
      email: string;
      contactName?: string;
      projects: { project: OperationProject; roleOrTitle: string }[];
    }
  >();

  pool.forEach((proj) => {
    if (currentProjectId && proj.id === currentProjectId) return;
    if ((proj.propertyName || '').toUpperCase().includes('MOCK PROJECT')) return;
    const entries = extractGenuineProjectRecipientEntries(proj);
    entries.forEach((entry) => {
      const existing = byEmail.get(entry.email) || {
        email: entry.email,
        contactName: entry.contactName,
        projects: [],
      };
      if (!existing.contactName && entry.contactName) {
        existing.contactName = entry.contactName;
      }
      if (!existing.projects.some((p) => p.project.id === proj.id)) {
        existing.projects.push({ project: proj, roleOrTitle: entry.roleOrTitle });
      }
      byEmail.set(entry.email, existing);
    });
  });

  const q = searchQuery.trim().toLowerCase();
  const allResults = Array.from(byEmail.values());
  if (!q) {
    // When no query is typed, only return genuine multi-project shared emails (>= 2 projects)
    return allResults
      .filter((item) => item.projects.length >= 2)
      .sort((a, b) => b.projects.length - a.projects.length);
  }

  return allResults
    .filter(
      (item) =>
        item.email.includes(q) ||
        (item.contactName || '').toLowerCase().includes(q) ||
        item.projects.some(
          (p) =>
            p.project.propertyName.toLowerCase().includes(q) ||
            p.project.clientName.toLowerCase().includes(q)
        )
    )
    .sort((a, b) => b.projects.length - a.projects.length);
}

/**
 * Gathers all genuine installer logs on a project (combining project.installLogs and BOM item postItLogs).
 */
export function getAllProjectInstallLogs(project: OperationProject): InstallLogEntry[] {
  const seen = new Set<string>();
  const combined: InstallLogEntry[] = [];

  (project.installLogs || []).forEach((log) => {
    if (log && log.id && !seen.has(log.id)) {
      seen.add(log.id);
      combined.push(log);
    }
  });

  (project.bomItems || []).forEach((bom) => {
    (bom.postItLogs || []).forEach((log) => {
      if (log && log.id && !seen.has(log.id)) {
        seen.add(log.id);
        combined.push({
          ...log,
          itemId: log.itemId || bom.id,
          itemName: log.itemName || bom.name,
        });
      }
    });
  });

  return combined;
}

/**
 * Determines whether a milestone title (or index) is Stage 1 (Project kickoff) or Stage 2 (Portal Buildout).
 */
export function isStageOneOrTwo(
  milestoneTitle?: string | null,
  project?: OperationProject
): boolean {
  if (!milestoneTitle) return false;
  const norm = milestoneTitle.trim().toLowerCase();
  if (norm.includes('kickoff') || norm.includes('portal')) {
    return true;
  }
  if (project && project.milestones) {
    const idx = project.milestones.findIndex(
      (m) => m.title.trim().toLowerCase() === norm
    );
    if (idx === 0 || idx === 1) return true;
  }
  return false;
}

export interface Stage1And2FinalizationItem {
  id: string;
  stageNumber: 1 | 2;
  stageLabel: 'Stage 1: Project kickoff' | 'Stage 2: Portal Buildout';
  title: string;
  categoryLabel: string;
  promptOrDetailNeeded: string;
  replyFieldLabel: string;
  currentValueSummary: string;
  isAlreadyProvidedOnProject: boolean;
  isFinalizedViaEmailReply: boolean;
  emailReplyDetails?: {
    responseText: string;
    finalizedAt: string;
    respondentEmail?: string;
  };
  isCustom?: boolean;
}

/**
 * Evaluates all real Stage 1 (Project kickoff) and Stage 2 (Portal Buildout) items that a PM may be
 * waiting on the customer to finalize, along with live project status and any custom items added by the PM.
 */
export function getStage1And2CustomerFinalizationItems(
  project: OperationProject,
  commsConfig?: CommsTunnelConfiguration
): Stage1And2FinalizationItem[] {
  const cfg = commsConfig || project.commsTunnelConfig;
  const customPrompts = cfg?.stage1And2ItemCustomPrompts || {};
  const finalizedMap = cfg?.finalizedViaEmailReplyItemIds || {};
  const intake = project.customerIntake;

  const pmsName = intake?.pmsSoftware && intake.pmsSoftware !== 'None' ? intake.pmsSoftware : '';
  const hasPmsCreds = Boolean(
    pmsName &&
      (intake?.pmsNoticeAcknowledged ||
        intake?.entrataCredentials?.username ||
        finalizedMap['stage1_pms_credentials'])
  );

  const commonDoorsCount = intake?.commonAreaDoors?.length || 0;
  const hasDoorsFinalized = Boolean(
    (commonDoorsCount > 0 && intake?.doorsConfirmedByCustomer) ||
      finalizedMap['stage1_common_doors']
  );

  const staffCount = intake?.staffRoles?.length || 0;
  const hasStaffFinalized = Boolean(staffCount > 0 || finalizedMap['stage1_staff_roles']);

  const hasSiteMap = Boolean(
    intake?.sitePlanPdfName ||
      intake?.sitePlanConfirmedEdited ||
      finalizedMap['stage1_site_maps_gateway']
  );

  const hasThermostatRange = Boolean(
    (intake?.thermostatTempRange && intake.thermostatTempRange.trim()) ||
      finalizedMap['stage1_thermostat_vacant_temp']
  );

  const hasFireKeys = Boolean(
    (intake?.fireKeysFobs && intake.fireKeysFobs.trim()) ||
      (project.communityDetails?.masterFobsKnoxBox &&
        project.communityDetails.masterFobsKnoxBox.trim()) ||
      finalizedMap['stage1_fire_keys_knox']
  );

  const lockBomItems = (project.bomItems || []).filter((b) => isLockBOMItem(b));
  const configuredLocks = lockBomItems.filter((b) => Boolean(b.lockFinishConfig));
  const hasLockFinishesFinalized = Boolean(
    (lockBomItems.length > 0 && configuredLocks.length === lockBomItems.length) ||
      finalizedMap['stage2_lock_finish_trim']
  );
  const lockFinishSummary =
    configuredLocks.length > 0
      ? configuredLocks
          .map((b) => getLockFinishSummaryTag(b.lockFinishConfig))
          .filter(Boolean)
          .slice(0, 2)
          .join(', ')
      : '';

  const hasNfcFinalized = Boolean(
    intake?.nfcWalletConfirmedByCustomer ||
      intake?.nfcCardArtPhotoName ||
      finalizedMap['stage2_nfc_wallet_art']
  );

  const hasQrFinalized = Boolean(
    intake?.qrIntercomConfirmedByCustomer ||
      intake?.qrIntercomLogoName ||
      finalizedMap['stage2_qr_intercom_logo']
  );

  const hasUnitHierarchyFinalized = Boolean(
    intake?.walkthroughCompleted || finalizedMap['stage2_unit_hierarchy_pms_sync']
  );

  const hasCustomGroupsFinalized = Boolean(
    (intake?.customGroupsNotes && intake.customGroupsNotes.trim()) ||
      finalizedMap['stage2_custom_access_groups']
  );

  const builtInItems: Omit<Stage1And2FinalizationItem, 'isFinalizedViaEmailReply' | 'emailReplyDetails'>[] = [
    // STAGE 1: PROJECT KICKOFF ITEMS
    {
      id: 'stage1_pms_credentials',
      stageNumber: 1,
      stageLabel: 'Stage 1: Project kickoff',
      title: 'PMS Software & API Integration Credentials',
      categoryLabel: 'PMS Integration',
      promptOrDetailNeeded:
        customPrompts['stage1_pms_credentials'] ||
        `Please confirm your Property Management Software (${pmsName || 'Yardi / Entrata / RealPage / AppFolio'}) and reply with your property code or API integration credentials so we can sync your unit roster.`,
      replyFieldLabel: 'PMS Software Name & Property Code / API Contact',
      currentValueSummary: pmsName
        ? `PMS: ${pmsName}${intake?.pmsNoticeAcknowledged ? ' (Notice Acknowledged)' : ' (Awaiting API Credentials)'}`
        : 'Not finalized yet',
      isAlreadyProvidedOnProject: hasPmsCreds,
    },
    {
      id: 'stage1_common_doors',
      stageNumber: 1,
      stageLabel: 'Stage 1: Project kickoff',
      title: 'Common Area Doors & Access Control Schedule',
      categoryLabel: 'Common Doors',
      promptOrDetailNeeded:
        customPrompts['stage1_common_doors'] ||
        `Please finalize the names and building/area locations for all common area doors (e.g., Clubhouse, Fitness Center, Pool Gates, Leasing Office)${
          intake?.doorNamesFollowUpDate ? ` — target follow-up date: ${intake.doorNamesFollowUpDate}` : ''
        }.`,
      replyFieldLabel: 'Common Area Door Names & Building/Zone Locations',
      currentValueSummary:
        commonDoorsCount > 0
          ? `${commonDoorsCount} door(s) listed (${intake?.commonAreaDoors
              ?.slice(0, 3)
              .map((d) => d.doorName)
              .join(', ')})`
          : '0 common doors confirmed',
      isAlreadyProvidedOnProject: hasDoorsFinalized,
    },
    {
      id: 'stage1_staff_roles',
      stageNumber: 1,
      stageLabel: 'Stage 1: Project kickoff',
      title: 'Onsite Staff Roles & Portal Admin Roster',
      categoryLabel: 'Staff Roster',
      promptOrDetailNeeded:
        customPrompts['stage1_staff_roles'] ||
        'Please provide the full name, email address, phone number, role/title, and requested door permissions for each onsite staff member needing Quext Portal access.',
      replyFieldLabel: 'Staff Member Name, Email, Title & Door Permissions',
      currentValueSummary:
        staffCount > 0
          ? `${staffCount} staff member(s) on file (${intake?.staffRoles
              ?.slice(0, 2)
              .map((s) => `${s.firstName} ${s.lastName}`.trim())
              .join(', ')})`
          : 'No staff admin logins finalized',
      isAlreadyProvidedOnProject: hasStaffFinalized,
    },
    {
      id: 'stage1_site_maps_gateway',
      stageNumber: 1,
      stageLabel: 'Stage 1: Project kickoff',
      title: 'Site Maps & Gateway Mounting Locations',
      categoryLabel: 'Site Plan & Gateways',
      promptOrDetailNeeded:
        customPrompts['stage1_site_maps_gateway'] ||
        'Please reply with your community site map PDF or confirm the clubhouse/building roof & IDF closet locations with power and ethernet for LoRaWAN gateway mounting.',
      replyFieldLabel: 'Site Map / Gateway Roof & IDF Location Confirmation',
      currentValueSummary: intake?.sitePlanPdfName
        ? `Uploaded: ${intake.sitePlanPdfName}`
        : 'Awaiting site map / gateway location confirmation',
      isAlreadyProvidedOnProject: hasSiteMap,
    },
    {
      id: 'stage1_thermostat_vacant_temp',
      stageNumber: 1,
      stageLabel: 'Stage 1: Project kickoff',
      title: 'Vacant Unit Thermostat Temperature Range',
      categoryLabel: 'Energy Policy',
      promptOrDetailNeeded:
        customPrompts['stage1_thermostat_vacant_temp'] ||
        'Please confirm your preferred vacant unit temperature range (e.g., 62°F Heat / 78°F Cool) for automated vacant unit climate control.',
      replyFieldLabel: 'Approved Vacant Unit Heat °F / Cool °F Range',
      currentValueSummary: intake?.thermostatTempRange
        ? `Current: ${intake.thermostatTempRange}`
        : 'Awaiting temperature range confirmation',
      isAlreadyProvidedOnProject: hasThermostatRange,
    },
    {
      id: 'stage1_fire_keys_knox',
      stageNumber: 1,
      stageLabel: 'Stage 1: Project kickoff',
      title: 'Fire Marshal Knox Box & Master Fobs / Keys',
      categoryLabel: 'Site Access & Fire Keys',
      promptOrDetailNeeded:
        customPrompts['stage1_fire_keys_knox'] ||
        'Please confirm local Fire Marshal Knox Box requirements and how our field crew will check out master keys/fobs onsite.',
      replyFieldLabel: 'Fire Knox Box & Master Key/Fob Instructions',
      currentValueSummary:
        intake?.fireKeysFobs || project.communityDetails?.masterFobsKnoxBox || 'Awaiting confirmation',
      isAlreadyProvidedOnProject: hasFireKeys,
    },

    // STAGE 2: PORTAL BUILDOUT ITEMS
    {
      id: 'stage2_lock_finish_trim',
      stageNumber: 2,
      stageLabel: 'Stage 2: Portal Buildout',
      title: 'Smart Lock Color Finish, Trim & Lever Style',
      categoryLabel: 'Hardware Finishes',
      promptOrDetailNeeded:
        customPrompts['stage2_lock_finish_trim'] ||
        'Please finalize your smart lock color finish (e.g., Satin Nickel, Matte Black, Aged Bronze), escutcheon trim, and lever design so we can lock in Portal Buildout & hardware fulfillment.',
      replyFieldLabel: 'Confirmed Lock Finish, Trim & Lever Selection',
      currentValueSummary: lockFinishSummary || 'Awaiting customer finish sign-off',
      isAlreadyProvidedOnProject: hasLockFinishesFinalized,
    },
    {
      id: 'stage2_nfc_wallet_art',
      stageNumber: 2,
      stageLabel: 'Stage 2: Portal Buildout',
      title: 'Apple / Google NFC Mobile Wallet & Card Artwork',
      categoryLabel: 'NFC Wallet Credentials',
      promptOrDetailNeeded:
        customPrompts['stage2_nfc_wallet_art'] ||
        'Please confirm your Apple Wallet / Google Wallet NFC credential selection (Yes/No) and reply with your community card artwork or brand color preference.',
      replyFieldLabel: 'NFC Wallet Confirmation (Yes/No) & Card Artwork Details',
      currentValueSummary: intake?.nfcCardArtPhotoName
        ? `Artwork: ${intake.nfcCardArtPhotoName}`
        : intake?.nfcWalletConfirmedByCustomer
        ? `Confirmed: ${intake.nfcWalletConfirmedByCustomer.toUpperCase()}`
        : project.useNfcWallet
        ? 'NFC Enabled — Awaiting Card Art / Customer Confirmation'
        : 'Awaiting NFC Wallet confirmation',
      isAlreadyProvidedOnProject: hasNfcFinalized,
    },
    {
      id: 'stage2_qr_intercom_logo',
      stageNumber: 2,
      stageLabel: 'Stage 2: Portal Buildout',
      title: 'QR Video Intercom Directory & Community Logo',
      categoryLabel: 'QR Intercom Branding',
      promptOrDetailNeeded:
        customPrompts['stage2_qr_intercom_logo'] ||
        'Please confirm QR Video Intercom directory settings for entry doors/gates and reply with your high-resolution community logo.',
      replyFieldLabel: 'QR Intercom Confirmation (Yes/No) & Logo / Directory Notes',
      currentValueSummary: intake?.qrIntercomLogoName
        ? `Logo: ${intake.qrIntercomLogoName}`
        : intake?.qrIntercomConfirmedByCustomer
        ? `Confirmed: ${intake.qrIntercomConfirmedByCustomer.toUpperCase()}`
        : project.useQrIntercom
        ? 'QR Intercom Enabled — Awaiting Community Logo'
        : 'Awaiting QR Intercom confirmation',
      isAlreadyProvidedOnProject: hasQrFinalized,
    },
    {
      id: 'stage2_unit_hierarchy_pms_sync',
      stageNumber: 2,
      stageLabel: 'Stage 2: Portal Buildout',
      title: 'Building & Unit Numbering Hierarchy Verification',
      categoryLabel: 'Portal Unit Tree',
      promptOrDetailNeeded:
        customPrompts['stage2_unit_hierarchy_pms_sync'] ||
        `Please confirm that your building numbers and ${project.unitsCount}-unit numbering format match your ${pmsName || 'PMS'} resident roster so resident invites route to the right doors.`,
      replyFieldLabel: 'Building & Unit Numbering Hierarchy Confirmation',
      currentValueSummary: intake?.walkthroughCompleted
        ? `Verified (${project.unitsCount} units)`
        : `Awaiting verification for ${project.unitsCount} units`,
      isAlreadyProvidedOnProject: hasUnitHierarchyFinalized,
    },
    {
      id: 'stage2_custom_access_groups',
      stageNumber: 2,
      stageLabel: 'Stage 2: Portal Buildout',
      title: 'Custom Amenity Access Groups & Operating Hours',
      categoryLabel: 'Access Schedules',
      promptOrDetailNeeded:
        customPrompts['stage2_custom_access_groups'] ||
        'Please confirm resident access hours for shared amenities (Pool, Fitness Center, Clubhouse, Package Room) and any custom staff/vendor access schedules.',
      replyFieldLabel: 'Amenity Operating Hours & Custom Access Group Schedule',
      currentValueSummary: intake?.customGroupsNotes
        ? intake.customGroupsNotes
        : 'Awaiting amenity hours & custom access group rules',
      isAlreadyProvidedOnProject: hasCustomGroupsFinalized,
    },
  ];

  const customItems: Omit<Stage1And2FinalizationItem, 'isFinalizedViaEmailReply' | 'emailReplyDetails'>[] = (
    cfg?.customStage1And2Items || []
  ).map((ci) => ({
    id: ci.id,
    stageNumber: ci.stageNumber,
    stageLabel:
      ci.stageNumber === 1 ? 'Stage 1: Project kickoff' : 'Stage 2: Portal Buildout',
    title: ci.title,
    categoryLabel: `Custom Stage ${ci.stageNumber} Item`,
    promptOrDetailNeeded: customPrompts[ci.id] || ci.promptOrDetailNeeded,
    replyFieldLabel: ci.replyPlaceholder || `${ci.title} — Customer Response`,
    currentValueSummary: finalizedMap[ci.id]
      ? `Finalized: ${finalizedMap[ci.id].responseText}`
      : 'Waiting on customer response',
    isAlreadyProvidedOnProject: Boolean(finalizedMap[ci.id]),
    isCustom: true,
  }));

  return [...builtInItems, ...customItems].map((item) => {
    const replyRecord = finalizedMap[item.id];
    return {
      ...item,
      currentValueSummary: replyRecord
        ? `✓ Finalized via Email (${replyRecord.finalizedAt}): "${replyRecord.responseText}"`
        : item.currentValueSummary,
      isAlreadyProvidedOnProject: item.isAlreadyProvidedOnProject || Boolean(replyRecord),
      isFinalizedViaEmailReply: Boolean(replyRecord),
      emailReplyDetails: replyRecord,
    };
  });
}

/**
 * Determines whether a milestone title (or index) is between Stage 3 and Stage 7:
 * Stage 3: Product Acquisition
 * Stage 4: CSM Intro - Pre-implementation
 * Stage 5: Implementation
 * Stage 6: CSM Handoff
 * Stage 7: Project Closed
 */
export function isStageThreeToSeven(
  milestoneTitle?: string | null,
  project?: OperationProject
): boolean {
  if (!milestoneTitle) return false;
  const norm = milestoneTitle.trim().toLowerCase();
  if (
    norm.includes('acquisition') ||
    norm.includes('product') ||
    norm.includes('csm intro') ||
    norm.includes('pre-implementation') ||
    norm.includes('implementation') ||
    norm.includes('handoff') ||
    norm.includes('closed')
  ) {
    return true;
  }
  if (project && project.milestones) {
    const idx = project.milestones.findIndex(
      (m) => m.title.trim().toLowerCase() === norm
    );
    if (idx >= 2) return true;
  }
  return false;
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
 * Builds the HTML for the PM's Personal Message Card so it renders professionally alongside the other cards.
 */
export function buildPmPersonalMessageCardHtml(
  project: OperationProject,
  commsConfig?: CommsTunnelConfiguration
): string {
  const cfg = commsConfig || project.commsTunnelConfig;
  const rawMessage = cfg?.pmPersonalMessage?.trim();
  if (!rawMessage) return '';

  const pmName = project.assignedPM?.name || 'Quext Project Manager';
  const pmRole = project.assignedPM?.role || 'Project Manager';
  const pmEmail = project.assignedPM?.email || 'operations@onequext.com';
  const pmPhone = project.assignedPM?.phone || '';
  const initials = pmName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const styleType = cfg?.pmPersonalMessageStyle || 'pm_note';
  const deliveryMode = cfg?.pmPersonalMessageDeliveryMode || 'one_time';
  const isOneTime = deliveryMode === 'one_time';

  const defaultTitle =
    styleType === 'action_required'
      ? `Coordination & Action Note from ${pmName}`
      : styleType === 'milestone_highlight'
      ? `Milestone Spotlight from ${pmName}`
      : isOneTime
      ? `Special Update from Your Project Manager`
      : `A Personal Note from Your Project Manager`;

  const cardTitle = cfg?.pmPersonalMessageTitle?.trim() || defaultTitle;

  const palette =
    styleType === 'action_required'
      ? {
          border: '#f59e0b',
          headerBg: '#fffbeb',
          badgeBg: '#fef3c7',
          badgeText: '#92400e',
          badgeLabel: 'PM COORDINATION CALLOUT',
          avatarBg: '#d97706',
        }
      : styleType === 'milestone_highlight'
      ? {
          border: '#01C38D',
          headerBg: '#ecfdf5',
          badgeBg: '#d1fae5',
          badgeText: '#065f46',
          badgeLabel: 'PM MILESTONE SPOTLIGHT',
          avatarBg: '#059669',
        }
      : {
          border: '#0f172a',
          headerBg: '#f8fafc',
          badgeBg: '#e2e8f0',
          badgeText: '#1e293b',
          badgeLabel: 'PROJECT MANAGER MESSAGE',
          avatarBg: '#0f172a',
        };

  const deliveryBadgeHtml = isOneTime
    ? `<span style="display: inline-block; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background-color: #f3e8ff; color: #6b21a8; border: 1px solid #d8b4fe; padding: 2px 7px; border-radius: 999px; margin-left: 6px; margin-bottom: 2px;">⚡ ONE-TIME UPDATE</span>`
    : `<span style="display: inline-block; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background-color: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 999px; margin-left: 6px; margin-bottom: 2px;">STANDING CADENCE NOTE</span>`;

  const formattedParagraphs = rawMessage
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(
      (line) =>
        `<p style="margin: 0 0 8px 0; font-size: 13px; color: #1e293b; line-height: 1.55;">${line}</p>`
    )
    .join('');

  return `
    <!-- PM PERSONAL MESSAGE CARD -->
    <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid ${palette.border}; border-radius: 14px; overflow: hidden; margin-bottom: 14px; box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);">
      <div style="background-color: ${palette.headerBg}; padding: 12px 18px; border-bottom: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 38px; vertical-align: middle;">
              <div style="width: 32px; height: 32px; border-radius: 999px; background-color: ${palette.avatarBg}; color: #ffffff; font-size: 12px; font-weight: 900; text-align: center; line-height: 32px;">
                ${initials}
              </div>
            </td>
            <td style="vertical-align: middle;">
              <div>
                <span style="display: inline-block; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; background-color: ${palette.badgeBg}; color: ${palette.badgeText}; padding: 2px 7px; border-radius: 999px; margin-bottom: 2px;">
                  ${palette.badgeLabel}
                </span>
                ${deliveryBadgeHtml}
              </div>
              <div style="font-size: 14px; font-weight: 900; color: #0f172a;">
                ${cardTitle}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div style="padding: 14px 18px 12px 18px;">
        ${formattedParagraphs}
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e2e8f0; font-size: 11px; color: #475569;">
          <strong style="color: #0f172a;">${pmName}</strong> • ${pmRole} • <a href="mailto:${pmEmail}" style="color: #0284c7; text-decoration: none; font-weight: 700;">${pmEmail}</a>${pmPhone ? ` • ${pmPhone}` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Consumes a one-time PM personal message after an email update is sent/logged so that
 * update-specific notes are never accidentally sent over and over again on future cadence runs.
 */
export function consumeOneTimePmMessageConfig(
  config?: CommsTunnelConfiguration,
  sentBy?: string
): {
  nextConfig: CommsTunnelConfiguration | undefined;
  wasOneTimeConsumed: boolean;
} {
  if (!config) {
    return { nextConfig: undefined, wasOneTimeConsumed: false };
  }
  const trimmedMsg = (config.pmPersonalMessage || '').trim();
  const mode = config.pmPersonalMessageDeliveryMode || 'one_time';
  if (!trimmedMsg || mode !== 'one_time') {
    return { nextConfig: config, wasOneTimeConsumed: false };
  }

  const nowFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    wasOneTimeConsumed: true,
    nextConfig: {
      ...config,
      pmPersonalMessage: '',
      pmPersonalMessageTitle: '',
      lastSentOneTimePmMessage: {
        message: trimmedMsg,
        title: config.pmPersonalMessageTitle?.trim() || undefined,
        style: config.pmPersonalMessageStyle || 'pm_note',
        sentAt: nowFormatted,
        sentBy,
      },
    },
  };
}

/**
 * Builds the Stage 1 (Project kickoff) & Stage 2 (Portal Buildout) "Items Waiting on Customer Finalization"
 * interactive email card, complete with:
 *  - Per-item 1-click `mailto:` email reply buttons addressed directly to the PM
 *  - A master 1-click `mailto:` button ("Reply by Email to Finalize All Outstanding Items")
 *  - An inline fill-in-the-blank reply checklist box so if the customer simply hits "Reply" in Gmail,
 *    Outlook, or Apple Mail, they can type their answers directly in the quoted email and send back to the PM.
 */
export function buildStage1And2CustomerActionCardHtml(
  project: OperationProject,
  commsConfig?: CommsTunnelConfiguration,
  senderEmailOverride?: string
): string {
  const cfg = commsConfig || project.commsTunnelConfig;
  if (!cfg?.includeStage1And2OutstandingCard) return '';

  const allItems = getStage1And2CustomerFinalizationItems(project, cfg);
  const selectedIds = new Set(cfg.selectedStage1And2ItemIds || []);

  // If PM has explicitly selected items, use those; otherwise default to items not yet provided on project
  const highlightedItems =
    selectedIds.size > 0
      ? allItems.filter((it) => selectedIds.has(it.id))
      : allItems.filter((it) => !it.isAlreadyProvidedOnProject);

  if (highlightedItems.length === 0) return '';

  const pmName = project.assignedPM?.name || 'Quext Project Manager';
  const pmEmail = project.assignedPM?.email || senderEmailOverride || 'operations@onequext.com';
  const portalUrl = buildCustomerKickoffPortalUrl(project.id);

  // Build master mailto link covering all highlighted items
  const masterSubject = `Re: [Customer Finalization • ${project.propertyName} (#${
    project.quoteNumber || project.id
  })] Finalized Stage 1 & 2 Details for ${pmName}`;

  const masterBodyLines = [
    `Hi ${pmName},`,
    '',
    `Here are our finalized responses for the outstanding items on ${project.propertyName} (Quote #${project.quoteNumber}):`,
    '',
    ...highlightedItems.flatMap((it, idx) => [
      `${idx + 1}. [${it.title}] (Ref: ${it.id})`,
      `   Prompt: ${it.promptOrDetailNeeded}`,
      `   👉 ${it.replyFieldLabel}: [TYPE YOUR RESPONSE HERE]`,
      '',
    ]),
    '---',
    `Submitted by (${project.clientName}): `,
    'Title / Contact Phone: ',
  ];

  const masterMailtoHref = `mailto:${encodeURIComponent(pmEmail)}?subject=${encodeURIComponent(
    masterSubject
  )}&body=${encodeURIComponent(masterBodyLines.join('\r\n'))}`;

  const itemRowsHtml = highlightedItems
    .map((item, idx) => {
      const singleSubject = `Re: [${project.propertyName} • ${item.title}] Customer Finalization (${item.id})`;
      const singleBodyLines = [
        `Hi ${pmName},`,
        '',
        `Here is our finalized information for "${item.title}" on ${project.propertyName} (Ref: ${item.id}):`,
        '',
        `👉 ${item.replyFieldLabel}: `,
        '',
        'Additional Notes / Attachments: ',
      ];
      const singleMailtoHref = `mailto:${encodeURIComponent(pmEmail)}?subject=${encodeURIComponent(
        singleSubject
      )}&body=${encodeURIComponent(singleBodyLines.join('\r\n'))}`;

      const stageBadgeBg = item.stageNumber === 1 ? '#fef3c7' : '#e0e7ff';
      const stageBadgeText = item.stageNumber === 1 ? '#92400e' : '#3730a3';
      const stageBadgeBorder = item.stageNumber === 1 ? '#fde68a' : '#c7d2fe';

      return `
        <div style="padding: 12px 14px; background-color: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 10px; margin-bottom: 10px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top;">
                <div style="margin-bottom: 4px;">
                  <span style="display: inline-block; font-size: 9px; font-weight: 900; text-transform: uppercase; background-color: ${stageBadgeBg}; color: ${stageBadgeText}; border: 1px solid ${stageBadgeBorder}; padding: 2px 7px; border-radius: 999px; margin-right: 5px;">
                    STAGE ${item.stageNumber} • ${item.categoryLabel}
                  </span>
                  <span style="display: inline-block; font-size: 9px; font-weight: 900; text-transform: uppercase; background-color: #fee2e2; color: #991b1b; padding: 2px 7px; border-radius: 999px;">
                    ⏳ WAITING ON CUSTOMER TO FINALIZE
                  </span>
                </div>
                <div style="font-size: 13px; font-weight: 900; color: #0f172a; margin-bottom: 3px;">
                  ${idx + 1}. ${item.title}
                </div>
                <div style="font-size: 12px; color: #334155; line-height: 1.45; margin-bottom: 6px;">
                  ${item.promptOrDetailNeeded}
                </div>
                <div style="font-size: 10px; color: #64748b;">
                  <strong>Current Status on Project:</strong> ${item.currentValueSummary}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 8px;">
                <a href="${singleMailtoHref}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 7px; text-decoration: none; margin-right: 6px;">
                  ✉️ Reply by Email for Item #${idx + 1} (${pmName.split(' ')[0]}) &rarr;
                </a>
                <a href="${portalUrl}" style="display: inline-block; background-color: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 800; padding: 5px 10px; border-radius: 7px; text-decoration: none;">
                  🔗 Complete in Portal
                </a>
              </td>
            </tr>
          </table>
        </div>
      `;
    })
    .join('');

  const inlineReplyChecklistHtml = highlightedItems
    .map(
      (item, idx) => `
      <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px dashed #cbd5e1;">
        <div style="font-size: 11px; font-weight: 900; color: #0f172a;">
          [${idx + 1}] ${item.title} <span style="font-weight: 600; color: #64748b;">(Ref: ${item.id})</span>
        </div>
        <div style="font-size: 11px; color: #047857; font-weight: 800; margin-top: 2px;">
          👉 ${item.replyFieldLabel}: <span style="color: #94a3b8; font-weight: 500;">[Type your answer here when replying]</span>
        </div>
      </div>
    `
    )
    .join('');

  return `
    <!-- STAGE 1 & 2 CUSTOMER FINALIZATION ACTION CARD -->
    <div data-testid="email-card-stage1and2-outstanding" style="background-color: #ffffff; border: 2px solid #f59e0b; border-radius: 14px; overflow: hidden; margin-bottom: 14px; box-shadow: 0 3px 8px rgba(245, 158, 11, 0.10);">
      <div style="background: linear-gradient(135deg, #78350f 0%, #92400e 100%); color: #ffffff; padding: 13px 18px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td>
              <span style="display: inline-block; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; background-color: #fef3c7; color: #78350f; padding: 2px 8px; border-radius: 999px; margin-bottom: 3px;">
                ⚠️ CUSTOMER ACTION REQUESTED • STAGE 1 &amp; 2 FINALIZATION
              </span>
              <div style="font-size: 15px; font-weight: 900; color: #ffffff;">
                Items Waiting on Your Team to Finalize (${highlightedItems.length})
              </div>
              <div style="font-size: 11px; color: #fde68a; margin-top: 2px;">
                Reply directly to this email (<strong style="color: #ffffff;">${pmEmail}</strong>) or click any button below to send your answers back to ${pmName}.
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div style="padding: 14px 18px;">
        ${itemRowsHtml}

        <!-- MASTER EMAIL REPLY CTA + INLINE QUOTED REPLY TEMPLATE -->
        <div style="margin-top: 12px; padding: 14px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px;">
          <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #0f172a; margin-bottom: 6px;">
            📬 Two Easy Ways to Respond by Email Back to ${pmName} (${pmEmail}):
          </div>
          <div style="margin-bottom: 12px;">
            <a href="${masterMailtoHref}" style="display: inline-block; background-color: #01C38D; color: #0f172a; font-size: 12px; font-weight: 900; padding: 10px 16px; border-radius: 9px; text-decoration: none; margin-right: 8px; margin-bottom: 6px;">
              ✉️ Option 1: Click to Open Pre-Filled Email Reply (${highlightedItems.length} Item${
                highlightedItems.length === 1 ? '' : 's'
              }) &rarr;
            </a>
            <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 12px; font-weight: 800; padding: 10px 14px; border-radius: 9px; text-decoration: none; margin-bottom: 6px;">
              🔗 Option 2: Submit in Live Kickoff Portal &rarr;
            </a>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;">
            <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #475569; margin-bottom: 6px;">
              📋 Or Simply Hit &ldquo;Reply&rdquo; in Your Email Client &amp; Fill In Below (Routes Directly to ${pmEmail}):
            </div>
            ${inlineReplyChecklistHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Parses a customer's email reply back to the PM (whether sent via the pre-filled `mailto:` checklist
 * or a standard inline reply) and applies the finalized answers directly to the project and CommsTunnelConfiguration.
 */
export function parseAndApplyCustomerEmailReplyToProject(
  project: OperationProject,
  rawReplyText: string,
  respondentEmail?: string,
  commsConfig?: CommsTunnelConfiguration
): {
  updatedProject: OperationProject;
  updatedCommsConfig: CommsTunnelConfiguration;
  finalizedCount: number;
  finalizedTitles: string[];
} {
  const cfg: CommsTunnelConfiguration = {
    ...(project.commsTunnelConfig || {}),
    ...(commsConfig || {}),
  };
  const allItems = getStage1And2CustomerFinalizationItems(project, cfg);
  const selectedIds = new Set(cfg.selectedStage1And2ItemIds || []);
  const targetItems =
    selectedIds.size > 0
      ? allItems.filter((it) => selectedIds.has(it.id))
      : allItems.filter((it) => !it.isAlreadyProvidedOnProject);

  const nowFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const nextFinalizedMap = { ...(cfg.finalizedViaEmailReplyItemIds || {}) };
  const nextIntake = {
    pmsSoftware: project.customerIntake?.pmsSoftware || ('Yardi' as const),
    commonAreaDoors: [...(project.customerIntake?.commonAreaDoors || [])],
    staffRoles: [...(project.customerIntake?.staffRoles || [])],
    ...(project.customerIntake || {}),
  };

  let nextUseNfcWallet = project.useNfcWallet;
  let nextUseQrIntercom = project.useQrIntercom;
  const finalizedTitles: string[] = [];

  const cleanText = rawReplyText.trim();
  const lines = cleanText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Match answers per item by Ref ID, title, replyFieldLabel, or keyword
  const candidatePool = targetItems.length > 0 ? targetItems : allItems;

  candidatePool.forEach((item) => {
    let extractedAnswer = '';

    // 1. Check if line references item.id or item.replyFieldLabel or item.title
    const refIdx = lines.findIndex(
      (l) =>
        l.toLowerCase().includes(item.id.toLowerCase()) ||
        l.toLowerCase().includes(item.title.toLowerCase())
    );

    if (refIdx !== -1) {
      // Look at the same line or the next 1-3 lines for 👉 or colon answer
      for (let offset = 0; offset <= 3 && refIdx + offset < lines.length; offset++) {
        const line = lines[refIdx + offset];
        if (line.includes('👉') || line.toLowerCase().includes(item.replyFieldLabel.toLowerCase())) {
          const parts = line.split(':');
          if (parts.length > 1) {
            const candidate = parts.slice(1).join(':').replace(/\[TYPE YOUR RESPONSE HERE\]/gi, '').replace(/\[Type your answer here when replying\]/gi, '').trim();
            if (candidate) {
              extractedAnswer = candidate;
              break;
            }
          }
        } else if (offset > 0 && !line.startsWith('Prompt:') && !line.startsWith('[')) {
          const colonParts = line.split(':');
          const candidate = (colonParts.length > 1 ? colonParts.slice(1).join(':') : line)
            .replace(/\[TYPE YOUR RESPONSE HERE\]/gi, '')
            .trim();
          if (candidate && candidate.length > 2) {
            extractedAnswer = candidate;
            break;
          }
        }
      }
    }

    // 2. Keyword fallback for natural freeform email replies
    if (!extractedAnswer) {
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (
          item.id === 'stage1_pms_credentials' &&
          (lower.includes('yardi') ||
            lower.includes('entrata') ||
            lower.includes('realpage') ||
            lower.includes('appfolio') ||
            lower.includes('resman') ||
            lower.includes('pms:'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage1_common_doors' &&
          (lower.includes('door') ||
            lower.includes('clubhouse') ||
            lower.includes('pool') ||
            lower.includes('fitness') ||
            lower.includes('gate'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage1_staff_roles' &&
          (lower.includes('staff') ||
            lower.includes('manager') ||
            lower.includes('maintenance') ||
            lower.includes('admin'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage1_site_maps_gateway' &&
          (lower.includes('roof') ||
            lower.includes('gateway') ||
            lower.includes('idf') ||
            lower.includes('site map') ||
            lower.includes('attic'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage1_thermostat_vacant_temp' &&
          (lower.includes('temp') ||
            lower.includes('cool') ||
            lower.includes('heat') ||
            /\b(6\d|7\d)\s*°?f?\b/i.test(lower))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage1_fire_keys_knox' &&
          (lower.includes('knox') || lower.includes('fire') || lower.includes('fob') || lower.includes('master key'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage2_lock_finish_trim' &&
          (lower.includes('satin') ||
            lower.includes('matte black') ||
            lower.includes('bronze') ||
            lower.includes('chrome') ||
            lower.includes('finish') ||
            lower.includes('lever'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage2_nfc_wallet_art' &&
          (lower.includes('nfc') || lower.includes('apple wallet') || lower.includes('wallet') || lower.includes('card art'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage2_qr_intercom_logo' &&
          (lower.includes('qr') || lower.includes('intercom') || lower.includes('logo'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage2_unit_hierarchy_pms_sync' &&
          (lower.includes('hierarchy') || lower.includes('unit number') || lower.includes('roster') || lower.includes('verified'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
        if (
          item.id === 'stage2_custom_access_groups' &&
          (lower.includes('amenity') || lower.includes('hours') || lower.includes('access group'))
        ) {
          extractedAnswer = line.replace(/^[-*•\d.)\s]+/, '');
          break;
        }
      }
    }

    // 3. If single item selected and customer sent a short direct reply, associate the full reply with that item
    if (!extractedAnswer && targetItems.length === 1 && cleanText.length > 0) {
      extractedAnswer = cleanText.split(/\r?\n/)[0];
    }

    if (extractedAnswer) {
      nextFinalizedMap[item.id] = {
        responseText: extractedAnswer,
        finalizedAt: nowFormatted,
        respondentEmail: respondentEmail || project.customerIntake?.communityEmail || project.clientName,
      };
      finalizedTitles.push(item.title);
      selectedIds.delete(item.id);

      // Also sync structured fields onto project.customerIntake so the entire project reflects the customer's email reply
      if (item.id === 'stage1_pms_credentials') {
        if (/entrata/i.test(extractedAnswer)) nextIntake.pmsSoftware = 'Entrata';
        else if (/realpage/i.test(extractedAnswer)) nextIntake.pmsSoftware = 'Realpage';
        else if (/appfolio/i.test(extractedAnswer)) nextIntake.pmsSoftware = 'Appfolio';
        else if (/resman/i.test(extractedAnswer)) nextIntake.pmsSoftware = 'ResMan';
        else if (/yardi/i.test(extractedAnswer)) nextIntake.pmsSoftware = 'Yardi';
        nextIntake.pmsNoticeAcknowledged = true;
      } else if (item.id === 'stage1_common_doors') {
        nextIntake.doorsConfirmedByCustomer = true;
        if (nextIntake.commonAreaDoors.length === 0) {
          const doorTokens = extractedAnswer
            .split(/[,;]+/)
            .map((s) => s.trim())
            .filter(Boolean);
          nextIntake.commonAreaDoors = doorTokens.slice(0, 8).map((dName, i) => ({
            id: `door-email-${Date.now()}-${i}`,
            doorName: dName,
            buildingOrArea: 'Confirmed via Email Reply',
            installedStatus: 'Pending',
          }));
        }
      } else if (item.id === 'stage1_staff_roles') {
        if (nextIntake.staffRoles.length === 0) {
          nextIntake.staffRoles = [
            {
              id: `staff-email-${Date.now()}`,
              firstName: extractedAnswer.split(' ')[0] || 'Onsite',
              lastName: extractedAnswer.split(' ').slice(1, 3).join(' ') || 'Admin',
              email: respondentEmail || project.customerIntake?.communityEmail || '',
              roleOrTitle: extractedAnswer,
              doorsAccessRequested: 'All Common Doors',
            },
          ];
        }
      } else if (item.id === 'stage1_site_maps_gateway') {
        nextIntake.sitePlanConfirmedEdited = true;
        if (!nextIntake.sitePlanPdfName) {
          nextIntake.sitePlanPdfName = `Confirmed via Email: ${extractedAnswer.slice(0, 48)}`;
        }
      } else if (item.id === 'stage1_thermostat_vacant_temp') {
        nextIntake.thermostatTempRange = extractedAnswer;
      } else if (item.id === 'stage1_fire_keys_knox') {
        nextIntake.fireKeysFobs = extractedAnswer;
      } else if (item.id === 'stage2_nfc_wallet_art') {
        const isNo = /\bno\b/i.test(extractedAnswer);
        nextIntake.nfcWalletConfirmedByCustomer = isNo ? 'no' : 'yes';
        nextUseNfcWallet = !isNo;
      } else if (item.id === 'stage2_qr_intercom_logo') {
        const isNo = /\bno\b/i.test(extractedAnswer);
        nextIntake.qrIntercomConfirmedByCustomer = isNo ? 'no' : 'yes';
        nextUseQrIntercom = !isNo;
      } else if (item.id === 'stage2_unit_hierarchy_pms_sync') {
        nextIntake.walkthroughCompleted = true;
      } else if (item.id === 'stage2_custom_access_groups') {
        nextIntake.customGroupsNotes = extractedAnswer;
      }
    }
  });

  const updatedCommsConfig: CommsTunnelConfiguration = {
    ...cfg,
    selectedStage1And2ItemIds: Array.from(selectedIds),
    finalizedViaEmailReplyItemIds: nextFinalizedMap,
  };

  const replyNoteSummary =
    finalizedTitles.length > 0
      ? `Customer replied by email to finalize ${finalizedTitles.length} Stage 1 & 2 item(s) (${finalizedTitles.join(', ')}): "${cleanText.slice(0, 260)}"`
      : `Customer email reply logged on Stage 1 & 2 checklist: "${cleanText.slice(0, 260)}"`;

  const newNote = {
    id: `note-email-reply-${Date.now()}`,
    author: respondentEmail || project.customerIntake?.communityEmail || project.clientName,
    timestamp: nowFormatted,
    text: replyNoteSummary,
    content: replyNoteSummary,
    category: 'General Context' as const,
  };

  const newCommLog: CustomerCommsLog = {
    id: `comm-reply-${Date.now()}`,
    projectId: project.id,
    timestamp: nowFormatted,
    type: 'kickoff_submission',
    recipientEmail: respondentEmail || project.customerIntake?.communityEmail || project.assignedPM.email,
    subject: `Re: [Customer Email Reply] Stage 1 & 2 Finalization — ${project.propertyName}`,
    summary: replyNoteSummary,
    sentBy: respondentEmail || project.clientName,
    status: 'Delivered',
  };

  const updatedProject: OperationProject = {
    ...project,
    useNfcWallet: nextUseNfcWallet,
    useQrIntercom: nextUseQrIntercom,
    customerIntake: nextIntake,
    commsTunnelConfig: updatedCommsConfig,
    notes: [newNote, ...(project.notes || [])],
    customerCommsLogs: [newCommLog, ...(project.customerCommsLogs || [])],
    lastUpdated: new Date().toISOString(),
  };

  return {
    updatedProject,
    updatedCommsConfig,
    finalizedCount: finalizedTitles.length,
    finalizedTitles,
  };
}

/**
 * Builds the optional Stage 3–7 Operational Cards (Installed BOM Line Items, Shipping Dock Line Items,
 * Installer Log Line Items, and Project Notes) when selected by the PM.
 */
export function buildStage3To7OperationalCardsHtml(
  project: OperationProject,
  commsConfig?: CommsTunnelConfiguration
): string {
  const cfg = commsConfig || project.commsTunnelConfig;
  if (!cfg) return '';

  const sections: string[] = [];

  // 1. Installed BOM Line Items Card
  if (cfg.includeInstalledBomCard) {
    const selectedIds = new Set(cfg.selectedBomItemIds || []);
    const bomList = (project.bomItems || []).filter((item) =>
      selectedIds.size > 0 ? selectedIds.has(item.id) : (Number(item.installedCount) || 0) > 0
    );

    if (bomList.length > 0) {
      const rowsHtml = bomList
        .map((item) => {
          const qty = Number(item.quantity) || 0;
          const inst = Number(item.installedCount) || 0;
          const pct = qty > 0 ? Math.min(100, Math.round((inst / qty) * 100)) : 0;
          const finishTag = item.lockFinishConfig
            ? getLockFinishSummaryTag(item.lockFinishConfig)
            : '';
          const brandTag = item.thermostatBrand ? `${item.thermostatBrand} Thermostat` : '';
          const metaExtras = [item.model, item.location, finishTag, brandTag, item.trackingNumber ? `Tracking: ${item.trackingNumber}` : '']
            .filter(Boolean)
            .join(' • ');

          const statusBadgeBg = pct >= 100 ? '#ecfdf5' : inst > 0 ? '#eff6ff' : '#f8fafc';
          const statusBadgeColor = pct >= 100 ? '#047857' : inst > 0 ? '#1d4ed8' : '#475569';
          const statusLabel = pct >= 100 ? '✓ Installed' : inst > 0 ? `${pct}% Installed` : 'Staged';

          return `
            <tr>
              <td style="padding: 9px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: middle;">
                <div style="font-size: 12px; font-weight: 800; color: #0f172a;">${item.name}</div>
                <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${metaExtras || item.category}</div>
              </td>
              <td style="padding: 9px 10px; border-bottom: 1px solid #f1f5f9; text-align: right; vertical-align: middle; white-space: nowrap;">
                <div style="font-size: 12px; font-weight: 900; color: #0f172a;">${inst.toLocaleString()} / ${qty.toLocaleString()}</div>
                <span style="display: inline-block; margin-top: 2px; padding: 2px 6px; border-radius: 6px; background-color: ${statusBadgeBg}; color: ${statusBadgeColor}; font-size: 9px; font-weight: 800;">
                  ${statusLabel}
                </span>
              </td>
            </tr>
          `;
        })
        .join('');

      sections.push(`
        <!-- EMBEDDED BOM LINE ITEMS CARD -->
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #0284c7;">
              📦 INSTALLED HARDWARE &amp; BOM LINE ITEMS (${bomList.length} SELECTED)
            </span>
          </div>
          <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background-color: #f1f5f9; text-align: left; font-size: 9px; font-weight: 900; text-transform: uppercase; color: #475569;">
                <th style="padding: 7px 10px;">Hardware Line Item &amp; Location</th>
                <th style="padding: 7px 10px; text-align: right;">Installed / Scope</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `);
    }
  }

  // 2. Shipping Dock Line Items Card
  if (cfg.includeShippingDockCard) {
    const selectedDockIds = new Set(cfg.selectedShippingDockIds || []);
    const dockItems = (project.shippingDockItems || []).filter((d) =>
      selectedDockIds.size > 0 ? selectedDockIds.has(d.id) : true
    );

    if (dockItems.length > 0) {
      const dockCardsHtml = dockItems
        .map((dock) => {
          const trackNums = getDockItemTrackingNumbers(dock);
          const trackingText = trackNums.length > 0 ? trackNums.join(', ') : dock.trackingNumber || 'Pending Carrier Scan';
          const isDelivered =
            dock.status === 'Delivered to Site' || dock.status === 'Accepted by Customer' || dock.customerAccepted;
          const badgeBg = isDelivered ? '#ecfdf5' : '#fffbeb';
          const badgeColor = isDelivered ? '#047857' : '#b45309';

          return `
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <span style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #d97706;">
                      ${dock.shipmentBatchLabel || 'Shipment Batch'} • ${dock.carrier}
                    </span>
                    <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                      ${dock.bomItemName} (${dock.shippedQuantity.toLocaleString()} units)
                    </div>
                    <div style="font-size: 10px; color: #475569; margin-top: 3px;">
                      <strong>Tracking #:</strong> <span style="font-family: monospace; color: #0f172a;">${trackingText}</span> • Shipped: ${dock.shippedDate || 'N/A'} • ETA: <strong>${dock.estimatedArrivalDate || 'TBD'}</strong>
                    </div>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; background-color: ${badgeBg}; color: ${badgeColor}; font-size: 9px; font-weight: 800;">
                      ${dock.customerAccepted ? '✓ Accepted on Site' : dock.status}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
          `;
        })
        .join('');

      sections.push(`
        <!-- EMBEDDED SHIPPING DOCK CARD -->
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
          <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #d97706; margin-bottom: 8px;">
            🚚 SHIPPING DOCK &amp; CARRIER TRACKING DETAILS (${dockItems.length})
          </div>
          ${dockCardsHtml}
        </div>
      `);
    }
  }

  // 3. Installer Logs Card
  if (cfg.includeInstallerLogCard) {
    const allLogs = getAllProjectInstallLogs(project);
    const selectedLogIds = new Set(cfg.selectedInstallLogIds || []);
    const chosenLogs = allLogs.filter((l) =>
      selectedLogIds.size > 0 ? selectedLogIds.has(l.id) : true
    );

    if (chosenLogs.length > 0) {
      const logItemsHtml = chosenLogs
        .map((log) => {
          const noteLines: string[] = [];
          if (log.notes && log.notes.trim()) noteLines.push(log.notes.trim());
          if (log.itemNotes && log.itemNotes.trim() && log.itemNotes.trim() !== log.notes?.trim()) {
            noteLines.push(log.itemNotes.trim());
          }
          if (log.fieldTechNotes && log.fieldTechNotes.trim()) {
            noteLines.push(
              `Field Tech Note (${log.fieldTechNoteAuthor || 'Field Ops'}): ${log.fieldTechNotes.trim()}`
            );
          }

          return `
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <span style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #059669;">
                      ${log.timestamp} • Logged by ${log.installerName}
                    </span>
                    <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                      +${log.quantityCompleted} ${log.itemName} — <span style="color: #0284c7;">${log.locationCompleted}</span>
                    </div>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; background-color: #ecfdf5; color: #047857; font-size: 9px; font-weight: 800;">
                      ✓ ${log.statusCheck}
                    </span>
                  </td>
                </tr>
              </table>
              ${
                noteLines.length > 0
                  ? `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e2e8f0; font-size: 11px; color: #334155; line-height: 1.4;">${noteLines.join(' • ')}</div>`
                  : ''
              }
            </div>
          `;
        })
        .join('');

      sections.push(`
        <!-- EMBEDDED INSTALLER LOGS CARD -->
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
          <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #059669; margin-bottom: 8px;">
            🔧 FIELD INSTALLER LOG &amp; VERIFICATION ACTIVITY (${chosenLogs.length})
          </div>
          ${logItemsHtml}
        </div>
      `);
    }
  }

  // 4. Project Notes Card
  if (cfg.includeProjectNotesCard) {
    const selectedNoteIds = new Set(cfg.selectedProjectNoteIds || []);
    const chosenNotes = (project.notes || []).filter((n) =>
      selectedNoteIds.size > 0 ? selectedNoteIds.has(n.id) : true
    );

    if (chosenNotes.length > 0) {
      const notesHtml = chosenNotes
        .map(
          (note) => `
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #6366f1; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px;">
              <div style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #4f46e5; margin-bottom: 3px;">
                ${note.category || 'Project Note'} • ${note.author} (${note.timestamp})
              </div>
              <div style="font-size: 12px; color: #1e293b; line-height: 1.45;">
                ${note.text}
              </div>
            </div>
          `
        )
        .join('');

      sections.push(`
        <!-- EMBEDDED PROJECT NOTES CARD -->
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
          <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #4f46e5; margin-bottom: 8px;">
            📝 RELEVANT PROJECT NOTES &amp; SITE UPDATES (${chosenNotes.length})
          </div>
          ${notesHtml}
        </div>
      `);
    }
  }

  return sections.join('\n');
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
  commsConfig,
}: {
  project: OperationProject;
  cadence?: CustomerEmailCadence;
  overrideMilestoneTitle?: string;
  aiTone?: AiEmailTone;
  customAiSummary?: string;
  variantSeed?: number;
  commsConfig?: CommsTunnelConfiguration;
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

  const cadenceLabel =
    cadence === 'biweekly'
      ? 'Bi-Weekly (Every 2 Weeks)'
      : cadence === 'multi_day'
      ? formatCustomerEmailCadenceLabel('multi_day', project.emailCadenceWeekdays, false)
      : cadence === 'weekly'
      ? 'Weekly'
      : 'Milestone';
  const shortCadence =
    cadence === 'biweekly'
      ? 'Bi-Weekly'
      : cadence === 'multi_day'
      ? formatCustomerEmailCadenceLabel('multi_day', project.emailCadenceWeekdays, true)
      : 'Weekly';
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

  const pmPersonalMessageCardHtml = buildPmPersonalMessageCardHtml(project, commsConfig);
  const stage1And2ActionCardHtml = buildStage1And2CustomerActionCardHtml(
    project,
    commsConfig,
    project.assignedPM?.email
  );
  const stage3To7OperationalCardsHtml = buildStage3To7OperationalCardsHtml(project, commsConfig);

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

      ${pmPersonalMessageCardHtml}

      ${stage1And2ActionCardHtml}

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

      ${stage3To7OperationalCardsHtml}

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
  commsConfig,
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
  commsConfig?: CommsTunnelConfiguration;
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

  const shortCadence =
    cadence === 'biweekly'
      ? 'Bi-Weekly'
      : cadence === 'multi_day'
      ? formatCustomerEmailCadenceLabel('multi_day', primaryProject.emailCadenceWeekdays, true)
      : 'Weekly';
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

  const pmPersonalMessageCardHtml = buildPmPersonalMessageCardHtml(primaryProject, commsConfig);
  const stage1And2ActionCardHtml = buildStage1And2CustomerActionCardHtml(
    primaryProject,
    commsConfig,
    senderEmail
  );
  const stage3To7OperationalCardsHtml = buildStage3To7OperationalCardsHtml(primaryProject, commsConfig);

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

      ${pmPersonalMessageCardHtml}

      ${stage1And2ActionCardHtml}

      <!-- EMBEDDED PROJECT CARDS -->
      ${projectCardsHtml}

      ${stage3To7OperationalCardsHtml}

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

