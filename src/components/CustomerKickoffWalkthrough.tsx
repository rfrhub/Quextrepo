import React, { useState, useMemo } from 'react';
import {
  OperationProject,
  BOMItem,
  CommonAreaDoor,
  StaffRoleSubmission,
  StaffPermissionLevel,
  PMSSoftwareChoice,
  EntrataCredentials,
  ProjectActivityNotification,
  normalizeFieldTech,
  projectHasGatewayOrHubOnBOM,
} from '../types';
import { loadStoredQuotes } from '../data/initialData';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  Smartphone,
  Wifi,
  Radio,
  Sliders,
  Mail,
  FileCheck,
  Calendar,
  KeyRound,
  Download,
  Share2,
  ChevronRight,
  ChevronLeft,
  Phone,
  Droplets,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  AlertTriangle,
  Info,
  Lock,
  Edit2,
  Check,
  Navigation,
  Upload,
  QrCode,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';

interface CustomerKickoffWalkthroughProps {
  project: OperationProject;
  onUpdateProject?: (updated: OperationProject) => void;
  onBackToTechnicalBOM?: () => void;
  isStandaloneClientView?: boolean;
}

export const CustomerKickoffWalkthrough: React.FC<CustomerKickoffWalkthroughProps> = ({
  project,
  onUpdateProject,
  onBackToTechnicalBOM,
  isStandaloneClientView = false,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'walkthrough' | 'full-document'>('walkthrough');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Initialize intake state from project.customerIntake or defaults
  const existingIntake = project.customerIntake || {
    pmsSoftware: 'Yardi',
    commonAreaDoors: [
      { id: 'door-1', doorName: 'Clubhouse Main Entry', buildingOrArea: 'Clubhouse', installedStatus: 'Pending' },
      { id: 'door-2', doorName: 'Pool Gate North', buildingOrArea: 'Amenities Area', installedStatus: 'Pending' },
      { id: 'door-3', doorName: 'Fitness Center Entry', buildingOrArea: 'Clubhouse Floor 1', installedStatus: 'Pending' },
    ],
    staffRoles: [
      {
        id: 'staff-1',
        firstName: 'Elena',
        lastName: 'Vance',
        email: 'elena.vance@property.com',
        phoneNumber: '(512) 555-0199',
        permissionLevel: 'Manager',
        roleOrTitle: 'General Property Manager',
      },
    ],
  };

  const [pmsChoice, setPmsChoice] = useState<PMSSoftwareChoice>(existingIntake.pmsSoftware || 'Yardi');
  const [entrataCreds, setEntrataCreds] = useState<EntrataCredentials>(
    existingIntake.entrataCredentials || { username: '', password: '', apiBaseUrl: 'https://api.entrata.com' }
  );
  const [commonDoors, setCommonDoors] = useState<CommonAreaDoor[]>(existingIntake.commonAreaDoors || []);
  const [staffList, setStaffList] = useState<StaffRoleSubmission[]>(existingIntake.staffRoles || []);

  // Slide 4: Door Approval & Name Change State
  const [approvedDoorIds, setApprovedDoorIds] = useState<Record<string, boolean>>({});
  const [editingDoorId, setEditingDoorId] = useState<string | null>(null);
  const [editingDoorName, setEditingDoorName] = useState<string>('');

  // Door addition form
  const [newDoorName, setNewDoorName] = useState<string>('');
  const [newDoorArea, setNewDoorArea] = useState<string>('');

  // Staff addition form
  const [staffFirstName, setStaffFirstName] = useState<string>('');
  const [staffLastName, setStaffLastName] = useState<string>('');
  const [staffEmail, setStaffEmail] = useState<string>('');
  const [staffPhone, setStaffPhone] = useState<string>('');
  const [staffPerm, setStaffPerm] = useState<StaffPermissionLevel>('Manager');

  // Slide 8: Email updates from PM and Submission
  const [residentEmailForUpdates, setResidentEmailForUpdates] = useState<string>(
    existingIntake.subscriberEmail || existingIntake.communityEmail || existingIntake.staffRoles?.[0]?.email || ''
  );
  const [emailUpdateCadence, setEmailUpdateCadence] = useState<'weekly' | 'biweekly'>(
    existingIntake.emailUpdatesCadence === 'biweekly' ? 'biweekly' : 'weekly'
  );
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isWalkthroughSubmitted, setIsWalkthroughSubmitted] = useState<boolean>(
    existingIntake.walkthroughCompleted || false
  );
  const [doorNamesNotAvailableNow, setDoorNamesNotAvailableNow] = useState<boolean>(
    existingIntake.doorNamesNotAvailableNow || false
  );
  const [doorNamesFollowUpDate, setDoorNamesFollowUpDate] = useState<string>(
    existingIntake.doorNamesFollowUpDate || ''
  );
  const [doorNamesValidationError, setDoorNamesValidationError] = useState<string | null>(null);

  // Site Maps Gateway Location Confirmation state (only presented if Gateway or Hub on BOM)
  const hasGatewayOrHubOnBOM = useMemo(
    () => projectHasGatewayOrHubOnBOM(project.bomItems || []),
    [project.bomItems]
  );
  const [sitePlanPdfName, setSitePlanPdfName] = useState<string>(existingIntake.sitePlanPdfName || '');
  const [sitePlanPdfDataUrl, setSitePlanPdfDataUrl] = useState<string>(existingIntake.sitePlanPdfDataUrl || '');
  const [sitePlanConfirmedEdited, setSitePlanConfirmedEdited] = useState<boolean>(
    existingIntake.sitePlanConfirmedEdited || false
  );
  const [sitePlanUploadedAt, setSitePlanUploadedAt] = useState<string>(existingIntake.sitePlanUploadedAt || '');

  // QR Intercom & NFC Wallet Upgrade state
  const pmCheckedQrIntercom = Boolean(project.useQrIntercom);
  const pmCheckedNfcWallet = Boolean(project.useNfcWallet ?? project.communityDetails?.nfcWalletConfigured);

  const [customerQrIntercomChoice, setCustomerQrIntercomChoice] = useState<boolean | undefined>(
    pmCheckedQrIntercom ? true : existingIntake.useQrIntercom
  );
  const [qrIntercomLogoName, setQrIntercomLogoName] = useState<string>(existingIntake.qrIntercomLogoName || '');
  const [qrIntercomLogoDataUrl, setQrIntercomLogoDataUrl] = useState<string>(existingIntake.qrIntercomLogoDataUrl || '');

  const [customerNfcWalletChoice, setCustomerNfcWalletChoice] = useState<boolean | undefined>(
    pmCheckedNfcWallet ? true : existingIntake.useNfcWallet
  );
  const [nfcCardArtPhotoName, setNfcCardArtPhotoName] = useState<string>(
    existingIntake.nfcCardArtPhotoName || ''
  );
  const [nfcCardArtPhotoDataUrl, setNfcCardArtPhotoDataUrl] = useState<string>(
    existingIntake.nfcCardArtPhotoDataUrl || ''
  );

  const buildCustomerNotification = (
    title: string,
    details: string,
    isFullSubmission: boolean = false
  ): ProjectActivityNotification => {
    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return {
      id: `notif-cust-${project.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: project.id,
      propertyName: project.propertyName,
      assignedPMName: project.assignedPM.name,
      assignedFieldTech: normalizeFieldTech(project.assignedFieldTech),
      timestamp: formattedTime,
      createdAtIso: now.toISOString(),
      audience: 'pm',
      category: isFullSubmission
        ? 'customer_kickoff_submission'
        : 'customer_walkthrough_update',
      title,
      details,
      actorName:
        residentEmailForUpdates ||
        staffList[0]?.email ||
        project.clientName ||
        'Property Customer',
      badgeLabel: isFullSubmission ? 'Kickoff Walkthrough Submitted' : 'Customer Walkthrough Update',
    };
  };

  const persistExtendedIntake = (overrides: {
    sitePlanPdfName?: string;
    sitePlanPdfDataUrl?: string;
    sitePlanConfirmedEdited?: boolean;
    sitePlanUploadedAt?: string;
    useQrIntercom?: boolean;
    qrIntercomLogoName?: string;
    qrIntercomLogoDataUrl?: string;
    useNfcWallet?: boolean;
    nfcCardArtPhotoName?: string;
    nfcCardArtPhotoDataUrl?: string;
    notificationTitle?: string;
    notificationDetails?: string;
  }) => {
    if (!onUpdateProject) return;
    const nextUseQr = overrides.useQrIntercom !== undefined ? overrides.useQrIntercom : customerQrIntercomChoice;
    const nextUseNfc = overrides.useNfcWallet !== undefined ? overrides.useNfcWallet : customerNfcWalletChoice;
    const nextNfcArtUrl =
      overrides.nfcCardArtPhotoDataUrl !== undefined ? overrides.nfcCardArtPhotoDataUrl : nfcCardArtPhotoDataUrl;
    const nextNfcArtName =
      overrides.nfcCardArtPhotoName !== undefined ? overrides.nfcCardArtPhotoName : nfcCardArtPhotoName;

    const notif = buildCustomerNotification(
      overrides.notificationTitle || `Customer Updated Kickoff Walkthrough (${project.propertyName})`,
      overrides.notificationDetails ||
        `Updated walkthrough preferences (PMS: ${pmsChoice}, Doors: ${commonDoors.length}, Staff: ${staffList.length}).`,
      false
    );

    onUpdateProject({
      ...project,
      useQrIntercom: nextUseQr !== undefined ? nextUseQr : project.useQrIntercom,
      useNfcWallet: nextUseNfc !== undefined ? nextUseNfc : project.useNfcWallet,
      communityDetails: project.communityDetails
        ? {
            ...project.communityDetails,
            nfcWalletConfigured: Boolean(nextUseNfc ?? project.communityDetails.nfcWalletConfigured),
          }
        : undefined,
      customerIntake: {
        ...project.customerIntake,
        pmsSoftware: pmsChoice,
        entrataCredentials: entrataCreds,
        commonAreaDoors: commonDoors,
        staffRoles: staffList,
        sitePlanPdfName: overrides.sitePlanPdfName ?? sitePlanPdfName,
        sitePlanPdfDataUrl: overrides.sitePlanPdfDataUrl ?? sitePlanPdfDataUrl,
        sitePlanConfirmedEdited: overrides.sitePlanConfirmedEdited ?? sitePlanConfirmedEdited,
        sitePlanUploadedAt: overrides.sitePlanUploadedAt ?? sitePlanUploadedAt,
        useQrIntercom: nextUseQr,
        qrIntercomLogoName: overrides.qrIntercomLogoName ?? qrIntercomLogoName,
        qrIntercomLogoDataUrl: overrides.qrIntercomLogoDataUrl ?? qrIntercomLogoDataUrl,
        useNfcWallet: nextUseNfc,
        nfcCardArtPhotoName: nextNfcArtName,
        nfcCardArtPhotoDataUrl: nextNfcArtUrl,
      },
      activityNotifications: [notif, ...(project.activityNotifications || [])],
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSitePlanPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const uploadedTime = new Date().toISOString().split('T')[0];
      setSitePlanPdfName(file.name);
      setSitePlanPdfDataUrl(dataUrl);
      setSitePlanUploadedAt(uploadedTime);
      persistExtendedIntake({
        sitePlanPdfName: file.name,
        sitePlanPdfDataUrl: dataUrl,
        sitePlanUploadedAt: uploadedTime,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleQrLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setQrIntercomLogoName(file.name);
      setQrIntercomLogoDataUrl(dataUrl);
      persistExtendedIntake({
        useQrIntercom: true,
        qrIntercomLogoName: file.name,
        qrIntercomLogoDataUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNfcPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setNfcCardArtPhotoName(file.name);
      setNfcCardArtPhotoDataUrl(dataUrl);
      persistExtendedIntake({
        useNfcWallet: true,
        nfcCardArtPhotoName: file.name,
        nfcCardArtPhotoDataUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCustomerConfirmQrIntercom = (usingFeature: boolean) => {
    setCustomerQrIntercomChoice(usingFeature);
    persistExtendedIntake({ useQrIntercom: usingFeature });
  };

  const handleCustomerConfirmNfcWallet = (usingFeature: boolean) => {
    setCustomerNfcWalletChoice(usingFeature);
    persistExtendedIntake({ useNfcWallet: usingFeature });
  };

  const saveIntakeUpdates = (
    updatedDoors = commonDoors,
    updatedStaff = staffList,
    updatedPms = pmsChoice,
    updatedEntrata = entrataCreds,
    submitted = isWalkthroughSubmitted,
    subscriberEmail = residentEmailForUpdates,
    cadence = emailUpdateCadence,
    doorsNotAvailable = doorNamesNotAvailableNow,
    followUpDate = doorNamesFollowUpDate,
    customNotification?: { title: string; details: string; isSubmission?: boolean }
  ) => {
    if (onUpdateProject) {
      const notif = buildCustomerNotification(
        customNotification?.title ||
          (submitted
            ? `Customer Submitted Kickoff Walkthrough Form Answers`
            : `Customer Updated Kickoff Walkthrough Form`),
        customNotification?.details ||
          `PMS: ${updatedPms} · ${updatedDoors.length} Common Area Doors · ${
            updatedStaff.length
          } Staff Roles${subscriberEmail ? ` · Subscriber: ${subscriberEmail} (${cadence})` : ''}`,
        Boolean(customNotification?.isSubmission ?? submitted)
      );

      onUpdateProject({
        ...project,
        useQrIntercom: customerQrIntercomChoice !== undefined ? customerQrIntercomChoice : project.useQrIntercom,
        useNfcWallet: customerNfcWalletChoice !== undefined ? customerNfcWalletChoice : project.useNfcWallet,
        customerIntake: {
          ...project.customerIntake,
          pmsSoftware: updatedPms,
          entrataCredentials: updatedEntrata,
          commonAreaDoors: updatedDoors,
          staffRoles: updatedStaff,
          pmsNoticeAcknowledged: true,
          walkthroughCompleted: submitted,
          subscriberEmail,
          emailUpdatesCadence: cadence,
          doorNamesNotAvailableNow: doorsNotAvailable,
          doorNamesFollowUpDate: followUpDate,
          doorsConfirmedByCustomer: updatedDoors.length > 0 && updatedDoors.every((d) => approvedDoorIds[d.id]),
          sitePlanPdfName,
          sitePlanPdfDataUrl,
          sitePlanConfirmedEdited,
          sitePlanUploadedAt,
          useQrIntercom: customerQrIntercomChoice,
          qrIntercomLogoName,
          qrIntercomLogoDataUrl,
          useNfcWallet: customerNfcWalletChoice,
          nfcCardArtPhotoName,
          nfcCardArtPhotoDataUrl,
          submittedAt: submitted ? new Date().toISOString() : project.customerIntake?.submittedAt,
        },
        activityNotifications: [notif, ...(project.activityNotifications || [])],
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const handleAddDoor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoorName.trim()) return;

    const newDoor: CommonAreaDoor = {
      id: `door-${Date.now()}`,
      doorName: newDoorName.trim(),
      buildingOrArea: newDoorArea.trim() || 'Main Amenity Building',
      installedStatus: 'Pending',
    };

    const updated = [...commonDoors, newDoor];
    setCommonDoors(updated);
    setNewDoorName('');
    setNewDoorArea('');
    saveIntakeUpdates(updated, staffList, pmsChoice, entrataCreds);
  };

  const handleDeleteDoor = (id: string) => {
    const updated = commonDoors.filter((d) => d.id !== id);
    setCommonDoors(updated);
    saveIntakeUpdates(updated, staffList, pmsChoice, entrataCreds);
  };

  const handleToggleDoorApproval = (doorId: string) => {
    setApprovedDoorIds((prev) => ({
      ...prev,
      [doorId]: !prev[doorId],
    }));
  };

  const handleStartEditDoor = (door: CommonAreaDoor) => {
    setEditingDoorId(door.id);
    setEditingDoorName(door.doorName);
  };

  const handleSaveEditDoor = (doorId: string) => {
    if (!editingDoorName.trim()) return;
    const updated = commonDoors.map((d) => (d.id === doorId ? { ...d, doorName: editingDoorName.trim() } : d));
    setCommonDoors(updated);
    setEditingDoorId(null);
    setEditingDoorName('');
    saveIntakeUpdates(updated, staffList, pmsChoice, entrataCreds);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFirstName.trim() || !staffEmail.trim()) return;

    const newMember: StaffRoleSubmission = {
      id: `staff-${Date.now()}`,
      firstName: staffFirstName.trim(),
      lastName: staffLastName.trim(),
      email: staffEmail.trim(),
      phoneNumber: staffPhone.trim() || '(555) 000-0000',
      permissionLevel: staffPerm,
    };

    const updated = [...staffList, newMember];
    setStaffList(updated);
    setStaffFirstName('');
    setStaffLastName('');
    setStaffEmail('');
    setStaffPhone('');
    saveIntakeUpdates(commonDoors, updated, pmsChoice, entrataCreds);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staffList.filter((s) => s.id !== id);
    setStaffList(updated);
    saveIntakeUpdates(commonDoors, updated, pmsChoice, entrataCreds);
  };

  const handleCopyLink = () => {
    const shareableUrl = `${window.location.origin}/#/customer-kickoff/${project.id}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSubscribeUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentEmailForUpdates.trim()) return;
    setIsSubscribed(true);
    saveIntakeUpdates(commonDoors, staffList, pmsChoice, entrataCreds, isWalkthroughSubmitted, residentEmailForUpdates, emailUpdateCadence);
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  const handleSubmitWalkthrough = () => {
    const hasUnapprovedDoors = commonDoors.length > 0 && !commonDoors.every((d) => approvedDoorIds[d.id]);
    
    // Check if customer attempts to submit without approving door names and has not provided an alternate date
    if (hasUnapprovedDoors && !doorNamesNotAvailableNow) {
      setDoorNamesValidationError(
        'Please confirm and approve your common area door names below, or indicate when you will provide this information before submitting.'
      );
      setActiveStep(3); // Route back to Slide 4
      return;
    }

    if (doorNamesNotAvailableNow && !doorNamesFollowUpDate.trim()) {
      setDoorNamesValidationError(
        'Please provide an estimated date when you will supply common area door names so our Project Managers can document it.'
      );
      setActiveStep(3); // Route back to Slide 4
      return;
    }

    setDoorNamesValidationError(null);
    setIsWalkthroughSubmitted(true);
    saveIntakeUpdates(
      commonDoors,
      staffList,
      pmsChoice,
      entrataCreds,
      true,
      residentEmailForUpdates,
      emailUpdateCadence,
      doorNamesNotAvailableNow,
      doorNamesFollowUpDate,
      {
        title: `Customer Submitted Kickoff Walkthrough Form Answers`,
        details: `Submitted by ${
          residentEmailForUpdates || staffList[0]?.email || project.clientName
        } · PMS: ${pmsChoice} · ${commonDoors.length} Common Area Doors · ${
          staffList.length
        } Staff Access Roles (${emailUpdateCadence} email updates).`,
        isSubmission: true,
      }
    );
  };

  const handleDownloadSummary = () => {
    const intakeDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Quext Kickoff Walkthrough Records - ${project.propertyName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; background: #fff; }
    .header { border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { margin: 0 0 8px 0; color: #0f172a; font-size: 26px; font-weight: 800; }
    .meta { color: #64748b; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 6px; font-weight: 700; font-size: 12px; margin-bottom: 8px; }
    .section { margin-bottom: 25px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; }
    h2 { font-size: 16px; margin-top: 0; margin-bottom: 12px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    th { background: #f1f5f9; color: #475569; font-weight: 600; }
    .kv { display: flex; margin-bottom: 8px; font-size: 14px; }
    .kv-k { width: 220px; font-weight: 600; color: #475569; }
    .kv-v { color: #0f172a; font-weight: 500; }
    .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">Official Customer Kickoff Record</div>
    <h1>${project.propertyName}</h1>
    <div class="meta">Client: ${project.clientName} · ${project.city}, ${project.state} · ${project.unitsCount} Units · Quote: #${project.quoteNumber}</div>
    <div class="meta" style="margin-top: 6px;">Generated on: ${new Date().toLocaleString()} · Assigned PM: ${project.assignedPM.name} (${project.assignedPM.email}) · Field Tech: ${project.assignedFieldTech || 'Hector'}</div>
  </div>

  <div class="section">
    <h2>1. Property Management System (PMS) Integration</h2>
    <div class="kv"><div class="kv-k">PMS Choice:</div><div class="kv-v"><strong>${pmsChoice}</strong></div></div>
    ${pmsChoice === 'Entrata' ? `
    <div class="kv"><div class="kv-k">Entrata API Base URL:</div><div class="kv-v">${entrataCreds.apiBaseUrl || 'Not provided'}</div></div>
    <div class="kv"><div class="kv-k">Entrata Username:</div><div class="kv-v">${entrataCreds.username || 'Not provided'}</div></div>
    <div class="kv"><div class="kv-k">Entrata Password:</div><div class="kv-v">${entrataCreds.password ? '•••••••• (' + entrataCreds.password + ')' : 'Not provided'}</div></div>
    ` : ''}
    <div class="kv"><div class="kv-k">PMS Integration Status:</div><div class="kv-v">Customer Confirmed &amp; Signed Off</div></div>
  </div>

  <div class="section">
    <h2>2. Configured Common Area Doors Tree (${commonDoors.length} doors)</h2>
    <table>
      <thead>
        <tr><th>Door Name</th><th>Building / Location Area</th><th>Approval Status</th></tr>
      </thead>
      <tbody>
        ${commonDoors.map((d) => `<tr><td><strong>${d.doorName}</strong></td><td>${d.buildingOrArea || 'Main Area'}</td><td>${approvedDoorIds[d.id] ? '✓ Approved by Customer' : 'Confirmed'}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>3. Authorized Staff Roles &amp; Access Permissions (${staffList.length} members)</h2>
    <table>
      <thead>
        <tr><th>Staff Name</th><th>Email</th><th>Phone</th><th>Permission Tier</th></tr>
      </thead>
      <tbody>
        ${staffList.map((s) => `<tr><td><strong>${s.firstName} ${s.lastName}</strong></td><td>${s.email}</td><td>${s.phoneNumber}</td><td><span class="badge">${s.permissionLevel}</span></td></tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>4. Hardware Ecosystem Bill of Materials</h2>
    <table>
      <thead>
        <tr><th>Item Name</th><th>Model</th><th>Category</th><th>Quoted Quantity</th></tr>
      </thead>
      <tbody>
        ${project.bomItems.map((item) => `<tr><td><strong>${item.name}</strong></td><td>${item.model}</td><td>${item.category}</td><td>${item.quantity}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>5. Deployment Updates Subscription</h2>
    <div class="kv"><div class="kv-k">Subscriber Email:</div><div class="kv-v">${residentEmailForUpdates || 'Not specified'}</div></div>
    <div class="kv"><div class="kv-k">Cadence Preference:</div><div class="kv-v">${emailUpdateCadence.toUpperCase()}</div></div>
    <div class="kv"><div class="kv-k">Submission Status:</div><div class="kv-v">✓ Completed &amp; Archived</div></div>
  </div>

  <div class="footer">
    Quext Multifamily IoT · 4500 Grand Horizon Blvd · Support: support@onequext.com
  </div>
</body>
</html>`;

    const blob = new Blob([intakeDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quext-Kickoff-Records-${project.propertyName.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Full transparency BOM items
  const bomItems = project.bomItems || [];
  const hasWifi = bomItems.some(
    (item) => item.category === 'Bulk Managed Wi-Fi' || item.name.toLowerCase().includes('wifi')
  );

  // Helper to identify software BOM items so hardware prices remain undisclosed
  const isSoftwareBOMItem = (item: BOMItem): boolean => {
    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    const model = (item.model || '').toLowerCase();
    return (
      cat.includes('software') ||
      cat.includes('saas') ||
      cat.includes('cloud') ||
      cat.includes('subscription') ||
      cat.includes('license') ||
      cat.includes('platform') ||
      name.includes('software') ||
      name.includes('saas') ||
      name.includes('subscription') ||
      name.includes('license') ||
      name.includes('platform fee') ||
      name.includes('monthly') ||
      model.startsWith('sw-') ||
      model.startsWith('qxt-sw')
    );
  };

  // Retrieve matching quote to accurately reflect active monthly software service fee
  const matchingQuote = useMemo(() => {
    try {
      const quotes = loadStoredQuotes();
      return quotes.find((q) => q.id === project.quoteId || q.quoteNumber === project.quoteNumber);
    } catch {
      return null;
    }
  }, [project.quoteId, project.quoteNumber]);

  const monthlySoftwareFee = matchingQuote?.monthlyServiceFee || (project.unitsCount * 30);
  const hasAnySoftwareBOMItem = bomItems.some(isSoftwareBOMItem);

  // Community software platform modules with reflected subscription pricing
  const softwareSubscriptions = useMemo(() => {
    const hasLocks = bomItems.some((i) => i.category === 'Smart Access Control' || i.name.toLowerCase().includes('lock') || i.name.toLowerCase().includes('deadbolt'));
    const hasStats = bomItems.some((i) => i.category === 'Smart Thermostats & HVAC' || i.name.toLowerCase().includes('thermostat'));
    const hasLeaks = bomItems.some((i) => i.category === 'Sensors & Leak Protection' || i.name.toLowerCase().includes('leak'));
    const hasBulkWifi = bomItems.some((i) => i.category === 'Bulk Managed Wi-Fi' || i.name.toLowerCase().includes('wi-fi') || i.name.toLowerCase().includes('wifi'));

    const list = [
      {
        name: 'Quext IoT Smart Community Platform & Core Mesh',
        price: '$8.00 / unit / mo',
        perUnitPrice: 8,
        description: 'High-availability LoRaWAN network gateway routing, device health heartbeats, and cloud telemetry.',
      },
    ];

    if (hasLocks) {
      list.push({
        name: 'Quext Digital Key Access Control & Apple Wallet Hub',
        price: '$10.00 / unit / mo',
        perUnitPrice: 10,
        description: 'Instant mobile key provisioning, NFC digital pass issuing, guest PIN passes, and common door access.',
      });
    }

    if (hasStats) {
      list.push({
        name: 'Quext Smart Thermostat & HVAC Energy Management',
        price: '$6.00 / unit / mo',
        perUnitPrice: 6,
        description: 'Automated vacant unit temperature drift, humidity threshold alerts, and resident energy schedules.',
      });
    }

    if (hasLeaks) {
      list.push({
        name: 'Instant Water Leak Protection & Incident Alarm Telemetry',
        price: '$2.00 / unit / mo',
        perUnitPrice: 2,
        description: 'Real-time conductivity sensing, auto shutoff relay commands, and maintenance emergency SMS dispatch.',
      });
    }

    list.push({
      name: 'Quext Resident Mobile App & Staff Management Dashboard',
      price: '$4.00 / unit / mo',
      perUnitPrice: 4,
      description: 'Native iOS & Android resident mobile portal with digital key unlocks, climate controls, and community messaging.',
    });

    if (hasBulkWifi) {
      list.push({
        name: 'Bulk Managed Wi-Fi 7 Enterprise Network Cloud Controller',
        price: '$5.00 / unit / mo',
        perUnitPrice: 5,
        description: 'Property-wide personal resident VLAN roaming, gigabit bandwidth steering, and 24/7 security monitoring.',
      });
    }

    return list;
  }, [bomItems]);

  const steps = [
    { id: 'welcome', label: '1. Welcome & Vision' },
    { id: 'team', label: '2. Meet Your Team' },
    { id: 'pms', label: '3. PMS Integration' },
    { id: 'doors', label: '4. Common Doors Tree' },
    { id: 'staff', label: '5. Staff Permissions' },
    { id: 'hardware', label: '6. Hardware Ecosystem' },
    { id: 'timeline', label: '7. Milestones' },
    { id: 'communication', label: '8. Resident Kit & Submit' },
  ];

  // Standard 7 operations milestones (Design milestone removed)
  const standardMilestones = [
    {
      title: 'Project kickoff',
      description: 'Orientation walkthrough, stakeholder alignment, site layout survey, and PMS kickoff.',
      target: project.milestones?.find((m) => m.title === 'Project kickoff')?.targetDate || project.startDate,
      status: project.milestones?.find((m) => m.title === 'Project kickoff')?.status || 'Completed',
    },
    {
      title: 'Portal Buildout',
      description: 'Quext Portal core database configuration, user roster setup, and floorplan unit mapping.',
      target: project.milestones?.find((m) => m.title === 'Portal Buildout')?.targetDate || '2026-10-24',
      status: project.milestones?.find((m) => m.title === 'Portal Buildout')?.status || 'Completed',
    },
    {
      title: 'Product Acquisition',
      description: 'BOM hardware delivery to staging bay: LoRaWAN gateways, smart deadbolts, stats, and readers.',
      target: project.milestones?.find((m) => m.title === 'Product Acquisition')?.targetDate || '2026-11-02',
      status: project.milestones?.find((m) => m.title === 'Product Acquisition')?.status || 'Completed',
    },
    {
      title: 'CSM Intro - Pre-implementation',
      description: 'Introduction of dedicated Customer Success Manager, pre-implementation readiness review, and property staff alignment.',
      target: project.milestones?.find((m) => m.title === 'CSM Intro - Pre-implementation')?.targetDate || '2026-11-06',
      status: project.milestones?.find((m) => m.title === 'CSM Intro - Pre-implementation')?.status || 'Completed',
    },
    {
      title: 'Implementation',
      description: 'Physical door-to-door installation, 915MHz RF signal verification, and live gateway telemetry tests.',
      target: project.milestones?.find((m) => m.title === 'Implementation')?.targetDate || '2026-11-12',
      status: project.milestones?.find((m) => m.title === 'Implementation')?.status || 'In Progress',
    },
    {
      title: 'CSM Handoff',
      description: 'Operational transition to your dedicated Customer Success Manager. Project automatically closes 7 days after handoff.',
      target: project.milestones?.find((m) => m.title === 'CSM Handoff')?.targetDate || '2026-11-20',
      status: project.milestones?.find((m) => m.title === 'CSM Handoff')?.status || 'Upcoming',
    },
    {
      title: 'Project Closed',
      description: '100% devices verified online, warranty package delivered, transition to 24/7 resident technical support.',
      target: project.milestones?.find((m) => m.title === 'Project Closed')?.targetDate || project.targetCompletionDate,
      status: project.milestones?.find((m) => m.title === 'Project Closed')?.status || 'Upcoming',
    },
  ];

  // Current active milestone index for "YOU ARE HERE" pin
  const currentMilestoneIndex = Math.max(
    0,
    standardMilestones.findIndex((m) => m.status === 'In Progress') !== -1
      ? standardMilestones.findIndex((m) => m.status === 'In Progress')
      : standardMilestones.findIndex((m) => m.status === 'Upcoming') !== -1
      ? standardMilestones.findIndex((m) => m.status === 'Upcoming')
      : standardMilestones.length - 1
  );

  return (
    <div className="space-y-6">
      {/* Top Client-Facing Link & Actions Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Client Kickoff Portal:</strong> Tailored for{' '}
            <span className="font-semibold">{project.propertyName}</span>. Send this dedicated link to your customer to capture their PMS software, door naming tree, and staff roles.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs shadow-xs"
            title="Copy shareable customer portal link to clipboard"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Customer Link'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'walkthrough' ? 'full-document' : 'walkthrough')}
            className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
          >
            {viewMode === 'walkthrough' ? 'View Full Document' : 'View Step Slides'}
          </button>
          {!isStandaloneClientView && onBackToTechnicalBOM && (
            <button
              type="button"
              onClick={onBackToTechnicalBOM}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium rounded-lg transition-colors cursor-pointer text-xs"
            >
              Back to Field BOM
            </button>
          )}
        </div>
      </div>

      {/* Step Navigation Pill Bar (When in Walkthrough Mode) */}
      {viewMode === 'walkthrough' && (
        <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'bg-sky-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: WELCOME & VISION */}
      {/* ========================================================================= */}
      {(viewMode === 'full-document' || activeStep === 0) && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-8 sm:p-12">
            <div className="max-w-4xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-medium text-sky-200 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Quext Community Kickoff Walkthrough</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white px-3 py-1.5 rounded-md inline-block shadow-md">
                  <img
                    src="/assets/aistudio/Quext_Logo_Black_ba76e58b.png"
                    alt="Quext"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <span className="text-slate-400 text-sm">·</span>
                <span className="text-xl font-bold tracking-tight text-white">{project.propertyName}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] leading-tight mb-4">
                Smart Communities. <br />
                <span className="text-sky-400">Brilliantly Simple.</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
                Welcome to your official implementation kickoff for <strong className="text-white">{project.propertyName}</strong>.
                Together with <strong className="text-white">{project.clientName}</strong>, our team is delivering a streamlined, 
                high-reliability smart multifamily ecosystem across your <strong className="text-white font-mono">{project.unitsCount} residential units</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
                  <KeyRound className="w-3.5 h-3.5 text-sky-400" /> Smart Access
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" /> IoT Device Automation
                </span>
                {hasWifi && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
                    <Wifi className="w-3.5 h-3.5 text-sky-400" /> WiFi Infrastructure
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" /> Digital Mobile Keys
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
                  <Layers className="w-3.5 h-3.5 text-sky-400" /> All-in-One Cloud Platform
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.address}, {project.city}, {project.state}
              </span>
              <span>·</span>
              <span>
                Target Completion: <strong className="text-slate-900 font-mono">{project.targetCompletionDate}</strong>
              </span>
            </div>

            {viewMode === 'walkthrough' && (
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue: Meet Your Team</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: MEET YOUR TEAM */}
      {/* ========================================================================= */}
      {(viewMode === 'full-document' || activeStep === 1) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
              Implementation Leadership & Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-2">
              Meet your <span className="text-sky-600">team.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your dedicated points of contact ensuring smooth hardware delivery, field execution, and ongoing operational success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Project Management */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Users className="w-4 h-4 text-sky-600" />
                  <span>Project Management</span>
                </div>
                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                  Primary Contact
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-900">{project.assignedPM.name}</div>
                  <div className="text-[11px] text-sky-700 font-medium">{project.assignedPM.role}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{project.assignedPM.email}</div>
                  {project.assignedPM.phone && (
                    <div className="text-[11px] text-slate-500 font-mono">{project.assignedPM.phone}</div>
                  )}
                </div>

                <div className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-700 mb-1">Quext Operations Leadership:</div>
                  <div className="text-xs text-slate-800 font-medium">Raul Recalde · Director of Implementation</div>
                  <div className="text-[11px] text-slate-500 font-mono">raul.recalde@onequext.com</div>
                  <div className="mt-2 text-xs text-slate-800 font-medium">Bethany Condon · Project Manager</div>
                  <div className="text-xs text-slate-800 font-medium">Megan Rossman · Director of Operations</div>
                </div>
              </div>
            </div>

            {/* Customer Experience (CSM) */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Customer Experience (CSM)</span>
                </div>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                  Training Lead
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-900">
                    {project.assignedCSM || project.communityDetails?.csmName || 'Nicole Franklin'}
                  </div>
                  <div className="text-[11px] text-purple-700 font-medium">Dedicated Customer Success Lead</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">cs@onequext.com</div>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Responsible for onboarding your on-site leasing and maintenance staff onto the Quext Portal and dispatching resident communication kits.
                </p>

                <div className="pt-1 text-slate-700 text-[11px]">
                  <span className="font-semibold">CSM Team:</span> Nicole Franklin, Jasmine Hunt, Tessa Peshke, Branden Girman, Kennedy Staiger
                </div>
              </div>
            </div>

            {/* Field Operations & Install */}
            {(() => {
              const effectiveFieldTechName = normalizeFieldTech(project.assignedFieldTech || project.communityDetails?.fieldOpsLead);
              const effectiveFieldTechRole =
                effectiveFieldTechName === 'Sean Gates'
                  ? 'Field Operations Director'
                  : 'Senior Field Operations Lead';

              return (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Field Operations & Install</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      On-Site
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                      <div className="text-xs font-bold text-slate-900">{effectiveFieldTechName}</div>
                      <div className="text-[11px] text-emerald-700 font-medium">{effectiveFieldTechRole}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">National Certified Contractor Team</div>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Supervises certified field technicians on-site for deadbolt mounting, strike plate mortising, thermostat wiring, and LoRaWAN gateway testing.
                    </p>

                    <div className="pt-1 text-slate-700 text-[11px] flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">Assigned Field Tech:</span>
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                          {effectiveFieldTechName}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Field Team Specialists: Hector Lopez, Sean Gates, Low-Voltage Regional Crew
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {viewMode === 'walkthrough' && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep(0)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
              >
                <span>Continue: PMS Integration</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: PMS INTEGRATION SELECTION */}
      {/* ========================================================================= */}
      {(viewMode === 'full-document' || activeStep === 2) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
              Integration Setup
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-2">
              Property Management Software (PMS)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select the property management system that manages resident leases and move-in/move-out workflows.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 max-w-2xl text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-900 text-sm">
                What Property Management Software will you be using?
              </label>
              <select
                value={pmsChoice}
                onChange={(e) => {
                  const val = e.target.value as PMSSoftwareChoice;
                  setPmsChoice(val);
                  saveIntakeUpdates(commonDoors, staffList, val, entrataCreds);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:border-sky-500 text-xs shadow-xs"
              >
                {[
                  'Yardi',
                  'Appfolio',
                  'Entrata',
                  'Realpage',
                  'Buildium',
                  'Propertyware',
                  'ResMan',
                  'Rent Manager',
                  'MRI Software',
                  'None',
                ].map((software) => (
                  <option key={software} value={software}>
                    {software}
                  </option>
                ))}
              </select>
            </div>

            {pmsChoice === 'None' && (
              <div className="p-3 bg-slate-100 rounded-lg text-slate-600 text-xs border border-slate-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0" />
                <span>No automated PMS integration selected. You can manage resident units and keys directly via the Quext Portal.</span>
              </div>
            )}

            {pmsChoice !== 'None' && pmsChoice !== 'Entrata' && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Action Required for {pmsChoice} Integration:</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed pl-6">
                  Please reach out to your designated <strong>{pmsChoice}</strong> company Representative and request permissions for <strong>Quext</strong> to connect, and/or navigate to the app store within your PMS software and select Quext.
                </p>
              </div>
            )}

            {pmsChoice === 'Entrata' && (
              <div className="p-4 bg-sky-50 border border-sky-300 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-sky-950 text-sm">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>Entrata Integration Credentials</span>
                </div>
                <div className="p-2.5 bg-sky-100/70 border border-sky-200 rounded text-[11px] text-sky-900 leading-relaxed">
                  <strong>Please note:</strong> Our user will need to be granted access, so our integration can pull in data related to the property. Ask your PM what our user will be.
                </div>
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="font-semibold text-slate-800">Entrata Username</label>
                    <input
                      type="text"
                      value={entrataCreds.username}
                      onChange={(e) => {
                        const updated = { ...entrataCreds, username: e.target.value };
                        setEntrataCreds(updated);
                        saveIntakeUpdates(commonDoors, staffList, pmsChoice, updated);
                      }}
                      placeholder="e.g. quext_api_user"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-800">Entrata Password</label>
                    <input
                      type="password"
                      value={entrataCreds.password || ''}
                      onChange={(e) => {
                        const updated = { ...entrataCreds, password: e.target.value };
                        setEntrataCreds(updated);
                        saveIntakeUpdates(commonDoors, staffList, pmsChoice, updated);
                      }}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-800">API Base URL</label>
                    <input
                      type="text"
                      value={entrataCreds.apiBaseUrl}
                      onChange={(e) => {
                        const updated = { ...entrataCreds, apiBaseUrl: e.target.value };
                        setEntrataCreds(updated);
                        saveIntakeUpdates(commonDoors, staffList, pmsChoice, updated);
                      }}
                      placeholder="https://clientname.entrata.com/api/v1"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs font-mono mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {viewMode === 'walkthrough' && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
              >
                <span>Continue: Common Doors Location Tree</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: LOCATION TREE FOR COMMON AREA DOORS (Slide 4 Enhanced)        */}
      {/* Requirement: Leave blank & hide if blank; if not blank show door names,  */}
      {/* approval button, and allow inline door name change!                      */}
      {/* ========================================================================= */}
      {(viewMode === 'full-document' || activeStep === 3) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
              Door Hardware Mapping
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-2">
              Common Area Doors Location Tree
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Please specify the exact names for all common area and amenity doors on your property. Once submitted, this tree appears directly in our PM hardware commissioning dropdown.
            </p>
          </div>

          {/* Validation Alert if customer attempted to submit without approving door names */}
          {doorNamesValidationError && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950 flex items-start gap-3 animate-fadeIn shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-xs sm:text-sm text-amber-900">
                  Door Names Confirmation Required
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {doorNamesValidationError}
                </p>
              </div>
            </div>
          )}

          {/* Door Entry Form */}
          <form onSubmit={handleAddDoor} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 max-w-2xl text-xs">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" />
              <span>Add a Common Area Door</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Door Name *</label>
                <input
                  type="text"
                  required
                  value={newDoorName}
                  onChange={(e) => setNewDoorName(e.target.value)}
                  placeholder="e.g. Clubhouse Main Entry, Pool Gate North"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Building or Area Location</label>
                <input
                  type="text"
                  value={newDoorArea}
                  onChange={(e) => setNewDoorArea(e.target.value)}
                  placeholder="e.g. Clubhouse, Garage Floor 2, Amenity Deck"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Door to Tree</span>
              </button>
            </div>
          </form>

          {/* Requirement: "at the bottom leave this blank and only fill this in if there is already common area doors filled out and hide it from the customer if it is blank if it is not blank show the names of the doors here and provide a button of approval for them confirming that the door name is what they desire if it is not allow them to change the door name." */}
          {commonDoors.length > 0 && (
            <div className="space-y-3 max-w-3xl pt-2 border-t border-slate-200 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 pb-1">
                <span>Configured Common Area Doors ({commonDoors.length})</span>
                <span className="text-[11px] font-normal text-slate-500">
                  Review door names below. Click to approve or edit the door name to your desired label.
                </span>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                {commonDoors.map((door) => {
                  const isApproved = approvedDoorIds[door.id];
                  const isEditingThisDoor = editingDoorId === door.id;

                  return (
                    <div key={door.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm shrink-0">
                          🚪
                        </div>

                        {isEditingThisDoor ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingDoorName}
                              onChange={(e) => setEditingDoorName(e.target.value)}
                              className="px-2.5 py-1 bg-white border border-sky-400 rounded text-slate-900 text-xs font-semibold focus:outline-none flex-1"
                              placeholder="Type desired door name..."
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditDoor(door.id)}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-xs cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingDoorId(null)}
                              className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                              <span className="truncate">{door.doorName}</span>
                              {isApproved && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Approved</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{door.buildingOrArea || 'Main Area Location'}</div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons: Approval and Change Door Name */}
                      {!isEditingThisDoor && (
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Approval Button confirming door name is what they desire */}
                          <button
                            type="button"
                            onClick={() => handleToggleDoorApproval(door.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isApproved
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isApproved ? 'Door Name Approved ✓' : 'Approve Door Name'}</span>
                          </button>

                          {/* Change Door Name Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEditDoor(door)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                            title="Change door name if not what you desire"
                          >
                            <Edit2 className="w-3 h-3 text-slate-500" />
                            <span>Change Name</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDoor(door.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors"
                            title="Remove door"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Requirement: If door names are not able to be provided at the time, ask if this is the case and have the customer provide a date when they will provide this information for the Project managers to document. */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="doorNamesNotAvailable"
                checked={doorNamesNotAvailableNow}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setDoorNamesNotAvailableNow(checked);
                  if (!checked) {
                    setDoorNamesFollowUpDate('');
                  }
                  saveIntakeUpdates(commonDoors, staffList, pmsChoice, entrataCreds, isWalkthroughSubmitted, residentEmailForUpdates, emailUpdateCadence, checked, checked ? doorNamesFollowUpDate : '');
                }}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="doorNamesNotAvailable" className="font-bold text-slate-900 cursor-pointer">
                  Are door names not able to be provided at this time?
                </label>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  If common area door labels or architectural prints are still pending approval from ownership, check this box and indicate when you will provide them.
                </p>

                {doorNamesNotAvailableNow && (
                  <div className="mt-3 p-3 bg-white border border-sky-300 rounded-lg space-y-2 animate-fadeIn">
                    <label className="block text-[11px] font-bold text-sky-950">
                      When will you provide this information for our Project Managers to document? *
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="date"
                        required
                        value={doorNamesFollowUpDate}
                        onChange={(e) => {
                          const dateVal = e.target.value;
                          setDoorNamesFollowUpDate(dateVal);
                          saveIntakeUpdates(commonDoors, staffList, pmsChoice, entrataCreds, isWalkthroughSubmitted, residentEmailForUpdates, emailUpdateCadence, true, dateVal);
                        }}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-500">
                        Our PM team will log this commitment date on your project records.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {viewMode === 'walkthrough' && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: PMS</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const hasUnapproved = commonDoors.length > 0 && !commonDoors.every((d) => approvedDoorIds[d.id]);
                  if (hasUnapproved && !doorNamesNotAvailableNow) {
                    setDoorNamesValidationError(
                      'Please approve all door names or check the option below specifying when you will provide them before continuing.'
                    );
                    return;
                  }
                  if (doorNamesNotAvailableNow && !doorNamesFollowUpDate.trim()) {
                    setDoorNamesValidationError(
                      'Please select an estimated date when door names will be provided.'
                    );
                    return;
                  }
                  setDoorNamesValidationError(null);
                  setActiveStep(4);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
              >
                <span>Continue: Staff Permissions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: STAFF ROLES & PERMISSION LEVELS */}
      {/* ========================================================================= */}
      {(viewMode === 'full-document' || activeStep === 4) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
              User Access & Roles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-2">
              Staff Roles & Portal Permission Levels
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Add your on-site team members, leasing agents, maintenance technicians, and vendor contacts.
            </p>
          </div>

          {/* Add Staff Form */}
          <form onSubmit={handleAddStaff} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 max-w-3xl text-xs">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" />
              <span>Register a Staff Member or Vendor</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">First Name *</label>
                <input
                  type="text"
                  required
                  value={staffFirstName}
                  onChange={(e) => setStaffFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Last Name *</label>
                <input
                  type="text"
                  required
                  value={staffLastName}
                  onChange={(e) => setStaffLastName(e.target.value)}
                  placeholder="e.g. Miller"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="john.miller@property.com"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="(512) 555-0144"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 mt-1"
                />
              </div>
            </div>

            {/* Permission Level Selector with Exact User Prompt Descriptions */}
            <div className="space-y-2 pt-2">
              <label className="font-bold text-slate-900 text-xs">
                Select Portal Permission Level:
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {/* Manager */}
                <label
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    staffPerm === 'Manager'
                      ? 'bg-sky-50/80 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="permLevel"
                    value="Manager"
                    checked={staffPerm === 'Manager'}
                    onChange={() => setStaffPerm('Manager')}
                    className="mt-0.5 text-sky-600"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span>Manager Level Permissions</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-100 text-sky-800 font-bold">
                        Full Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Full administrative access to manage lower-level users, automation settings, devices, permissions, and operational workflows across the property or organization. Best suited for roles like Property Manager, Regional Manager.
                    </p>
                  </div>
                </label>

                {/* Staff */}
                <label
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    staffPerm === 'Staff'
                      ? 'bg-purple-50/80 border-purple-400 ring-1 ring-purple-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="permLevel"
                    value="Staff"
                    checked={staffPerm === 'Staff'}
                    onChange={() => setStaffPerm('Staff')}
                    className="mt-0.5 text-purple-600"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span>Staff Level Permissions</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-100 text-purple-800 font-bold">
                        Daily Operational
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Operational access for managing residents, users, units, access, and daily workflows without full administrative control. Ideal for Lead Maintenance, Front Desk, and Community staff. Cannot install or replace devices.
                    </p>
                  </div>
                </label>

                {/* Limited */}
                <label
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    staffPerm === 'Limited'
                      ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="permLevel"
                    value="Limited"
                    checked={staffPerm === 'Limited'}
                    onChange={() => setStaffPerm('Limited')}
                    className="mt-0.5 text-amber-600"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span>Limited Level Permissions</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                        Restricted
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Restricted access focused on managing devices with limited visibility into administrative settings. Best suited for roles like Maintenance Staff, Channel Partner, or Temporary Staff.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Staff Member</span>
              </button>
            </div>
          </form>

          {/* Current Staff List */}
          <div className="space-y-2 max-w-3xl">
            <div className="font-bold text-slate-800 text-xs">Registered Staff Roster ({staffList.length})</div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              {staffList.map((member) => (
                <div key={member.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{member.firstName} {member.lastName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          member.permissionLevel === 'Manager'
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : member.permissionLevel === 'Staff'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {member.permissionLevel} Permissions
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {member.email} · <span className="font-mono">{member.phoneNumber}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteStaff(member.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors"
                    title="Remove user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {viewMode === 'walkthrough' && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Common Doors</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(5)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
              >
                <span>Continue: Hardware Ecosystem</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: PROPERTY HARDWARE ECOSYSTEM (Slide 6 Updated with ALL BOM items) */}
      {/* Requirement: "Update the property hardware ecosystem with all items of the BOM */}
      {/* we want full transparency on this page."                                  */}
      {/* ========================================================================= */}
      {(viewMode === 'full-document' || activeStep === 5) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
                Bill of Materials Breakdown
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-2">
                Property Hardware Ecosystem
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                A complete catalog of all {bomItems.length} hardware products being provisioned and deployed for {project.propertyName}.
              </p>
            </div>

            <div className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 shrink-0">
              Total Quoted Devices: <strong>{bomItems.reduce((acc, i) => acc + i.quantity, 0).toLocaleString()} units</strong>
            </div>
          </div>

          {/* Full BOM Items Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Product Name & Specifications</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Scope / Location</th>
                  <th className="py-3 px-3 text-right">Quoted Quantity</th>
                  <th className="py-3 px-3 text-right">Spares</th>
                  {hasAnySoftwareBOMItem && (
                    <th className="py-3 px-4 text-right">Monthly Subscription</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bomItems.map((item) => {
                  const isSoftware = isSoftwareBOMItem(item);
                  const itemTotal = (item.quantity + (item.sparesCount || 0)) * item.unitPrice;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                          <span>SKU: {item.model}</span>
                          {item.thermostatBrand && (
                            <span className="font-sans font-bold text-amber-800 bg-amber-50 px-1 rounded border border-amber-200">
                              Brand: {item.thermostatBrand}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-medium">
                        {item.location}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                        {(item.sparesCount ?? 0) > 0 ? (
                          <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            +{item.sparesCount}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      {hasAnySoftwareBOMItem && (
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          {isSoftware ? (
                            <span className="font-bold text-purple-900 font-mono">${itemTotal.toLocaleString()}/mo</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-900">
                  <td colSpan={3} className="py-3 px-4">Total Quoted Equipment Baseline</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    {bomItems.reduce((acc, i) => acc + i.quantity, 0).toLocaleString()} units
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-amber-900 tabular-nums">
                    +{bomItems.reduce((acc, i) => acc + (i.sparesCount || 0), 0)} spares
                  </td>
                  {hasAnySoftwareBOMItem && (
                    <td className="py-3 px-4 text-right font-mono font-bold text-purple-900 tabular-nums">
                      ${bomItems.filter(isSoftwareBOMItem).reduce((acc, i) => acc + (i.quantity + (i.sparesCount || 0)) * i.unitPrice, 0).toLocaleString()}/mo
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Reflected Software Platform Subscriptions Card */}
          <div className="bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-slate-50 border border-purple-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-200/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 rounded uppercase tracking-wider">
                    Recurring Software Subscriptions
                  </span>
                  <span className="text-[11px] font-semibold text-purple-800">
                    Active Platform Services
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Quext IoT Software &amp; Cloud Platform Subscriptions
                </h3>
                <p className="text-xs text-slate-600">
                  Reflected monthly platform licensing for {project.unitsCount} residential units and community infrastructure.
                </p>
              </div>

              <div className="flex flex-col sm:items-end bg-white/90 border border-purple-200 rounded-xl px-4 py-2 shadow-xs shrink-0">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Monthly Software</span>
                <span className="text-lg sm:text-xl font-extrabold text-purple-900 font-mono">
                  ${monthlySoftwareFee.toLocaleString()} <span className="text-xs font-normal text-slate-600">/ mo</span>
                </span>
                <span className="text-[10px] text-purple-700 font-mono font-medium">
                  (${Math.round(monthlySoftwareFee / project.unitsCount)} / unit / month)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {softwareSubscriptions.map((sw) => (
                <div key={sw.name} className="p-3.5 bg-white border border-purple-100 rounded-xl flex flex-col justify-between shadow-2xs hover:border-purple-300 transition-colors">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs">{sw.name}</span>
                      <span className="font-mono text-purple-700 font-bold text-xs bg-purple-50 px-2 py-0.5 rounded border border-purple-200 whitespace-nowrap">
                        {sw.price}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {sw.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-[10px]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Active Cloud License
                    </span>
                    <span className="font-mono text-slate-600 font-bold">
                      ${(sw.perUnitPrice * project.unitsCount).toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* QR INTERCOM LOGO UPLOAD & NFC WALLET UPGRADE PROPERTY PHOTO CARD ART      */}
          {/* ========================================================================= */}
          <div className="pt-6 border-t border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-300 rounded uppercase tracking-wider">
                  Digital Experience & Branding Assets
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1.5">
                  QR Intercom Feature & NFC Wallet Upgrade Branding
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Confirm whether your property is utilizing QR Intercom and/or NFC Wallet Upgrade and upload your branding assets below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. QR Intercom Feature Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">QR Intercom Feature</h4>
                        <p className="text-[11px] text-slate-500">
                          Custom property logo displayed on resident & visitor QR Intercom directory screens
                        </p>
                      </div>
                    </div>
                    {customerQrIntercomChoice === true ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                        Enabled on Project
                      </span>
                    ) : customerQrIntercomChoice === false ? (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Not Selected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Confirmation Needed
                      </span>
                    )}
                  </div>

                  {/* If not checked on project, ask customer Yes/No */}
                  {!pmCheckedQrIntercom && (
                    <div className="p-3.5 bg-white rounded-xl border border-indigo-200 space-y-2.5">
                      <p className="text-xs font-bold text-slate-800">
                        Is <span className="text-indigo-700">{project.propertyName}</span> using the QR Intercom feature?
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Selecting &ldquo;Yes&rdquo; will immediately enable QR Intercom on your project record and allow you to upload your property logo.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCustomerConfirmQrIntercom(true)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            customerQrIntercomChoice === true
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-300'
                          }`}
                        >
                          Yes, We Are Using QR Intercom
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCustomerConfirmQrIntercom(false)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            customerQrIntercomChoice === false
                              ? 'bg-slate-800 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Box when QR Intercom is enabled */}
                  {(pmCheckedQrIntercom || customerQrIntercomChoice === true) && (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Upload Property Logo / Image for QR Intercom
                        </span>
                        {qrIntercomLogoName && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                          </span>
                        )}
                      </div>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 rounded-xl p-4 cursor-pointer transition-colors">
                        <Upload className="w-5 h-5 text-indigo-600 mb-1.5" />
                        <span className="text-xs font-bold text-indigo-900">
                          {qrIntercomLogoName ? `Replace Logo (${qrIntercomLogoName})` : 'Click to upload Logo / Image (PNG, JPG, SVG)'}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Displayed at main entry & amenity QR Intercom directory kiosks
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrLogoUpload}
                          className="hidden"
                        />
                      </label>
                      {qrIntercomLogoDataUrl && (
                        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <img
                            src={qrIntercomLogoDataUrl}
                            alt="QR Intercom Logo Preview"
                            className="w-12 h-12 object-contain rounded-lg bg-white border border-slate-200 p-1"
                          />
                          <div className="text-xs">
                            <div className="font-bold text-slate-800">{qrIntercomLogoName}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold">
                              Synced to Project QR Intercom Configuration
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. NFC Wallet Upgrade Property Photo Card Art */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">NFC Wallet Upgrade Card Art</h4>
                        <p className="text-[11px] text-slate-500">
                          Property photo displayed on resident Apple Wallet & Google Wallet NFC key passes
                        </p>
                      </div>
                    </div>
                    {customerNfcWalletChoice === true ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                        Enabled on Project
                      </span>
                    ) : customerNfcWalletChoice === false ? (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Not Selected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
                        Confirmation Needed
                      </span>
                    )}
                  </div>

                  {/* If not checked on project, ask customer Yes/No */}
                  {!pmCheckedNfcWallet && (
                    <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-2.5">
                      <p className="text-xs font-bold text-slate-800">
                        Is <span className="text-emerald-700">{project.propertyName}</span> using the NFC Wallet Upgrade feature?
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Selecting &ldquo;Yes&rdquo; will immediately enable NFC Wallet Upgrade on your project record and allow you to upload your property photo for the digital key card art.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCustomerConfirmNfcWallet(true)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            customerNfcWalletChoice === true
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-300'
                          }`}
                        >
                          Yes, We Are Using NFC Wallet Upgrade
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCustomerConfirmNfcWallet(false)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            customerNfcWalletChoice === false
                              ? 'bg-slate-800 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Box when NFC Wallet is enabled */}
                  {(pmCheckedNfcWallet || customerNfcWalletChoice === true) && (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Upload Property Photo for NFC Wallet Card Art
                        </span>
                        {nfcCardArtPhotoName && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                          </span>
                        )}
                      </div>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 rounded-xl p-4 cursor-pointer transition-colors">
                        <ImageIcon className="w-5 h-5 text-emerald-600 mb-1.5" />
                        <span className="text-xs font-bold text-emerald-900">
                          {nfcCardArtPhotoName ? `Replace Photo (${nfcCardArtPhotoName})` : 'Click to upload Property Photo for Card Art (JPG, PNG)'}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Displayed on resident Apple Wallet & Google Wallet tap-to-unlock passes
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNfcPhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {nfcCardArtPhotoDataUrl && (
                        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <img
                            src={nfcCardArtPhotoDataUrl}
                            alt="NFC Wallet Card Art Preview"
                            className="w-16 h-10 object-cover rounded-lg bg-slate-900 border border-slate-300"
                          />
                          <div className="text-xs">
                            <div className="font-bold text-slate-800">{nfcCardArtPhotoName}</div>
                            <div className="text-[10px] text-emerald-700 font-semibold">
                              Synced to NFC Wallet Card Art Pass Preview
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CONDITIONAL: SITE MAPS GATEWAY LOCATION CONFIRMATION (ONLY IF GATEWAY/HUB ON BOM) */}
          {/* ========================================================================= */}
          {hasGatewayOrHubOnBOM && (
            <div className="pt-6 border-t border-slate-200">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-sky-50 border-2 border-amber-300/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
                        Gateway / Hub Detected on BOM • Action Required
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                        Site Maps Gateway Location Confirmation
                      </h3>
                    </div>
                  </div>
                  {sitePlanPdfName && sitePlanConfirmedEdited && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      Site Plan PDF Verified
                    </span>
                  )}
                </div>

                {/* Friendly Message to Customer */}
                <div className="p-4 bg-white/90 rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 mb-1">
                      Friendly Reminder Before Uploading Your Property Site Plans:
                    </p>
                    <p>
                      Because your Smart Community Bill of Materials includes LoRaWAN Gateways / Network Hubs, our engineering team needs your property site map to finalize RF coverage. <strong>Please confirm that you have edited or marked up the PDF documents you are uploading to clearly reflect the exact locations of the gateways needing to be installed on your site.</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* PDF Upload Input */}
                  <div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-sky-400 hover:border-sky-600 bg-white rounded-xl p-5 cursor-pointer transition-colors">
                      <FileText className="w-6 h-6 text-sky-600 mb-1.5" />
                      <span className="text-xs font-bold text-slate-900 text-center">
                        {sitePlanPdfName
                          ? `Uploaded PDF: ${sitePlanPdfName} (Click to Replace)`
                          : 'Upload Site Plan PDF with Gateway Locations (.PDF)'}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">
                        Accepts PDF architectural site maps & annotated property floorplans
                      </span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleSitePlanPdfUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sitePlanConfirmedEdited}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSitePlanConfirmedEdited(checked);
                          persistExtendedIntake({ sitePlanConfirmedEdited: checked });
                        }}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                        I confirm that we have edited and annotated the uploaded Site Plan PDF document(s) to reflect the exact locations of the gateways needing to be installed on our site.
                      </span>
                    </label>
                    {sitePlanPdfName && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="font-mono truncate max-w-[220px]">{sitePlanPdfName}</span>
                        <span className="text-emerald-700 font-bold">Uploaded {sitePlanUploadedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'walkthrough' && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Staff</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(6)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
              >
                <span>Continue: Milestones</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: DEPLOYMENT PROCESS OVERVIEW (Slide 7 with "YOU ARE HERE" pin) */}
      {/* Requirement: "add a fun 'you are here' icon typically found on maps on the */}
      {/* step they are currently on which will be based on current milestone"      */}
      {/* ========================================================================= */}
      {(viewMode === 'full-document' || activeStep === 6) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
              Operations Milestones
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-2">
              Deployment Process Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Follow your rollout across the 7 operations milestones from kickoff orientation through final project closing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-4">
            {standardMilestones.map((milestone, idx) => {
              const isCompleted = milestone.status === 'Completed';
              const isInProgress = milestone.status === 'In Progress';
              const isCurrentActiveStep = idx === currentMilestoneIndex;

              return (
                <div
                  key={milestone.title}
                  className={`p-4 rounded-xl border flex flex-col justify-between relative transition-all ${
                    isCurrentActiveStep
                      ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400 shadow-md transform sm:-translate-y-1'
                      : isCompleted
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : isInProgress
                      ? 'bg-sky-50 border-sky-300 text-sky-950'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {/* Fun "YOU ARE HERE" Map Icon Badge */}
                  {isCurrentActiveStep && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce z-20 whitespace-nowrap border-2 border-white">
                      <span>📍</span>
                      <span>YOU ARE HERE</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-6 h-6 rounded-full font-extrabold flex items-center justify-center text-xs ${
                        isCurrentActiveStep
                          ? 'bg-rose-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isCurrentActiveStep
                          ? 'bg-white text-rose-800 border-rose-200'
                          : isCompleted
                          ? 'bg-white text-emerald-800 border-emerald-200'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm mb-1">{milestone.title}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{milestone.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 font-mono text-[11px] text-slate-500">
                    Target: <strong className="text-slate-800">{milestone.target}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {viewMode === 'walkthrough' && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep(5)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Hardware</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(7)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
              >
                <span>Continue: Resident Kit & Submit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: RESIDENT KIT & SUBMIT INFORMATION (Slide 8 Enhanced)           */}
      {/* Requirement: Blue banner for email updates (weekly/biweekly),             */}
      {/* submit button reassuring contact soon, and download copy of kickoff doc!  */}
      {/* ========================================================================= */}
      {(viewMode === 'full-document' || activeStep === 7) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
              Turnkey Resident Adoption
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] mt-2">
              Resident Communication & Onboarding Kit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ready-to-use digital templates and print guides delivered to your on-site management team.
            </p>
          </div>

          {/* Featured Resident Onboarding Email Layout Template Card */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 via-white to-sky-50 border-2 border-emerald-300 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  Ready-to-Send Google Email Layout Template
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  <a
                    href="https://docs.google.com/email-layouts/d/1BSKZsB_enu8fZRPO8Prf6ueTt_B2gliWiQ-SwpJFbPg/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-700 underline decoration-emerald-400 underline-offset-4 inline-flex items-center gap-1.5"
                  >
                    <span>Resident Onboarding</span>
                    <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
                  </a>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  An official Quext email template you can insert directly into your emails to easily send onboarding instructions and smart home setup steps to your residents.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href="https://docs.google.com/email-layouts/d/1BSKZsB_enu8fZRPO8Prf6ueTt_B2gliWiQ-SwpJFbPg/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Resident Onboarding</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <span>Automated Email Templates</span>
                </span>
                <a
                  href="https://docs.google.com/email-layouts/d/1BSKZsB_enu8fZRPO8Prf6ueTt_B2gliWiQ-SwpJFbPg/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-sky-700 hover:text-sky-900 underline inline-flex items-center gap-1"
                >
                  <span>Resident Onboarding</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li>
                  •{' '}
                  <a
                    href="https://docs.google.com/email-layouts/d/1BSKZsB_enu8fZRPO8Prf6ueTt_B2gliWiQ-SwpJFbPg/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sky-700 hover:text-sky-900 underline"
                  >
                    Resident Onboarding
                  </a>{' '}
                  — Insertable email template to easily send to residents
                </li>
                <li>• 7-Day Advance Product Notice (Scheduled date window)</li>
                <li>• Quext Mobile App Download badge for iOS & Android</li>
                <li>• Password Creation & Apple Wallet digital key generation</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Print Materials & Welcome Collateral</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li>• Printable Quick Start Guide for your team</li>
                <li>• Custom NFC door hangers with property branding</li>
                <li>• Emergency maintenance master protocol sheet</li>
              </ul>
            </div>
          </div>

          {/* Requirement: Blue Banner Message at Bottom for Email Updates on Weekly or Biweekly Basis */}
          <div className="p-5 bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 text-white rounded-2xl shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm sm:text-base font-bold font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-200" />
                  <span>Receive Automated Deployment Process Overview Updates</span>
                </div>
                <p className="text-xs text-sky-100 mt-0.5">
                  Provide your email address to receive regular deployment progress reports with your &quot;YOU ARE HERE&quot; milestone status directly from the Project Manager.
                </p>
              </div>

              {isSubscribed && (
                <div className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-bold shrink-0 animate-fadeIn flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed to {emailUpdateCadence} updates!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubscribeUpdates} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <input
                type="email"
                required
                value={residentEmailForUpdates}
                onChange={(e) => setResidentEmailForUpdates(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-3.5 py-2 rounded-lg bg-white/95 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-white placeholder-slate-400 font-medium"
              />

              {/* Weekly or Biweekly Cadence Buttons */}
              <div className="inline-flex rounded-lg bg-white/15 p-0.5 border border-white/20 shrink-0 text-xs">
                <button
                  type="button"
                  onClick={() => setEmailUpdateCadence('weekly')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                    emailUpdateCadence === 'weekly' ? 'bg-white text-sky-900 shadow-xs' : 'text-sky-100 hover:text-white'
                  }`}
                >
                  Weekly Cadence
                </button>
                <button
                  type="button"
                  onClick={() => setEmailUpdateCadence('biweekly')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                    emailUpdateCadence === 'biweekly' ? 'bg-white text-sky-900 shadow-xs' : 'text-sky-100 hover:text-white'
                  }`}
                >
                  Bi-Weekly Cadence
                </button>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-white hover:bg-slate-100 text-sky-900 font-bold rounded-lg text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Subscribe for Updates
              </button>
            </form>
          </div>

          {/* Submission and Download Banner */}
          {isWalkthroughSubmitted ? (
            <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-950 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">
                    Kickoff Information Submitted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                    Thank you! All configuration details for <strong>{project.propertyName}</strong> have been received. We will be in touch soon with your staging schedule and hardware arrival dates.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-200">
                <button
                  type="button"
                  onClick={handleDownloadSummary}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Copy of Kickoff Document</span>
                </button>
                <span className="text-xs text-emerald-800">
                  Submission Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  Ready to finalize your kickoff submission?
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Confirm your door names, staff roster, and PMS setup. Your dedicated PM will follow up with next steps.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadSummary}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Records</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitWalkthrough}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>Submit Kickoff Information</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {viewMode === 'walkthrough' && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveStep(6)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: Milestones</span>
              </button>
              {!isStandaloneClientView && onBackToTechnicalBOM && (
                <button
                  type="button"
                  onClick={onBackToTechnicalBOM}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-xs"
                >
                  <span>Return to Field BOM Table</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
