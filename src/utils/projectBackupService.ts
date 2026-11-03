import { OperationProject } from '../types';

export interface QuextProjectBackupFile {
  format: 'quext_project_backup_v1';
  exportType: 'single_project' | 'full_site_backup';
  exportedAt: string;
  exportedBy: string;
  source: string;
  projectCount: number;
  projects: OperationProject[];
  /** Optional single project wrapper for convenience */
  project?: OperationProject;
}

export interface BackupParseResult {
  valid: boolean;
  projects: OperationProject[];
  exportType: 'single_project' | 'full_site_backup';
  exportedAt?: string;
  exportedBy?: string;
  error?: string;
}

/**
 * Clean a string to be safely used in a filename.
 */
function sanitizeFilenamePart(str: string): string {
  return str
    .trim()
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 40);
}

/**
 * Format a Date object as YYYYMMDD_HHMMSS.
 */
function formatTimestampForFilename(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const mins = pad(d.getMinutes());
  const secs = pad(d.getSeconds());
  return `${year}${month}${day}_${hours}${mins}${secs}`;
}

/**
 * Trigger a browser download of JSON data.
 */
function downloadJsonBlob(data: unknown, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Losslessly export a single project to a standard Quext backup JSON file.
 * Includes complete BOM (with lock configurations, installed counts, spares),
 * install logs (with photos and audio notes), real notes, milestones, customer intake,
 * SOW items, and all related configuration.
 */
export function exportSingleProject(project: OperationProject, exportedBy?: string): void {
  const safePropName = sanitizeFilenamePart(project.propertyName || 'Project');
  const timestamp = formatTimestampForFilename(new Date());
  const filename = `Quext_Project_${safePropName}_${timestamp}.json`;

  const payload: QuextProjectBackupFile = {
    format: 'quext_project_backup_v1',
    exportType: 'single_project',
    exportedAt: new Date().toISOString(),
    exportedBy: exportedBy || project.assignedPM?.name || 'Quext Project Manager',
    source: 'Quext Operations Workspace',
    projectCount: 1,
    projects: [project],
    project: project,
  };

  downloadJsonBlob(payload, filename);
}

/**
 * Losslessly export all active projects across the whole site to a Quext backup JSON file.
 * Restorable to the site at any time.
 */
export function exportAllProjects(projects: OperationProject[], exportedBy?: string): void {
  const timestamp = formatTimestampForFilename(new Date());
  const filename = `Quext_Operations_All_Projects_Backup_${timestamp}.json`;

  const payload: QuextProjectBackupFile = {
    format: 'quext_project_backup_v1',
    exportType: 'full_site_backup',
    exportedAt: new Date().toISOString(),
    exportedBy: exportedBy || 'Quext Operations Team',
    source: 'Quext Operations Workspace',
    projectCount: projects.length,
    projects: projects,
  };

  downloadJsonBlob(payload, filename);
}

/**
 * Parse and validate a JSON backup string.
 * Supports:
 * - Quext backup format envelope ({ format: 'quext_project_backup_v1', ... })
 * - Direct array of OperationProject objects
 * - Direct single OperationProject object
 */
export function parseAndValidateProjectBackup(jsonStr: string): BackupParseResult {
  try {
    const parsed = JSON.parse(jsonStr);

    let projects: OperationProject[] = [];
    let exportType: 'single_project' | 'full_site_backup' = 'single_project';
    let exportedAt: string | undefined;
    let exportedBy: string | undefined;

    if (parsed && typeof parsed === 'object') {
      if (parsed.format === 'quext_project_backup_v1') {
        exportType = parsed.exportType === 'full_site_backup' ? 'full_site_backup' : 'single_project';
        exportedAt = parsed.exportedAt;
        exportedBy = parsed.exportedBy;
        if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
          projects = parsed.projects;
        } else if (parsed.project && typeof parsed.project === 'object') {
          projects = [parsed.project];
        }
      } else if (Array.isArray(parsed)) {
        // Direct project array
        projects = parsed;
        exportType = projects.length > 1 ? 'full_site_backup' : 'single_project';
      } else if (parsed.propertyName || parsed.id) {
        // Direct single project object
        projects = [parsed];
        exportType = 'single_project';
      }
    }

    if (!projects || projects.length === 0) {
      return {
        valid: false,
        projects: [],
        exportType: 'single_project',
        error: 'The file does not contain valid Quext project data or projects array.',
      };
    }

    // Sanitize each project to ensure all required fields and arrays exist losslessly
    const sanitizedProjects: OperationProject[] = projects.map((p, idx) => {
      const id = p.id || `proj_restored_${Date.now()}_${idx}`;
      return {
        ...p,
        id,
        quoteId: p.quoteId || id,
        quoteNumber: p.quoteNumber || `RESTORED-${idx + 1}`,
        propertyName: p.propertyName || `Restored Property ${idx + 1}`,
        clientName: p.clientName || 'Quext Customer',
        propertyManagementCompany: p.propertyManagementCompany || undefined,
        address: p.address || '',
        city: p.city || '',
        state: p.state || '',
        zipCode: p.zipCode || undefined,
        unitsCount: typeof p.unitsCount === 'number' ? p.unitsCount : 0,
        heroImage: p.heroImage || '/src/assets/images/property_grand_horizon_1792605840266.jpg',
        assignedPM: p.assignedPM || {
          name: 'Raul Recalde',
          email: 'raul.recalde@onequext.com',
          role: 'Director of Implementation',
        },
        assignedCSM: p.assignedCSM,
        assignedFieldTech: p.assignedFieldTech,
        integratorPartners: Array.isArray(p.integratorPartners) ? p.integratorPartners : undefined,
        statusTag: p.statusTag || 'On Track',
        platform: p.platform,
        statusReason: p.statusReason,
        startDate: p.startDate || new Date().toISOString().split('T')[0],
        targetCompletionDate:
          p.targetCompletionDate ||
          new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        bomItems: Array.isArray(p.bomItems) ? p.bomItems : [],
        installLogs: Array.isArray(p.installLogs) ? p.installLogs : [],
        notes: Array.isArray(p.notes) ? p.notes : [],
        milestones: Array.isArray(p.milestones) ? p.milestones : [],
        communityDetails: p.communityDetails,
        customerIntake: p.customerIntake,
        customerCommsLogs: Array.isArray(p.customerCommsLogs) ? p.customerCommsLogs : [],
        emailOverviewCadence: p.emailOverviewCadence,
        emailCadenceStartDate: p.emailCadenceStartDate,
        additionalCustomerEmails: Array.isArray(p.additionalCustomerEmails) ? p.additionalCustomerEmails : undefined,
        sowForecastCadenceEnabled: p.sowForecastCadenceEnabled,
        useNfcWallet: p.useNfcWallet,
        useQrIntercom: p.useQrIntercom,
        csmHandoffEnteredAt: p.csmHandoffEnteredAt,
        sowForecastItems: Array.isArray(p.sowForecastItems) ? p.sowForecastItems : [],
        shippingDockItems: Array.isArray(p.shippingDockItems) ? p.shippingDockItems : [],
        productAcceptanceSubmission: p.productAcceptanceSubmission,
        activityNotifications: Array.isArray(p.activityNotifications) ? p.activityNotifications : [],
        pendingInstallationChanges: Array.isArray(p.pendingInstallationChanges) ? p.pendingInstallationChanges : [],
        kickoffCompleted: p.kickoffCompleted,
        isManuallyCreated: p.isManuallyCreated,
        isBomLocked: p.isBomLocked,
        isBomOverridden: p.isBomOverridden,
        isDiyInstallation: p.isDiyInstallation,
        originalQuoteBOM: Array.isArray(p.originalQuoteBOM) ? p.originalQuoteBOM : undefined,
        manualLinkHistory: Array.isArray(p.manualLinkHistory) ? p.manualLinkHistory : [],
        linkedProjectId: p.linkedProjectId,
        linkedProjectName: p.linkedProjectName,
        linkedProjectNumber: p.linkedProjectNumber,
        manualLinkProjectHistory: Array.isArray(p.manualLinkProjectHistory) ? p.manualLinkProjectHistory : [],
        teamAssists: Array.isArray(p.teamAssists) ? p.teamAssists : [],
        financialMilestones: p.financialMilestones,
        partnerCourseBundle: p.partnerCourseBundle,
        pmpMitigationPlan: p.pmpMitigationPlan,
        csmPortalData: p.csmPortalData,
        rmaTickets: Array.isArray(p.rmaTickets) ? p.rmaTickets : [],
        changeOrders: Array.isArray(p.changeOrders) ? p.changeOrders : [],
        bomAcquisitionSubmissions: Array.isArray(p.bomAcquisitionSubmissions) ? p.bomAcquisitionSubmissions : [],
        acquisitionStatusOverrides: p.acquisitionStatusOverrides || {},
        acquisitionMilestones: p.acquisitionMilestones || {},
        lastUpdated: p.lastUpdated || new Date().toISOString(),
      };
    });

    return {
      valid: true,
      projects: sanitizedProjects,
      exportType,
      exportedAt,
      exportedBy,
    };
  } catch (err: any) {
    return {
      valid: false,
      projects: [],
      exportType: 'single_project',
      error: `Failed to parse backup JSON: ${err?.message || 'Invalid format'}`,
    };
  }
}

/**
 * Upsert imported projects into existing project list.
 * If a project with matching id OR normalized propertyName exists, it updates that project in place.
 * Otherwise, it prepends it to the project list.
 */
export function upsertProjects(
  existingProjects: OperationProject[],
  incomingProjects: OperationProject[]
): {
  updatedList: OperationProject[];
  updatedCount: number;
  addedCount: number;
} {
  const result: OperationProject[] = [...existingProjects];
  let updatedCount = 0;
  let addedCount = 0;

  for (const inc of incomingProjects) {
    const incName = (inc.propertyName || '').trim().toLowerCase();
    const existingIndex = result.findIndex(
      (p) =>
        p.id === inc.id ||
        (incName.length > 0 && (p.propertyName || '').trim().toLowerCase() === incName)
    );

    if (existingIndex >= 0) {
      // Update existing project in place with the complete restored backup data
      const prev = result[existingIndex];
      // Strip undefined fields from incoming project so existing data isn't overwritten by missing keys
      const cleanInc: Record<string, any> = {};
      for (const [k, v] of Object.entries(inc)) {
        if (v !== undefined) {
          cleanInc[k] = v;
        }
      }
      result[existingIndex] = {
        ...prev,
        ...cleanInc,
        // Ensure ID matches the existing project so active navigation links remain stable
        id: prev.id,
      };
      updatedCount++;
    } else {
      // Prepend newly imported project
      result.unshift(inc);
      addedCount++;
    }
  }

  return {
    updatedList: result,
    updatedCount,
    addedCount,
  };
}

/**
 * Dispatch global event to open the Import & Restore Projects modal from anywhere.
 */
export function openImportModal(): void {
  window.dispatchEvent(new CustomEvent('quext-open-import-modal'));
}
