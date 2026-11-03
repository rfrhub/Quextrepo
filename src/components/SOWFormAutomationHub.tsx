import React, { useState, useEffect, useMemo, useRef } from 'react';
import { OperationProject, isDiyPartner } from '../types';
import { IntegratorPartnerSelector } from './IntegratorPartnerSelector';
import { GoogleFormSubmission, FieldTechContact } from '../types/sowForm';
import {
  loadSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  DEFAULT_FIELD_TECHS,
  dispatchSowEmailToTech,
  buildPartnerVendorPlainTextEmail,
} from '../services/sowFormService';
import { downloadSowPdf } from '../utils/generateSowPdf';
import {
  FileText,
  Send,
  Download,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  Check,
  Mail,
  FileCheck,
  UserCheck,
  MapPin,
  Calendar,
  Truck,
  X,
  Building2,
  Wrench,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Pencil,
  Edit3,
} from 'lucide-react';

interface SOWFormAutomationHubProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProject?: (projectId: string) => void;
  properties?: OperationProject[];
  initialProperty?: OperationProject | null;
  initialEditingSowId?: string | null;
  currentUserName?: string;
  onUpdateProperty?: (property: OperationProject) => void;
}

export const SOWFormAutomationHub: React.FC<SOWFormAutomationHubProps> = ({
  isOpen,
  onClose,
  properties = [],
  initialProperty = null,
  initialEditingSowId = null,
  currentUserName = 'Quext Customer Success',
  onUpdateProperty,
}) => {
  const [submissions, setSubmissions] = useState<GoogleFormSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'submissions'>('create');
  const [selectedSubForPreview, setSelectedSubForPreview] = useState<GoogleFormSubmission | null>(
    null
  );
  const [selectedSubForDispatch, setSelectedSubForDispatch] = useState<GoogleFormSubmission | null>(
    null
  );

  // Partner Integrator / Vendor / Tech Dispatch state
  const [selectedTech, setSelectedTech] = useState<FieldTechContact>(DEFAULT_FIELD_TECHS[0]);
  const [customRecipientName, setCustomRecipientName] = useState<string>(
    DEFAULT_FIELD_TECHS[0].name
  );
  const [customTechEmail, setCustomTechEmail] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBodyText, setEmailBodyText] = useState<string>('');
  const [copiedEmailBody, setCopiedEmailBody] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // =========================================================================
  // 23-Question "Onsite Visit Scheduling and SOW Information Form" State
  // (Clean slate by default — no fake data; can prefill from selected Property)
  // =========================================================================
  const todayIso = new Date().toISOString().split('T')[0];

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [isPropertyPickerOpen, setIsPropertyPickerOpen] = useState<boolean>(false);
  const [propertySearchQuery, setPropertySearchQuery] = useState<string>('');
  const propertyPickerRef = useRef<HTMLDivElement>(null);
  const propertySearchInputRef = useRef<HTMLInputElement>(null);

  const selectedProperty = useMemo(() => {
    return properties.find((p) => p.id === selectedPropertyId) || null;
  }, [properties, selectedPropertyId]);

  const filteredProperties = useMemo(() => {
    const q = propertySearchQuery.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter((p) => {
      const name = (p.propertyName || '').toLowerCase();
      const city = (p.city || '').toLowerCase();
      const state = (p.state || '').toLowerCase();
      const client = (p.clientName || '').toLowerCase();
      const quote = (p.quoteNumber || '').toLowerCase();
      return (
        name.includes(q) ||
        city.includes(q) ||
        state.includes(q) ||
        client.includes(q) ||
        quote.includes(q)
      );
    });
  }, [properties, propertySearchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (propertyPickerRef.current && !propertyPickerRef.current.contains(e.target as Node)) {
        setIsPropertyPickerOpen(false);
      }
    };
    if (isPropertyPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPropertyPickerOpen]);

  useEffect(() => {
    if (isPropertyPickerOpen) {
      setTimeout(() => {
        propertySearchInputRef.current?.focus();
      }, 50);
    } else {
      setPropertySearchQuery('');
    }
  }, [isPropertyPickerOpen]);
  // Q1 - Q4: Site & Scheduling
  const [q1CommunityName, setQ1CommunityName] = useState<string>('');
  const [q2WorkSiteAddress, setQ2WorkSiteAddress] = useState<string>('');
  const [q3DatePrepared, setQ3DatePrepared] = useState<string>(todayIso);
  const [q4InstallDate, setQ4InstallDate] = useState<string>('');
  const [integratorPartners, setIntegratorPartners] = useState<string[]>([]);

  // Q5 - Q9: Point of Contact (POC)
  const [q5PocName, setQ5PocName] = useState<string>('');
  const [q6PocTitle, setQ6PocTitle] = useState<string>('');
  const [q7PocPhone, setQ7PocPhone] = useState<string>('');
  const [q8PocEmail, setQ8PocEmail] = useState<string>('');
  const [q9AlternateContact, setQ9AlternateContact] = useState<string>('');

  // Q10 - Q17: Device Names & Issue Descriptions
  const [q10UnitLocksIssue, setQ10UnitLocksIssue] = useState<string>('');
  const [q11AccessControlIssue, setQ11AccessControlIssue] = useState<string>('');
  const [q12CamerasIssue, setQ12CamerasIssue] = useState<string>('');
  const [q13ResidentWifiIssue, setQ13ResidentWifiIssue] = useState<string>('');
  const [q14CommunityWifiIssue, setQ14CommunityWifiIssue] = useState<string>('');
  const [q15StaffWifiIssue, setQ15StaffWifiIssue] = useState<string>('');
  const [q16ThermostatsIssue, setQ16ThermostatsIssue] = useState<string>('');
  const [q17LeakSensorsIssue, setQ17LeakSensorsIssue] = useState<string>('');

  // Q18: Equipment Shipping Determination
  const [q18NeedsShipping, setQ18NeedsShipping] = useState<'Yes' | 'No'>('No');

  // Q19 - Q23: Equipment to be Shipped
  const [q19EquipmentQtyAndLocation, setQ19EquipmentQtyAndLocation] = useState<string>('');
  const [q20ShippingRecipient, setQ20ShippingRecipient] = useState<string>('');
  const [q21ShippingPhone, setQ21ShippingPhone] = useState<string>('');
  const [q22ShippingEmail, setQ22ShippingEmail] = useState<string>('');
  const [q23ShippingMethod, setQ23ShippingMethod] = useState<'Ground' | '2 Day' | 'Overnight'>(
    'Ground'
  );

  // Populate form from a Property when selected
  const applyPropertyToForm = (prop: OperationProject | null) => {
    if (!prop) {
      setSelectedPropertyId('');
      setQ1CommunityName('');
      setQ2WorkSiteAddress('');
      setQ3DatePrepared(todayIso);
      setQ4InstallDate('');
      setIntegratorPartners([]);
      setQ5PocName('');
      setQ6PocTitle('');
      setQ7PocPhone('');
      setQ8PocEmail('');
      setQ9AlternateContact('');
      return;
    }

    setSelectedPropertyId(prop.id);
    setQ1CommunityName(prop.propertyName || '');
    const fullAddr = [prop.address, prop.city, prop.state].filter(Boolean).join(', ');
    setQ2WorkSiteAddress(fullAddr);
    setQ3DatePrepared(todayIso);
    setIntegratorPartners(prop.integratorPartners ? [...prop.integratorPartners] : []);

    const intake = prop.customerIntake;
    const primaryStaff = intake?.staffRoles?.[0];
    const secondStaff = intake?.staffRoles?.[1];

    const pocName =
      (intake as any)?.communityContactName ||
      (prop.communityDetails as any)?.siteContactName ||
      intake?.submittedBy ||
      (primaryStaff ? `${primaryStaff.firstName} ${primaryStaff.lastName}`.trim() : '') ||
      '';
    const pocTitle =
      primaryStaff?.roleOrTitle ||
      (intake as any)?.primaryKickoffPosition ||
      (pocName ? 'Community Site Contact' : '');
    const pocPhone =
      (intake as any)?.communityContactPhone ||
      intake?.sitePhoneNumber ||
      (prop.communityDetails as any)?.siteContactPhone ||
      primaryStaff?.phoneNumber ||
      '';
    const pocEmail =
      intake?.communityEmail ||
      (intake as any)?.communityContactEmail ||
      intake?.subscriberEmail ||
      (prop.communityDetails as any)?.siteContactEmail ||
      primaryStaff?.email ||
      '';
    const altContact = secondStaff
      ? `${secondStaff.firstName} ${secondStaff.lastName} (${secondStaff.roleOrTitle || 'Staff'}) ${
          secondStaff.phoneNumber || secondStaff.email || ''
        }`.trim()
      : '';

    setQ5PocName(pocName);
    setQ6PocTitle(pocTitle);
    setQ7PocPhone(pocPhone);
    setQ8PocEmail(pocEmail);
    setQ9AlternateContact(altContact);

    // Also pre-select the property's first Integrator Partner if present
    if (prop.integratorPartners && prop.integratorPartners.length > 0) {
      const partnerName = prop.integratorPartners[0];
      const matched = DEFAULT_FIELD_TECHS.find((t) =>
        t.name.toLowerCase().includes(partnerName.toLowerCase())
      );
      if (matched) {
        setSelectedTech(matched);
        setCustomRecipientName(matched.name);
        setCustomTechEmail(matched.email || '');
      } else {
        setCustomRecipientName(`${partnerName} (Partner Integrator)`);
      }
    }
  };

  const [editingSowId, setEditingSowId] = useState<string | null>(null);

  const editingSub = useMemo(() => {
    if (!editingSowId) return null;
    return submissions.find((s) => s.id === editingSowId) || null;
  }, [editingSowId, submissions]);

  const startEditingSow = (sub: GoogleFormSubmission) => {
    setEditingSowId(sub.id);
    setQ1CommunityName(sub.communityName || '');
    setQ2WorkSiteAddress(sub.workSiteAddress || '');
    setQ3DatePrepared(sub.datePrepared || todayIso);
    setQ4InstallDate(sub.installDate || '');
    setIntegratorPartners(sub.integratorPartners ? [...sub.integratorPartners] : []);
    setQ5PocName(sub.pocName || '');
    setQ6PocTitle(sub.pocTitle || '');
    setQ7PocPhone(sub.pocPhone || '');
    setQ8PocEmail(sub.pocEmail || '');
    setQ9AlternateContact(sub.alternateContact || '');
    setQ10UnitLocksIssue(sub.unitLocksIssue || '');
    setQ11AccessControlIssue(sub.accessControlIssue || '');
    setQ12CamerasIssue(sub.camerasIssue || '');
    setQ13ResidentWifiIssue(sub.residentWifiIssue || '');
    setQ14CommunityWifiIssue(sub.communityWifiIssue || '');
    setQ15StaffWifiIssue(sub.staffWifiIssue || '');
    setQ16ThermostatsIssue(sub.thermostatsIssue || '');
    setQ17LeakSensorsIssue(sub.leakSensorsIssue || '');
    setQ18NeedsShipping(sub.equipmentNeedsShipping === 'Yes' ? 'Yes' : 'No');
    setQ19EquipmentQtyAndLocation(sub.equipmentQuantityAndLocation || sub.equipmentToShip || '');
    setQ20ShippingRecipient(sub.shippingRecipient || '');
    setQ21ShippingPhone(sub.shippingPhone || '');
    setQ22ShippingEmail(sub.shippingEmail || '');
    setQ23ShippingMethod((sub.shippingMethod as any) || 'Ground');

    if (sub.propertyId) {
      setSelectedPropertyId(sub.propertyId);
    } else {
      const matched = properties.find(
        (p) => (p.propertyName || '').trim().toLowerCase() === (sub.communityName || '').trim().toLowerCase()
      );
      if (matched) {
        setSelectedPropertyId(matched.id);
      }
    }

    if (sub.integratorPartners && sub.integratorPartners.length > 0) {
      const partnerName = sub.integratorPartners[0];
      const matched = DEFAULT_FIELD_TECHS.find((t) =>
        t.name.toLowerCase().includes(partnerName.toLowerCase())
      );
      if (matched) {
        setSelectedTech(matched);
        setCustomRecipientName(matched.name);
        if (matched.email) setCustomTechEmail(matched.email);
      } else {
        setCustomRecipientName(`${partnerName} (Partner Integrator)`);
      }
    }

    setActiveTab('create');
  };

  const cancelEditingSow = () => {
    setEditingSowId(null);
    if (initialProperty) {
      applyPropertyToForm(initialProperty);
    } else {
      applyPropertyToForm(null);
      resetIssueFields();
    }
  };

  useEffect(() => {
    if (isOpen) {
      const all = loadSubmissions();
      setSubmissions(all);
      setActiveTab('create');
      if (initialEditingSowId) {
        const target = all.find((s) => s.id === initialEditingSowId);
        if (target) {
          startEditingSow(target);
          return;
        }
      }
      if (initialProperty) {
        applyPropertyToForm(initialProperty);
      } else {
        setEditingSowId(null);
      }
    } else {
      setEditingSowId(null);
    }
  }, [isOpen, initialEditingSowId, initialProperty]);

  const refreshSubmissions = () => {
    const local = loadSubmissions();
    setSubmissions(local);
  };

  useEffect(() => {
    const handleUpdate = () => refreshSubmissions();
    window.addEventListener('quext_sow_submissions_updated', handleUpdate);
    return () => window.removeEventListener('quext_sow_submissions_updated', handleUpdate);
  }, []);

  // Keep email subject & body synced when dispatching a submission
  useEffect(() => {
    if (!selectedSubForDispatch) return;
    const built = buildPartnerVendorPlainTextEmail(
      selectedSubForDispatch,
      customRecipientName || selectedTech.name,
      customNotes
    );
    setEmailSubject(built.subject);
    setEmailBodyText(built.body);
  }, [selectedSubForDispatch, customRecipientName, selectedTech, customNotes]);

  // When opening a submission for dispatch, initialize recipient details from its assigned Integrator Partners
  useEffect(() => {
    if (!selectedSubForDispatch) return;
    const partners = selectedSubForDispatch.integratorPartners || [];
    if (partners.length > 0) {
      const partnerName = partners[0];
      const matched = DEFAULT_FIELD_TECHS.find((t) =>
        t.name.toLowerCase().includes(partnerName.toLowerCase())
      );
      if (matched) {
        setSelectedTech(matched);
        setCustomRecipientName(matched.name);
        if (matched.email) setCustomTechEmail(matched.email);
      } else {
        setCustomRecipientName(`${partnerName} (Partner Integrator)`);
      }
    }
  }, [selectedSubForDispatch?.id]);

  const resetIssueFields = () => {
    setQ10UnitLocksIssue('');
    setQ11AccessControlIssue('');
    setQ12CamerasIssue('');
    setQ13ResidentWifiIssue('');
    setQ14CommunityWifiIssue('');
    setQ15StaffWifiIssue('');
    setQ16ThermostatsIssue('');
    setQ17LeakSensorsIssue('');
    setQ18NeedsShipping('No');
    setQ19EquipmentQtyAndLocation('');
    setQ20ShippingRecipient('');
    setQ21ShippingPhone('');
    setQ22ShippingEmail('');
    setQ23ShippingMethod('Ground');
  };

  const handleCreateSowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1CommunityName.trim()) return;

    if (editingSowId) {
      const updated = updateSubmission(editingSowId, {
        communityName: q1CommunityName.trim(),
        workSiteAddress: q2WorkSiteAddress.trim() || 'Address on file',
        datePrepared: q3DatePrepared || todayIso,
        installDate: q4InstallDate || 'TBD',
        integratorPartners: integratorPartners.length > 0 ? integratorPartners : undefined,
        propertyId: selectedPropertyId || undefined,
        pocName: q5PocName.trim() || 'Site POC',
        pocTitle: q6PocTitle.trim() || 'Community Contact',
        pocPhone: q7PocPhone.trim() || '—',
        pocEmail: q8PocEmail.trim() || '—',
        alternateContact: q9AlternateContact.trim(),
        unitLocksIssue: q10UnitLocksIssue.trim(),
        accessControlIssue: q11AccessControlIssue.trim(),
        camerasIssue: q12CamerasIssue.trim(),
        residentWifiIssue: q13ResidentWifiIssue.trim(),
        communityWifiIssue: q14CommunityWifiIssue.trim(),
        staffWifiIssue: q15StaffWifiIssue.trim(),
        thermostatsIssue: q16ThermostatsIssue.trim(),
        leakSensorsIssue: q17LeakSensorsIssue.trim(),
        equipmentNeedsShipping: q18NeedsShipping,
        equipmentToShip: q18NeedsShipping === 'Yes' ? q19EquipmentQtyAndLocation.trim() : '',
        equipmentQuantityAndLocation:
          q18NeedsShipping === 'Yes' ? q19EquipmentQtyAndLocation.trim() : '',
        shippingRecipient:
          q18NeedsShipping === 'Yes'
            ? q20ShippingRecipient.trim() || q5PocName.trim()
            : '',
        shippingPhone:
          q18NeedsShipping === 'Yes'
            ? q21ShippingPhone.trim() || q7PocPhone.trim()
            : '',
        shippingEmail:
          q18NeedsShipping === 'Yes'
            ? q22ShippingEmail.trim() || q8PocEmail.trim()
            : '',
        shippingMethod: q18NeedsShipping === 'Yes' ? q23ShippingMethod : 'Ground',
      });

      if (updated) {
        // Save/Sync directly to Property
        const targetProp =
          selectedProperty ||
          properties.find(
            (p) =>
              p.id === updated.propertyId ||
              (p.propertyName || '').trim().toLowerCase() === updated.communityName.trim().toLowerCase()
          );
        if (targetProp && onUpdateProperty) {
          const currentSows = targetProp.sowSubmissions ? [...targetProp.sowSubmissions] : [];
          const idx = currentSows.findIndex((s) => s.id === updated.id);
          if (idx >= 0) {
            currentSows[idx] = updated;
          } else {
            currentSows.unshift(updated);
          }
          onUpdateProperty({
            ...targetProp,
            sowSubmissions: currentSows,
            lastUpdated: new Date().toISOString(),
          });
        }

        refreshSubmissions();
        setEditingSowId(null);
        resetIssueFields();
        setDispatchSuccessMsg(null);
        setSelectedSubForDispatch(updated);
      }
    } else {
      const created = addSubmission({
        source: 'simulator',
        preparedBy: currentUserName,
        propertyId: selectedPropertyId || undefined,
        communityName: q1CommunityName.trim(),
        workSiteAddress: q2WorkSiteAddress.trim() || 'Address on file',
        datePrepared: q3DatePrepared || todayIso,
        installDate: q4InstallDate || 'TBD',
        integratorPartners: integratorPartners.length > 0 ? integratorPartners : undefined,
        pocName: q5PocName.trim() || 'Site POC',
        pocTitle: q6PocTitle.trim() || 'Community Contact',
        pocPhone: q7PocPhone.trim() || '—',
        pocEmail: q8PocEmail.trim() || '—',
        alternateContact: q9AlternateContact.trim(),
        unitLocksIssue: q10UnitLocksIssue.trim(),
        accessControlIssue: q11AccessControlIssue.trim(),
        camerasIssue: q12CamerasIssue.trim(),
        residentWifiIssue: q13ResidentWifiIssue.trim(),
        communityWifiIssue: q14CommunityWifiIssue.trim(),
        staffWifiIssue: q15StaffWifiIssue.trim(),
        thermostatsIssue: q16ThermostatsIssue.trim(),
        leakSensorsIssue: q17LeakSensorsIssue.trim(),
        equipmentNeedsShipping: q18NeedsShipping,
        equipmentToShip:
          q18NeedsShipping === 'Yes' ? q19EquipmentQtyAndLocation.trim() : '',
        equipmentQuantityAndLocation:
          q18NeedsShipping === 'Yes' ? q19EquipmentQtyAndLocation.trim() : '',
        shippingRecipient:
          q18NeedsShipping === 'Yes'
            ? q20ShippingRecipient.trim() || q5PocName.trim()
            : '',
        shippingPhone:
          q18NeedsShipping === 'Yes'
            ? q21ShippingPhone.trim() || q7PocPhone.trim()
            : '',
        shippingEmail:
          q18NeedsShipping === 'Yes'
            ? q22ShippingEmail.trim() || q8PocEmail.trim()
            : '',
        shippingMethod: q18NeedsShipping === 'Yes' ? q23ShippingMethod : 'Ground',
      });

      // Save/Sync directly to Property
      const targetProp =
        selectedProperty ||
        properties.find(
          (p) =>
            p.id === created.propertyId ||
            (p.propertyName || '').trim().toLowerCase() === created.communityName.trim().toLowerCase()
        );
      if (targetProp && onUpdateProperty) {
        const currentSows = targetProp.sowSubmissions ? [...targetProp.sowSubmissions] : [];
        currentSows.unshift(created);
        onUpdateProperty({
          ...targetProp,
          sowSubmissions: currentSows,
          lastUpdated: new Date().toISOString(),
        });
      }

      refreshSubmissions();
      resetIssueFields();
      setDispatchSuccessMsg(null);
      // Immediately open the Ready-to-Use SOW & Partner Email modal for the newly created SOW
      setSelectedSubForDispatch(created);
    }
  };

  const handleDispatchPartnersChange = (updatedPartners: string[]) => {
    if (!selectedSubForDispatch) return;
    const updatedSub: GoogleFormSubmission = {
      ...selectedSubForDispatch,
      integratorPartners: updatedPartners,
    };
    updateSubmission(selectedSubForDispatch.id, {
      integratorPartners: updatedPartners,
    });
    setSelectedSubForDispatch(updatedSub);
    refreshSubmissions();

    if (selectedSubForDispatch.propertyId && onUpdateProperty) {
      const targetProp = properties.find((p) => p.id === selectedSubForDispatch.propertyId);
      if (targetProp) {
        onUpdateProperty({
          ...targetProp,
          integratorPartners: updatedPartners,
          isDiyInstallation: updatedPartners.some(isDiyPartner),
          lastUpdated: new Date().toISOString(),
        });
      }
    }

    if (updatedPartners.length > 0) {
      const partnerName = updatedPartners[0];
      const matched = DEFAULT_FIELD_TECHS.find((t) =>
        t.name.toLowerCase().includes(partnerName.toLowerCase())
      );
      if (matched) {
        setSelectedTech(matched);
        setCustomRecipientName(matched.name);
        if (matched.email) setCustomTechEmail(matched.email);
      } else {
        setCustomRecipientName(`${partnerName} (Partner Integrator)`);
      }
    }
  };

  const handleDispatch = async () => {
    if (!selectedSubForDispatch) return;
    setIsDispatching(true);
    setDispatchSuccessMsg(null);

    const techToUse: FieldTechContact = {
      id: selectedTech.id || 'partner-vendor',
      name: customRecipientName.trim() || selectedTech.name || 'Partner Integrator / Vendor',
      email: customTechEmail.trim() || selectedTech.email || '',
      phone: selectedTech.phone || '',
      role: selectedTech.role || 'Partner Integrator / Vendor',
      region: selectedTech.region || 'Onsite',
    };

    try {
      const res = await dispatchSowEmailToTech({
        submissionId: selectedSubForDispatch.id,
        tech: techToUse,
        customNotes,
        customSubject: emailSubject,
      });

      refreshSubmissions();
      setIsDispatching(false);

      if (res.fallback) {
        setDispatchSuccessMsg(
          `Official 2-Page SOW PDF downloaded! You can now attach the PDF and send the ready-to-use email to ${
            techToUse.email || techToUse.name
          }.`
        );
      } else {
        setDispatchSuccessMsg(
          `SOW Work Order and attached 2-page SOW PDF successfully emailed to ${techToUse.name} (${techToUse.email})!`
        );
      }
    } catch (err: any) {
      setIsDispatching(false);
      alert('Error generating/dispatching SOW: ' + err.message);
    }
  };

  const handleCopyEmailBody = () => {
    const fullText = `Subject: ${emailSubject}\n\n${emailBodyText}`;
    navigator.clipboard.writeText(fullText);
    setCopiedEmailBody(true);
    setTimeout(() => setCopiedEmailBody(false), 2500);
  };

  const handleOpenMailClient = () => {
    if (selectedSubForDispatch) {
      downloadSowPdf(selectedSubForDispatch);
    }
    const mailto = `mailto:${encodeURIComponent(customTechEmail.trim())}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBodyText)}`;
    window.open(mailto, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Onsite Visit Scheduling &amp; SOW Creation Hub
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  In-App SOW Generator &amp; Partner Emailer
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Gather site and issue details for technician onsite visits to populate the ready-to-use 2-page SOW PDF &amp; Partner Integrator / Vendor email.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close SOW Hub"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'create'
                  ? editingSowId
                    ? 'border-amber-600 text-amber-900 bg-amber-50/80 shadow-xs'
                    : 'border-teal-600 text-teal-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {editingSowId ? (
                <>
                  <Pencil className="w-4 h-4 text-amber-600" />
                  <span>
                    1. Edit SOW Work Order ({editingSub?.sowReferenceNumber || 'In Progress'})
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>1. Fill Out SOW Information Form (23 Questions)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('submissions')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'submissions'
                  ? 'border-teal-600 text-teal-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              2. Generated SOWs &amp; Partner Dispatch History
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-teal-100 text-teal-800 font-bold">
                {submissions.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={refreshSubmissions}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-200 transition text-slate-700 cursor-pointer"
              title="Refresh generated SOWs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          {/* =================================================================
              TAB 1: FILLABLE 23-QUESTION ONSITE VISIT SCHEDULING & SOW FORM
          ================================================================= */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateSowSubmit} className="max-w-4xl mx-auto space-y-6">
              {/* Editing Mode Alert Banner */}
              {editingSowId && editingSub && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                      <Pencil className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-amber-950 flex items-center gap-2 flex-wrap text-sm">
                        <span>Editing SOW Work Order:</span>
                        <span className="font-mono bg-amber-200/90 text-amber-950 px-2.5 py-0.5 rounded-lg text-xs font-bold border border-amber-300">
                          {editingSub.sowReferenceNumber}
                        </span>
                        <span className="text-amber-800 font-semibold text-xs">
                          • {editingSub.communityName}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Any updates you make will save to this SOW work order and sync directly to the property record.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={cancelEditingSow}
                      className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 font-bold transition cursor-pointer text-xs shadow-2xs"
                    >
                      Cancel Editing / Create New SOW
                    </button>
                  </div>
                </div>
              )}

              {/* Top Form Banner + Optional Property Quick-Fill */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      Customer Success SOW Builder
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      Onsite Visit Scheduling and SOW Information Form
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gather site and issue details for technician onsite visits to populate the SOW and generate a ready-to-send email for your Partner Integrator or Vendor.
                    </p>
                  </div>

                  {properties.length > 0 && (
                    <div
                      ref={propertyPickerRef}
                      className="w-full md:w-80 lg:w-96 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200 relative"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Quick-Fill from Property (Optional)</span>
                        </label>
                        {selectedProperty && (
                          <button
                            type="button"
                            onClick={() => {
                              applyPropertyToForm(null);
                            }}
                            className="text-[10px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            title="Clear property selection and enter manually"
                          >
                            Clear / Manual
                          </button>
                        )}
                      </div>

                      {/* Searchable Picker Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsPropertyPickerOpen((prev) => !prev)}
                        className={`w-full px-3 py-2 rounded-lg border text-left text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isPropertyPickerOpen
                            ? 'border-teal-500 bg-white ring-2 ring-teal-500/15 shadow-xs'
                            : selectedProperty
                            ? 'border-teal-300 bg-teal-50/70 text-slate-900 hover:bg-teal-50'
                            : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {selectedProperty ? (
                            <>
                              <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                              <div className="truncate">
                                <span className="font-extrabold text-slate-900 block truncate">
                                  {selectedProperty.propertyName}
                                </span>
                                <span className="text-[10px] text-slate-500 font-normal block truncate">
                                  {[selectedProperty.city, selectedProperty.state].filter(Boolean).join(', ')}
                                  {selectedProperty.clientName ? ` · ${selectedProperty.clientName}` : ''}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-slate-500 truncate">
                                Search properties to quick-fill ({properties.length})...
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {selectedProperty && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                applyPropertyToForm(null);
                              }}
                              className="p-1 rounded-md hover:bg-teal-200/60 text-teal-700 hover:text-teal-900 cursor-pointer"
                              title="Clear selection"
                            >
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isPropertyPickerOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Searchable Dropdown Popup */}
                      {isPropertyPickerOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-fadeIn">
                          {/* Search Input Filter */}
                          <div className="p-2.5 bg-slate-50 border-b border-slate-200/80">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                              <input
                                ref={propertySearchInputRef}
                                type="text"
                                value={propertySearchQuery}
                                onChange={(e) => setPropertySearchQuery(e.target.value)}
                                placeholder="Type to filter properties by name, city, state..."
                                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                              />
                              {propertySearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setPropertySearchQuery('')}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-700"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Option to clear / enter manually */}
                          <button
                            type="button"
                            onClick={() => {
                              applyPropertyToForm(null);
                              setIsPropertyPickerOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                              !selectedPropertyId ? 'bg-teal-50/70 font-bold text-teal-900' : 'text-slate-600'
                            }`}
                          >
                            <span className="italic">— Enter Manually / No Property Quick-Fill —</span>
                            {!selectedPropertyId && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                          </button>

                          {/* Filtered list of properties */}
                          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                            {filteredProperties.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-500 italic">
                                No properties found matching &quot;{propertySearchQuery}&quot;
                              </div>
                            ) : (
                              filteredProperties.map((p) => {
                                const isSelected = p.id === selectedPropertyId;
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                      applyPropertyToForm(p);
                                      setIsPropertyPickerOpen(false);
                                    }}
                                    className={`w-full px-3 py-2.5 text-left text-xs flex items-center justify-between gap-2 hover:bg-teal-50/50 transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-teal-50 font-bold text-teal-950'
                                        : 'text-slate-800'
                                    }`}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                                        <span>{p.propertyName}</span>
                                        {p.unitsCount ? (
                                          <span className="text-[10px] font-normal font-mono text-slate-400">
                                            ({p.unitsCount} units)
                                          </span>
                                        ) : null}
                                      </div>
                                      <div className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                                        {[p.city, p.state].filter(Boolean).join(', ')}
                                        {p.clientName ? ` · ${p.clientName}` : ''}
                                        {p.quoteNumber ? ` · #${p.quoteNumber}` : ''}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3" />
                                      </span>
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* QUESTIONS 1 - 4: SITE & VISIT SCHEDULING */}
                <div className="space-y-4">
                  <div className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50/70 border border-teal-200/80 px-3 py-1.5 rounded-lg">
                    Part 1 — Site &amp; Visit Scheduling (Questions 1 – 4)
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-800 mb-1">
                        1. Community / Site Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter Community / Property Name"
                        value={q1CommunityName}
                        onChange={(e) => setQ1CommunityName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-teal-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-800 mb-1">
                        2. Work Site Address <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Full street address, city, state, and zip code"
                        value={q2WorkSiteAddress}
                        onChange={(e) => setQ2WorkSiteAddress(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        3. Date Prepared
                      </label>
                      <input
                        type="date"
                        value={q3DatePrepared}
                        onChange={(e) => setQ3DatePrepared(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        4. Install Date
                      </label>
                      <input
                        type="date"
                        value={q4InstallDate}
                        onChange={(e) => setQ4InstallDate(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    {/* Integrator Partner / Installers */}
                    <div className="md:col-span-2 pt-1">
                      <div className="bg-slate-50/90 rounded-xl border border-slate-200 p-3.5 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">
                              Integrator Partner / Installers
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Assign the Official Channel Partner (OCP) or certified installer responsible for this SOW onsite execution.
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <IntegratorPartnerSelector
                            assignedPartners={integratorPartners}
                            projectName={q1CommunityName.trim() || selectedProperty?.propertyName || 'SOW Work Order'}
                            label="Integrator Partner / Installers:"
                            onChange={(updatedPartners) => {
                              setIntegratorPartners(updatedPartners);
                              if (selectedProperty && onUpdateProperty) {
                                onUpdateProperty({
                                  ...selectedProperty,
                                  integratorPartners: updatedPartners,
                                  isDiyInstallation: updatedPartners.some(isDiyPartner),
                                  lastUpdated: new Date().toISOString(),
                                });
                              }
                              if (updatedPartners.length > 0) {
                                const partnerName = updatedPartners[0];
                                const matched = DEFAULT_FIELD_TECHS.find((t) =>
                                  t.name.toLowerCase().includes(partnerName.toLowerCase())
                                );
                                if (matched) {
                                  setSelectedTech(matched);
                                  setCustomRecipientName(matched.name);
                                  if (matched.email) setCustomTechEmail(matched.email);
                                } else {
                                  setCustomRecipientName(`${partnerName} (Partner Integrator)`);
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QUESTIONS 5 - 9: POINT OF CONTACT (POC) */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50/70 border border-teal-200/80 px-3 py-1.5 rounded-lg">
                    Part 2 — Point of Contact (POC) Information (Questions 5 – 9)
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        5. POC Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="On-site Point of Contact full name"
                        value={q5PocName}
                        onChange={(e) => setQ5PocName(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        6. POC Title / Role
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Property Manager, Maintenance Supervisor"
                        value={q6PocTitle}
                        onChange={(e) => setQ6PocTitle(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        7. POC Phone Number <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="(555) 000-0000"
                        value={q7PocPhone}
                        onChange={(e) => setQ7PocPhone(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        8. POC Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="poc@property.com"
                        value={q8PocEmail}
                        onChange={(e) => setQ8PocEmail(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-800 mb-1">
                        9. Alternate Contact
                      </label>
                      <input
                        type="text"
                        placeholder="Secondary site contact name, role, and phone/email (if applicable)"
                        value={q9AlternateContact}
                        onChange={(e) => setQ9AlternateContact(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>
                  </div>
                </div>

                {/* QUESTIONS 10 - 17: DEVICE NAMES & ISSUE DESCRIPTIONS */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50/70 border border-teal-200/80 px-3 py-1.5 rounded-lg">
                    Part 3 — Issue Descriptions &amp; Device Names (Questions 10 – 17)
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-800">
                        10. Unit Locks Issue Description and Device Name
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1">
                        List all the device names with the description of the issue.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="List unit lock device names/unit numbers and issue descriptions..."
                        value={q10UnitLocksIssue}
                        onChange={(e) => setQ10UnitLocksIssue(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800">
                        11. Access Control Issue Description and Device Name
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1">
                        List all the device names with the description of the issue.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="List common area / gate access control device names and issue descriptions..."
                        value={q11AccessControlIssue}
                        onChange={(e) => setQ11AccessControlIssue(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800">
                        12. Cameras Issue Description and Device Name
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1">
                        List all the device names with the description of the issue.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="List camera / bridge / CMVR device names and issue descriptions..."
                        value={q12CamerasIssue}
                        onChange={(e) => setQ12CamerasIssue(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800">
                        13. Resident Wifi Issue Description and Device Name
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1">
                        List all the device names with the description of the issue.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="List Resident Wi-Fi access points/switches and issue descriptions..."
                        value={q13ResidentWifiIssue}
                        onChange={(e) => setQ13ResidentWifiIssue(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800">
                        14. Community Wifi Issue Description and Device Name
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1">
                        List all the device names with the description of the issue.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="List Community / Amenity Wi-Fi device names and issue descriptions..."
                        value={q14CommunityWifiIssue}
                        onChange={(e) => setQ14CommunityWifiIssue(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800">
                        15. Staff Wifi Issue Description and Device Name
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1">
                        List all the device names with the description of the issue.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="List Staff / Leasing Office Wi-Fi device names and issue descriptions..."
                        value={q15StaffWifiIssue}
                        onChange={(e) => setQ15StaffWifiIssue(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800">
                        16. Thermostats Issue Description and Device Name
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1">
                        List all the device names with the description of the issue.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="List Thermostat device names / unit numbers and issue descriptions..."
                        value={q16ThermostatsIssue}
                        onChange={(e) => setQ16ThermostatsIssue(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800">
                        17. Leak Sensors Issue Description and Device Name
                      </label>
                      <p className="text-[11px] text-slate-500 mb-1">
                        List all the device names with the description of the issue.
                      </p>
                      <textarea
                        rows={2}
                        placeholder="List Leak Sensor device names / locations and issue descriptions..."
                        value={q17LeakSensorsIssue}
                        onChange={(e) => setQ17LeakSensorsIssue(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                      />
                    </div>
                  </div>
                </div>

                {/* QUESTION 18: WILL ANY EQUIPMENT NEED TO BE SHIPPED? */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50/70 border border-teal-200/80 px-3 py-1.5 rounded-lg">
                    Part 4 — Equipment Shipping &amp; Logistics (Questions 18 – 23)
                  </div>

                  <div className="text-xs space-y-2">
                    <label className="block font-bold text-slate-800">
                      18. Will any equipment need to be shipped based on the issues presented?
                    </label>
                    <p className="text-[11px] text-slate-500 italic">Mark only one oval.</p>
                    <div className="flex items-center gap-4 pt-1">
                      {(['Yes', 'No'] as const).map((opt) => (
                        <label
                          key={opt}
                          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border font-bold cursor-pointer transition-all ${
                            q18NeedsShipping === opt
                              ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-2xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="q18NeedsShipping"
                            value={opt}
                            checked={q18NeedsShipping === opt}
                            onChange={() => setQ18NeedsShipping(opt)}
                            className="accent-teal-600"
                          />
                          <span>{opt}</span>
                          {opt === 'Yes' && (
                            <span className="text-[10px] font-normal text-slate-500">
                              (Proceed to questions 19–23)
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* QUESTIONS 19 - 23: EQUIPMENT TO BE SHIPPED */}
                  {q18NeedsShipping === 'Yes' && (
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-4 text-xs animate-in fade-in duration-150">
                      <div className="font-black text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-amber-600" />
                        Equipment to be shipped (Questions 19 – 23)
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          19. What equipment will be needed, what is the quantity, and at what location will the device be installed?
                        </label>
                        <textarea
                          rows={3}
                          placeholder="e.g., 4x Quext Smart Deadbolts (Units 204, 309, 411, 415); 1x LoRaWAN Gateway (Bldg 2 Roof)..."
                          value={q19EquipmentQtyAndLocation}
                          onChange={(e) => setQ19EquipmentQtyAndLocation(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-300 bg-white rounded-xl text-slate-900 focus:outline-teal-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            20. Shipping Recipient Name (Leave blank if same as site POC)
                          </label>
                          <input
                            type="text"
                            placeholder={q5PocName ? `Same as POC (${q5PocName})` : 'Recipient Name'}
                            value={q20ShippingRecipient}
                            onChange={(e) => setQ20ShippingRecipient(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 bg-white rounded-xl text-slate-900 focus:outline-teal-600"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            21. Shipping Phone Number (Leave blank if same as site POC)
                          </label>
                          <input
                            type="text"
                            placeholder={q7PocPhone ? `Same as POC (${q7PocPhone})` : 'Recipient Phone'}
                            value={q21ShippingPhone}
                            onChange={(e) => setQ21ShippingPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 bg-white rounded-xl text-slate-900 focus:outline-teal-600"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-800 mb-1">
                            22. Shipping Email Address (Leave blank if same as site POC)
                          </label>
                          <input
                            type="email"
                            placeholder={q8PocEmail ? `Same as POC (${q8PocEmail})` : 'Recipient Email'}
                            value={q22ShippingEmail}
                            onChange={(e) => setQ22ShippingEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 bg-white rounded-xl text-slate-900 focus:outline-teal-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          23. Shipping method
                        </label>
                        <p className="text-[11px] text-slate-500 italic mb-2">Mark only one oval.</p>
                        <div className="flex flex-wrap items-center gap-3">
                          {(['Ground', '2 Day', 'Overnight'] as const).map((method) => (
                            <label
                              key={method}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold cursor-pointer transition-all ${
                                q23ShippingMethod === method
                                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="q23ShippingMethod"
                                value={method}
                                checked={q23ShippingMethod === method}
                                onChange={() => setQ23ShippingMethod(method)}
                                className="accent-amber-600"
                              />
                              <span>{method}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Submit Footer */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Submitting immediately generates the <strong>2-Page OneQuext SOW PDF</strong> and opens the <strong>Partner Integrator / Vendor Email Composer</strong>.
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md transition cursor-pointer"
                    >
                      {editingSowId ? (
                        <>
                          <Check className="w-4 h-4" />
                          Save Changes &amp; Update SOW
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Ready-to-Use SOW &amp; Partner Email
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* =================================================================
              TAB 2: GENERATED SOWs & PARTNER DISPATCH HISTORY
          ================================================================= */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Generated SOW Work Orders ({submissions.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Every SOW created from the Onsite Visit Scheduling and SOW Information Form is saved here for instant PDF download or Partner Integrator / Vendor email dispatch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New SOW
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800">No SOWs generated yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                    Fill out the 23-question Onsite Visit Scheduling and SOW Information Form to generate a ready-to-use 2-page SOW PDF and Partner Integrator / Vendor email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Fill Out SOW Form Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {submissions.map((sub) => {
                    const products: string[] = [];
                    if (sub.unitLocksIssue) products.push('Unit Locks');
                    if (sub.accessControlIssue) products.push('Access Control');
                    if (sub.camerasIssue) products.push('Cameras');
                    if (
                      sub.residentWifiIssue ||
                      sub.communityWifiIssue ||
                      sub.staffWifiIssue
                    ) {
                      products.push('Wi-Fi');
                    }
                    if (sub.thermostatsIssue) products.push('Thermostats');
                    if (sub.leakSensorsIssue) products.push('Leak Sensors');

                    return (
                      <div
                        key={sub.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {sub.sowReferenceNumber}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                sub.status === 'sent_to_tech'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-sky-100 text-sky-800 border border-sky-200'
                              }`}
                            >
                              {sub.status === 'sent_to_tech' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Emailed to {sub.assignedTechName || sub.assignedTechEmail}
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-sky-600" />
                                  Ready to Email Partner / Vendor
                                </>
                              )}
                            </span>
                            <span className="text-xs text-slate-400">
                              Created: {new Date(sub.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900">
                            {sub.communityName}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {sub.workSiteAddress}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-700">
                              <Calendar className="w-3.5 h-3.5 text-teal-600" />
                              Install Date: {sub.installDate || 'TBD'}
                            </span>
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                              POC: {sub.pocName} ({sub.pocTitle || 'Site Contact'}) • {sub.pocPhone}
                            </span>
                            {sub.integratorPartners && sub.integratorPartners.length > 0 && (
                              <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                                Integrator: {sub.integratorPartners.join(', ')}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-slate-500">Scope:</span>
                            {products.length > 0 ? (
                              products.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {p}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">
                                General Site Visit
                              </span>
                            )}
                            {sub.equipmentNeedsShipping === 'Yes' && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                Equipment Shipped ({sub.shippingMethod || 'Ground'})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditingSow(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition shadow-xs cursor-pointer"
                            title="Edit this SOW Work Order"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-600" />
                            Edit SOW
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedSubForPreview(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            Preview 2-Page SOW
                          </button>

                          <button
                            type="button"
                            onClick={() => downloadSowPdf(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-teal-600" />
                            Download PDF
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubForDispatch(sub);
                              setDispatchSuccessMsg(null);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-xs transition cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Ready-to-Use Email &amp; SOW
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete SOW "${sub.sowReferenceNumber}" for ${sub.communityName}?`)) {
                                deleteSubmission(sub.id);
                                if (onUpdateProperty) {
                                  const targetProp = properties.find(
                                    (p) =>
                                      p.id === sub.propertyId ||
                                      (p.propertyName || '').trim().toLowerCase() === (sub.communityName || '').trim().toLowerCase()
                                  );
                                  if (targetProp && targetProp.sowSubmissions) {
                                    onUpdateProperty({
                                      ...targetProp,
                                      sowSubmissions: targetProp.sowSubmissions.filter((s) => s.id !== sub.id),
                                      lastUpdated: new Date().toISOString(),
                                    });
                                  }
                                }
                                refreshSubmissions();
                                if (editingSowId === sub.id) {
                                  cancelEditingSow();
                                }
                              }
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete SOW"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Form: <strong>Onsite Visit Scheduling and SOW Information Form (23 Questions)</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* =====================================================================
          READY-TO-USE SOW & PARTNER INTEGRATOR / VENDOR EMAIL MODAL
      ===================================================================== */}
      {selectedSubForDispatch && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Ready-to-Use SOW &amp; Partner Integrator / Vendor Email Dispatch
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedSubForDispatch.communityName} • {selectedSubForDispatch.sowReferenceNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = selectedSubForDispatch;
                    setSelectedSubForDispatch(null);
                    startEditingSow(toEdit);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit SOW
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sub = selectedSubForDispatch;
                    setSelectedSubForDispatch(null);
                    setSelectedSubForPreview(sub);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview 2-Page Formatted SOW
                </button>
                <button
                  type="button"
                  onClick={() => downloadSowPdf(selectedSubForDispatch)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download SOW PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubForDispatch(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {dispatchSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">SOW Ready &amp; Dispatched</h4>
                      <p className="text-xs mt-0.5">{dispatchSuccessMsg}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDispatchSuccessMsg(null)}
                    className="text-emerald-700 hover:text-emerald-950 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Recipient Selection & Partner Assignment Row */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5">
                {/* Integrator Partner / Installers */}
                <div className="p-2.5 border border-slate-300 bg-white rounded-xl flex items-center justify-between flex-wrap gap-2 shadow-2xs">
                  <IntegratorPartnerSelector
                    assignedPartners={selectedSubForDispatch.integratorPartners || []}
                    projectName={selectedSubForDispatch.communityName || 'SOW Work Order'}
                    label="Integrator Partner / Installers:"
                    onChange={handleDispatchPartnersChange}
                  />
                  <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Included in SOW &amp; Work Order
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Partner Integrator / Vendor Name
                    </label>
                    <input
                      type="text"
                      value={customRecipientName}
                      onChange={(e) => setCustomRecipientName(e.target.value)}
                      placeholder="e.g., SKBM / Partner Integrator Team"
                      className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Partner Integrator / Vendor Email Address
                    </label>
                    <input
                      type="email"
                      value={customTechEmail}
                      onChange={(e) => setCustomTechEmail(e.target.value)}
                      placeholder="dispatch@partnerintegrator.com"
                      className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-slate-800 focus:outline-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Additional CSM Instructions / Dispatch Notes (Automatically inserted into SOW Email)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Please check in with the Property Manager at the leasing office 15 minutes prior to starting."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg text-slate-800 focus:outline-teal-600"
                  />
                </div>
              </div>

              {/* Ready-to-Use Email Subject & Full SOW Email Body */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-black text-slate-800 uppercase tracking-wider text-[11px]">
                    Ready-to-Use SOW Email (Editable before sending or copying)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyEmailBody}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 cursor-pointer transition"
                    >
                      {copiedEmailBody ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Copied SOW Email!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          Copy Ready-to-Use SOW Email
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenMailClient}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200 cursor-pointer transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open in Mail App
                    </button>
                  </div>
                </div>

                {/* SOW PDF Attachment Notice */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-950">Attached Technical SOW PDF: </span>
                      <span className="font-mono text-emerald-800 text-[11px]">
                        {`OneQuext_SOW_${selectedSubForDispatch.communityName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${selectedSubForDispatch.installDate || 'Visit'}.pdf`}
                      </span>
                      <span className="text-emerald-700 block sm:inline sm:ml-2 text-[11px]">
                        (Complete 2-page OneQuext technical specifications, hardware, locations &amp; sign-off blocks)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadSowPdf(selectedSubForDispatch)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 transition cursor-pointer text-[11px] shrink-0 ml-2"
                  >
                    <Download className="w-3 h-3 text-emerald-600" />
                    Download Copy
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Email Subject Line:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Cover Message / Email Body (Clean Executive Summary with Attached SOW PDF):
                  </label>
                  <textarea
                    rows={7}
                    value={emailBodyText}
                    onChange={(e) => setEmailBodyText(e.target.value)}
                    className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs leading-relaxed focus:outline-teal-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadSowPdf(selectedSubForDispatch)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-teal-600" />
                    Download 2-Page SOW PDF
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSubForDispatch(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                  <button
                    type="button"
                    onClick={handleDispatch}
                    disabled={isDispatching}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {isDispatching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sending SOW Email &amp; PDF...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Email SOW &amp; 2-Page PDF to Partner / Vendor
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2-PAGE SOW DOCUMENT PREVIEW MODAL */}
      {/* ============================================================ */}
      {selectedSubForPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    OneQuext Scope of Work (SOW) — 2-Page Document Preview
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedSubForPreview.communityName} • Reference:{' '}
                    {selectedSubForPreview.sowReferenceNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = selectedSubForPreview;
                    setSelectedSubForPreview(null);
                    startEditingSow(toEdit);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit SOW
                </button>
                <button
                  type="button"
                  onClick={() => downloadSowPdf(selectedSubForPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const toDispatch = selectedSubForPreview;
                    setSelectedSubForPreview(null);
                    setSelectedSubForDispatch(toDispatch);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Email to Partner / Vendor
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubForPreview(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-200/80 flex flex-col items-center gap-6">
              {/* PAGE 1 PREVIEW */}
              <div
                className="w-full max-w-[680px] bg-white rounded shadow-lg p-10 border border-slate-300 relative text-[11px] leading-normal text-slate-800"
                style={{ minHeight: '880px', fontFamily: 'Arial, sans-serif' }}
              >
                <div className="text-center mb-1">
                  <h1 className="text-xl font-bold text-[#1B365D] tracking-tight m-0">
                    OneQuext SCOPE OF WORK (SOW)
                  </h1>
                  <p className="text-xs italic text-slate-500 mt-1 mb-3">
                    Technical Installation &amp; Site Work Order
                  </p>
                </div>

                <div className="h-[2.5px] bg-[#1B365D] w-full mb-3" />

                <div className="border border-[#BCCADB] mb-4">
                  <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                    <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                      SOW Reference #:
                    </div>
                    <div className="col-span-8 p-1.5 font-mono text-[10px] text-slate-800">
                      {selectedSubForPreview.sowReferenceNumber}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                    <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                      Date Prepared:
                    </div>
                    <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                      {selectedSubForPreview.datePrepared}
                    </div>
                  </div>
                  <div className="grid grid-cols-12">
                    <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                      Prepared By:
                    </div>
                    <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                      {selectedSubForPreview.preparedBy || 'Quext Customer Success'}
                    </div>
                  </div>
                </div>

                {/* SITE & PROJECT IDENTIFICATION */}
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    SITE &amp; PROJECT IDENTIFICATION
                  </div>
                  <div className="border border-[#BCCADB]">
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        1. Community / Site Name:
                      </div>
                      <div className="col-span-8 p-1.5 font-bold text-[10px] text-slate-900">
                        {selectedSubForPreview.communityName}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        2. Work Site Address:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.workSiteAddress}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        4. Install Date:
                      </div>
                      <div className="col-span-8 p-1.5 font-bold text-[10px] text-teal-700">
                        {selectedSubForPreview.installDate || 'TBD'}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        Integrator Partner / Installers:
                      </div>
                      <div className="col-span-8 p-1.5 font-bold text-[10px] text-slate-800">
                        {selectedSubForPreview.integratorPartners && selectedSubForPreview.integratorPartners.length > 0
                          ? selectedSubForPreview.integratorPartners.join(', ')
                          : 'Quext Certified Field Operations'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* POINT OF CONTACT (POC) */}
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    POINT OF CONTACT (POC)
                  </div>
                  <div className="border border-[#BCCADB]">
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        5. POC Name:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800 font-semibold">
                        {selectedSubForPreview.pocName}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        6. POC Title / Role:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.pocTitle || 'Site Contact'}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        7. POC Phone Number:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800 font-medium">
                        {selectedSubForPreview.pocPhone}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        8. POC Email Address:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.pocEmail}
                      </div>
                    </div>
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        9. Alternate Contact:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.alternateContact || 'None provided'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EQUIPMENT OVERVIEW & SCOPE OF WORK */}
                <div className="mb-4">
                  <div className="text-[10.5px] font-bold text-[#1B365D] border-b border-slate-700 pb-0.5 mb-1.5">
                    EQUIPMENT OVERVIEW &amp; SCOPE OF WORK (QUESTIONS 10 – 23)
                  </div>
                  <div className="border border-[#BCCADB]">
                    {selectedSubForPreview.unitLocksIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          10. Unit Locks:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800 whitespace-pre-wrap">
                          {selectedSubForPreview.unitLocksIssue}
                        </div>
                      </div>
                    )}
                    {selectedSubForPreview.accessControlIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          11. Access Control:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800 whitespace-pre-wrap">
                          {selectedSubForPreview.accessControlIssue}
                        </div>
                      </div>
                    )}
                    {selectedSubForPreview.camerasIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          12. Cameras:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800 whitespace-pre-wrap">
                          {selectedSubForPreview.camerasIssue}
                        </div>
                      </div>
                    )}
                    {selectedSubForPreview.residentWifiIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          13. Resident Wi-Fi:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800 whitespace-pre-wrap">
                          {selectedSubForPreview.residentWifiIssue}
                        </div>
                      </div>
                    )}
                    {selectedSubForPreview.communityWifiIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          14. Community Wi-Fi:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800 whitespace-pre-wrap">
                          {selectedSubForPreview.communityWifiIssue}
                        </div>
                      </div>
                    )}
                    {selectedSubForPreview.staffWifiIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          15. Staff Wi-Fi:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800 whitespace-pre-wrap">
                          {selectedSubForPreview.staffWifiIssue}
                        </div>
                      </div>
                    )}
                    {selectedSubForPreview.thermostatsIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          16. Thermostats:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800 whitespace-pre-wrap">
                          {selectedSubForPreview.thermostatsIssue}
                        </div>
                      </div>
                    )}
                    {selectedSubForPreview.leakSensorsIssue && (
                      <div className="grid grid-cols-12 border-b border-[#BCCADB]">
                        <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                          17. Leak Sensors:
                        </div>
                        <div className="col-span-8 p-1.5 text-[10px] text-slate-800 whitespace-pre-wrap">
                          {selectedSubForPreview.leakSensorsIssue}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-12">
                      <div className="col-span-4 bg-[#E0E9F3] p-1.5 font-bold text-[#1B365D] text-[10px] border-r border-[#BCCADB]">
                        18–23. Equipment Shipping:
                      </div>
                      <div className="col-span-8 p-1.5 text-[10px] text-slate-800">
                        {selectedSubForPreview.equipmentNeedsShipping === 'Yes' ? (
                          <div className="space-y-0.5">
                            <div>
                              <strong>Equipment, Qty &amp; Location:</strong>{' '}
                              {selectedSubForPreview.equipmentQuantityAndLocation ||
                                selectedSubForPreview.equipmentToShip ||
                                '—'}
                            </div>
                            <div>
                              <strong>Recipient:</strong>{' '}
                              {selectedSubForPreview.shippingRecipient ||
                                `${selectedSubForPreview.pocName} (Same as POC)`}{' '}
                              • <strong>Phone:</strong>{' '}
                              {selectedSubForPreview.shippingPhone || selectedSubForPreview.pocPhone}{' '}
                              • <strong>Email:</strong>{' '}
                              {selectedSubForPreview.shippingEmail || selectedSubForPreview.pocEmail}
                            </div>
                            <div>
                              <strong>Shipping Method:</strong>{' '}
                              {selectedSubForPreview.shippingMethod || 'Ground'}
                            </div>
                          </div>
                        ) : (
                          <span>No equipment shipment required.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
