import React, { useState, useMemo, useEffect } from 'react';
import {
  OperationProject,
  BOMItem,
  RMAProductCompany,
  RMA_PRODUCT_COMPANIES,
  RMATicketStatus,
  RMATicketRecord,
  matchBomItemToRmaCompany,
  LockFinishConfig,
  isLockBOMItem,
  getLockFinishSummaryTag,
  getLockFinishColorHex,
  formatFullFinishDetailsLines,
} from '../types';
import { LockFinishModal } from './LockFinishModal';
import {
  Wrench,
  Phone,
  Mail,
  FileText,
  Package,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Copy,
  ShieldCheck,
  Truck,
  ClipboardList,
  Hash,
  MapPin,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react';

export interface RMAProcedureStep {
  stepNumber: number;
  title: string;
  bullets: string[];
}

export interface RMACompanyProcedureConfig {
  company: RMAProductCompany;
  badgeColor: string;
  headerBg: string;
  supportPhones: string[];
  supportEmail?: string;
  dealerRequirementNote: string;
  defaultReturnAddress?: string;
  steps: RMAProcedureStep[];
}

export const RMA_COMPANY_PROCEDURES: Record<RMAProductCompany, RMACompanyProcedureConfig> = {
  Allegion: {
    company: 'Allegion',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    headerBg: 'from-orange-950 via-slate-900 to-slate-900',
    supportPhones: ['877-671-7011 (Allegion / Schlage Technical Support)'],
    dealerRequirementNote:
      'Only authorized Allegion dealers can directly submit an RMA. End-users must contact their original place of purchase to request the RMA on their behalf.',
    steps: [
      {
        stepNumber: 1,
        title: 'Contact Tech Support',
        bullets: [
          'Call Allegion/Schlage Technical Support at 877-671-7011 with the product in hand to perform mandatory troubleshooting.',
          'Verify eligibility: Only authorized Allegion dealers can directly submit an RMA. End-users must contact their original place of purchase to request the RMA on their behalf.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Gather Required Documentation',
        bullets: [
          'Service Request (SR) number provided by tech support.',
          'Complete part numbers and quantities.',
          'Serial numbers (mandatory for biometrics and specific electronic components).',
          'Original invoice number or proof of purchase.',
          'Specific, detailed description of the failure.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Obtain the RMA Number',
        bullets: [
          'Upon approval, Allegion will issue an official, unique Return Materials Authorization (RMA) number.',
          'Do not ship any items without this number, and never reuse a past RMA number.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Package and Label the Shipment',
        bullets: [
          'Pack the items securely to prevent transit damage.',
          'Clearly write or print the unique RMA number on the outside of every shipping carton.',
          'Enclose a copy of the official RMA document inside the package. Shipments missing an RMA number or paperwork may be refused and returned freight-collect.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Ship to the Designated Address',
        bullets: [
          'Send the package exclusively to the specific return address provided on your official RMA confirmation sheet.',
        ],
      },
    ],
  },

  'Eagle Eye Networks': {
    company: 'Eagle Eye Networks',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    headerBg: 'from-sky-950 via-slate-900 to-slate-900',
    supportPhones: [
      'US Support: +1-512-473-0501',
      'UK Support: +44 330 808 8034',
      'Europe Support: +31 20 261 0461',
    ],
    supportEmail: 'support@een.com',
    dealerRequirementNote:
      'The RMA process must be initiated by an authorized Eagle Eye Networks Reseller or Partner. End-users must contact their original integrator or installer to submit the request.',
    steps: [
      {
        stepNumber: 1,
        title: 'Contact Technical Support',
        bullets: [
          'Requirement: The RMA process must be initiated by an authorized Eagle Eye Networks Reseller or Partner. End-users must contact their original integrator or installer to submit the request.',
          'Support Channels — Call or email tech support to troubleshoot and verify the hardware failure:',
          'US Support Phone: +1-512-473-0501 | UK Support Phone: +44 330 808 8034 | Europe Support Phone: +31 20 261 0461 | Email Support: support@een.com',
        ],
      },
      {
        stepNumber: 2,
        title: 'Provide Hardware Details',
        bullets: [
          'Eagle Eye Bridge or CMVR Serial Number (ID).',
          'Detailed description of the specific failure or troubleshooting steps already performed.',
          'Customer Account Name and Bridge/CMVR Name in the dashboard.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Handle CMVR Data Retention (If Applicable)',
        bullets: [
          'Important: If you are replacing a Cloud Managed Video Recorder (CMVR) and need to retain local video recordings, do not swap or remove hard drives on your own.',
          'Request explicit guidance: Tech support must authorize and guide you through the chassis-replacement procedure to preserve the data safely.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Select Shipping & Replacement Method',
        bullets: [
          'Standard RMA: Support will issue an RMA number. You must package and ship the defective unit back to Eagle Eye. Once received and inspected at their depot, the replacement unit will be shipped to you.',
          'Rapid Replacement: If the customer has an active Rapid Replacement plan, Eagle Eye will advance-ship the replacement unit first. You must return the defective unit within 30 days using the provided pre-paid shipping label to avoid being charged for the new hardware.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Package and Return Shipment',
        bullets: [
          'Securely pack the defective hardware to prevent damage during transit.',
          'Clearly write or label the official RMA number on the outside of the shipping box.',
          'Ship the package exclusively to the specific regional warehouse address provided in your RMA confirmation email.',
        ],
      },
    ],
  },

  Brivo: {
    company: 'Brivo',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    headerBg: 'from-indigo-950 via-slate-900 to-slate-900',
    supportPhones: [
      'Americas Toll-Free: 1-866-274-8648 or 1-866-692-7486',
      'UK Support: +44 3301 755 904',
      'Europe / EU Support: +31 20 88 80 980',
    ],
    supportEmail: 'support@brivo.com',
    dealerRequirementNote:
      'The RMA process must be initiated by an authorized Brivo distributor, dealer, or certified partner. End-users must contact their original security integrator to file a claim.',
    steps: [
      {
        stepNumber: 1,
        title: 'Contact Technical Support',
        bullets: [
          'Requirement: The RMA process must be initiated by an authorized Brivo distributor, dealer, or certified partner. End-users must contact their original security integrator to file a claim.',
          'Call Brivo Technical Support to troubleshoot the hardware and confirm it is defective:',
          'Americas Toll-Free: 1-866-274-8648 or 1-866-692-7486 | UK: +44 3301 755 904 | Europe/EU: +31 20 88 80 980 | Email: support@brivo.com',
        ],
      },
      {
        stepNumber: 2,
        title: 'Gather Required Information',
        bullets: [
          'Original Purchase Order (PO) or invoice number.',
          'Product model number and unique serial number.',
          'Original installation date.',
          'Specific error logs, defect descriptions, or diagnostic notes.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Determine the Claim Type',
        bullets: [
          'Dead on Arrival (DOA): Valid for products that fail within the first 0–30 days of installation.',
          'Standard Warranty RMA: Applicable for controllers, readers, power supplies, credentials, or video hardware experiencing technical failure under normal use.',
          'Advance Replacement: Available for critical security infrastructure. Brivo will ship a replacement unit before the defective item is returned to minimize system downtime.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Submit the RMA Form and Obtain Authorization',
        bullets: [
          'Fill out the official Brivo RMA form provided by support and email it to support@brivo.com.',
          'Wait for written approval and a unique RMA number. Do not ship any products back to Brivo without this official number.',
        ],
      },
      {
        stepNumber: 5,
        title: 'Package and Ship the Hardware',
        bullets: [
          'Package the defective equipment securely to prevent transit or environmental damage.',
          'Clearly mark or print the issued RMA number on the outside of the shipping box.',
          'Ship the package directly to the designated Brivo service or distribution facility address provided in your RMA confirmation email.',
        ],
      },
    ],
  },

  'ProdataKey (PDK)': {
    company: 'ProdataKey (PDK)',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    headerBg: 'from-rose-950 via-slate-900 to-slate-900',
    supportPhones: [
      'Tech Support: 801-317-8802 (Option 2)',
      'Direct Dealer Line: 801-206-4086',
    ],
    supportEmail: 'support@prodatakey.com',
    dealerRequirementNote:
      'The RMA process must be initiated by an authorized PDK Installation Partner or dealer. You must perform full diagnostics with a support technician before an RMA is issued.',
    defaultReturnAddress:
      'ProdataKey, LLC, 67 West 13490 South, Draper, Utah 84020, United States',
    steps: [
      {
        stepNumber: 1,
        title: 'Contact Technical Support for Troubleshooting',
        bullets: [
          'Requirement: The RMA process must be initiated by an authorized PDK Installation Partner or dealer. End-users must contact their original security integrator to coordinate returns.',
          'Process: You must perform full diagnostics with a support technician before an RMA is issued. PDK will not authorize a return until troubleshooting steps are exhausted.',
          'Technical Support Phone: 801-317-8802 (Option 2) or Direct Dealer Line: 801-206-4086 | Email Support: support@prodatakey.com',
        ],
      },
      {
        stepNumber: 2,
        title: 'Verify Warranty Status and Timeline',
        bullets: [
          'Claim Window: You must claim the hardware failure within 60 days of the defect occurring.',
          'Coverage Period based on partner tier: Standard Accounts (1 Year) | Certified Partners (3 Years) | Gold Partners (4 Years) | Platinum Partners (5 Years).',
        ],
      },
      {
        stepNumber: 3,
        title: 'Choose Your RMA Path',
        bullets: [
          'Advance Shipment RMA: PDK advance-ships the replacement item to minimize downtime. The defective device must be sent back afterward.',
          'Distribution RMA: Coordinated replacement fulfillment through your authorized PDK distribution vendor channel.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Package and Return the Shipment',
        bullets: [
          'Cost: The Installation Partner is responsible for paying shipping fees back to PDK.',
          'Condition Check: Ensure the item has no extra physical damage. If the hardware is returned with unapproved structural damage beyond what was reported to tech support, you will be charged full price for the replacement unit.',
          'Labels and Inclusions: Clearly display the authorized RMA number on the outside of the box and include your proof of original ownership inside.',
          'Shipping Address: ProdataKey, LLC — 67 West 13490 South, Draper, Utah 84020, United States.',
        ],
      },
    ],
  },

  ButterflyMX: {
    company: 'ButterflyMX',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    headerBg: 'from-amber-950 via-slate-900 to-slate-900',
    supportPhones: ['ButterflyMX Technical Support: (800) 398-4416'],
    supportEmail: 'support@butterflymx.com',
    dealerRequirementNote:
      'Contact ButterflyMX Technical Support with the intercom serial number and MAC address while on site to complete remote hardware diagnostics prior to RMA issuance.',
    steps: [
      {
        stepNumber: 1,
        title: 'Contact ButterflyMX Technical Support',
        bullets: [
          'Call ButterflyMX Technical Support at (800) 398-4416 or email support@butterflymx.com to perform mandatory remote diagnostics and verify the hardware defect.',
          'Ensure the intercom/controller is powered and network status is verified with the support engineer.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Gather Required Hardware & Site Details',
        bullets: [
          'Property Name and specific Entry Door / Gate / Lobby location.',
          'ButterflyMX Intercom or Controller Serial Number and MAC Address.',
          'Original Purchase Order (PO) or invoice number.',
          'Detailed description of the hardware failure and diagnostic findings.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Obtain ButterflyMX RMA Authorization',
        bullets: [
          'Upon confirmation of hardware defect, ButterflyMX Support will issue an official RMA Authorization / Case Number.',
          'Do not return any hardware without an issued RMA Authorization Number.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Package and Return the Hardware',
        bullets: [
          'Securely package the defective intercom, keypad, or controller to protect the touchscreen and enclosure during transit.',
          'Clearly write or label the issued RMA Authorization Number on the outside of the shipping box and ship to the return address provided in the ButterflyMX RMA confirmation email.',
        ],
      },
    ],
  },
};

export const RMA_STATUS_STEPS: RMATicketStatus[] = [
  '1. Tech Support Troubleshooting',
  '2. Documentation Gathered',
  '3. RMA Number Issued',
  '4. Packaged & Shipped',
  '5. Replacement Received / Closed',
];

interface RMATicketingSectionProps {
  project: OperationProject;
  onUpdateProject: (updated: OperationProject) => void;
  currentUserName?: string;
  preselectedBomItemId?: string | null;
  onClearPreselectedBomItem?: () => void;
  contextLabel?: 'Project' | 'Property';
}

export const RMATicketingSection: React.FC<RMATicketingSectionProps> = ({
  project,
  onUpdateProject,
  currentUserName = 'Raul Recalde',
  preselectedBomItemId,
  onClearPreselectedBomItem,
  contextLabel = 'Project',
}) => {
  const existingTickets = project.rmaTickets || [];
  const bomItems = project.bomItems || [];

  const [selectedBomItemId, setSelectedBomItemId] = useState<string>('');
  const [manualCompanyOverride, setManualCompanyOverride] = useState<RMAProductCompany | ''>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isSectionExpanded, setIsSectionExpanded] = useState<boolean>(false);
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);

  // Ticket Form Fields
  const [defectiveQuantity, setDefectiveQuantity] = useState<number>(1);
  const [status, setStatus] = useState<RMATicketStatus>('1. Tech Support Troubleshooting');
  const [authorizedDealerOrPartner, setAuthorizedDealerOrPartner] = useState<string>(
    (project.integratorPartners && project.integratorPartners[0]) || 'Quext Authorized Partner'
  );
  const [troubleshootingPerformed, setTroubleshootingPerformed] = useState<boolean>(false);
  const [troubleshootingNotes, setTroubleshootingNotes] = useState<string>('');
  const [serialNumbers, setSerialNumbers] = useState<string>('');
  const [neededByDate, setNeededByDate] = useState<string>('');
  const [originalInvoiceOrPo, setOriginalInvoiceOrPo] = useState<string>(
    project.quoteNumber ? `Quote #${project.quoteNumber}` : ''
  );
  const [failureDescription, setFailureDescription] = useState<string>('');
  const [issuedRmaNumber, setIssuedRmaNumber] = useState<string>('');
  const [designatedReturnAddress, setDesignatedReturnAddress] = useState<string>('');
  const [returnTrackingNumber, setReturnTrackingNumber] = useState<string>('');

  // Company-specific states
  const [allegionSrNumber, setAllegionSrNumber] = useState<string>('');
  const [allegionPartNumbers, setAllegionPartNumbers] = useState<string>('');

  const [eenCustomerAccountName, setEenCustomerAccountName] = useState<string>(
    project.propertyName || ''
  );
  const [eenBridgeOrCmvrName, setEenBridgeOrCmvrName] = useState<string>('');
  const [eenCmvrDataRetentionRequired, setEenCmvrDataRetentionRequired] = useState<boolean>(false);
  const [eenCmvrDataRetentionNotes, setEenCmvrDataRetentionNotes] = useState<string>('');
  const [eenReplacementMethod, setEenReplacementMethod] = useState<
    'Standard RMA' | 'Rapid Replacement (30-Day Return Window)'
  >('Standard RMA');

  const [brivoOriginalInstallDate, setBrivoOriginalInstallDate] = useState<string>('');
  const [brivoClaimType, setBrivoClaimType] = useState<
    'Dead on Arrival (DOA - 0 to 30 Days)' | 'Standard Warranty RMA' | 'Advance Replacement'
  >('Standard Warranty RMA');
  const [brivoFormSubmitted, setBrivoFormSubmitted] = useState<boolean>(false);

  const [pdkPartnerTier, setPdkPartnerTier] = useState<
    | 'Standard Account (1 Year)'
    | 'Certified Partner (3 Years)'
    | 'Gold Partner (4 Years)'
    | 'Platinum Partner (5 Years)'
  >('Certified Partner (3 Years)');
  const [pdkDefectOccurredDate, setPdkDefectOccurredDate] = useState<string>('');
  const [pdkRmaPath, setPdkRmaPath] = useState<'Advance Shipment RMA' | 'Distribution RMA'>(
    'Advance Shipment RMA'
  );
  const [pdkConditionVerified, setPdkConditionVerified] = useState<boolean>(false);

  const [butterflyMxDoorLocation, setButterflyMxDoorLocation] = useState<string>('');
  const [butterflyMxMacAddress, setButterflyMxMacAddress] = useState<string>('');
  const [ticketLockFinishConfig, setTicketLockFinishConfig] = useState<
    LockFinishConfig | undefined
  >(undefined);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState<boolean>(false);
  const [expandedTicketFinishIds, setExpandedTicketFinishIds] = useState<Record<string, boolean>>(
    {}
  );

  // Handle preselected BOM item from parent table row click
  useEffect(() => {
    if (preselectedBomItemId) {
      setIsSectionExpanded(true);
      setSelectedBomItemId(preselectedBomItemId);
      setManualCompanyOverride('');
      setIsFormOpen(true);
      const item = bomItems.find((b) => b.id === preselectedBomItemId);
      if (item) {
        setAllegionPartNumbers(item.model || item.name);
        setButterflyMxDoorLocation(item.location || '');
        setTicketLockFinishConfig(
          item.lockFinishConfig ? JSON.parse(JSON.stringify(item.lockFinishConfig)) : undefined
        );
        const autoComp = matchBomItemToRmaCompany(item);
        if (autoComp === 'ProdataKey (PDK)') {
          setDesignatedReturnAddress(
            RMA_COMPANY_PROCEDURES['ProdataKey (PDK)'].defaultReturnAddress || ''
          );
        } else {
          setDesignatedReturnAddress('');
        }
      }
      if (onClearPreselectedBomItem) {
        onClearPreselectedBomItem();
      }
    }
  }, [preselectedBomItemId, bomItems, onClearPreselectedBomItem]);

  const selectedBomItem: BOMItem | null = useMemo(() => {
    if (!selectedBomItemId) return null;
    return bomItems.find((b) => b.id === selectedBomItemId) || null;
  }, [bomItems, selectedBomItemId]);

  const autoMatchedCompany: RMAProductCompany | null = useMemo(() => {
    if (!selectedBomItem) return null;
    return matchBomItemToRmaCompany(selectedBomItem);
  }, [selectedBomItem]);

  const activeCompany: RMAProductCompany | null = useMemo(() => {
    if (!selectedBomItem) return null;
    if (manualCompanyOverride) return manualCompanyOverride;
    return autoMatchedCompany;
  }, [selectedBomItem, manualCompanyOverride, autoMatchedCompany]);

  const activeProcedure: RMACompanyProcedureConfig | null = useMemo(() => {
    if (!activeCompany) return null;
    return RMA_COMPANY_PROCEDURES[activeCompany];
  }, [activeCompany]);

  const handleSelectBomItem = (bomId: string) => {
    setSelectedBomItemId(bomId);
    setManualCompanyOverride('');
    setEditingTicketId(null);
    if (!bomId) {
      setIsFormOpen(false);
      return;
    }
    setIsFormOpen(true);
    const item = bomItems.find((b) => b.id === bomId);
    if (item) {
      setAllegionPartNumbers(item.model ? `${item.model} (${item.name})` : item.name);
      setButterflyMxDoorLocation(item.location || '');
      setTicketLockFinishConfig(
        item.lockFinishConfig ? JSON.parse(JSON.stringify(item.lockFinishConfig)) : undefined
      );
      const matched = matchBomItemToRmaCompany(item);
      if (matched === 'ProdataKey (PDK)') {
        setDesignatedReturnAddress(
          RMA_COMPANY_PROCEDURES['ProdataKey (PDK)'].defaultReturnAddress || ''
        );
      } else {
        setDesignatedReturnAddress('');
      }
    }
  };

  const resetTicketForm = () => {
    setSelectedBomItemId('');
    setManualCompanyOverride('');
    setEditingTicketId(null);
    setIsFormOpen(false);
    setDefectiveQuantity(1);
    setStatus('1. Tech Support Troubleshooting');
    setTroubleshootingPerformed(false);
    setTroubleshootingNotes('');
    setNeededByDate('');
    setSerialNumbers('');
    setFailureDescription('');
    setIssuedRmaNumber('');
    setDesignatedReturnAddress('');
    setReturnTrackingNumber('');
    setAllegionSrNumber('');
    setAllegionPartNumbers('');
    setEenBridgeOrCmvrName('');
    setEenCmvrDataRetentionRequired(false);
    setEenCmvrDataRetentionNotes('');
    setBrivoOriginalInstallDate('');
    setBrivoFormSubmitted(false);
    setPdkDefectOccurredDate('');
    setPdkConditionVerified(false);
    setButterflyMxDoorLocation('');
    setButterflyMxMacAddress('');
    setTicketLockFinishConfig(undefined);
  };

  const handleEditExistingTicket = (ticket: RMATicketRecord) => {
    setEditingTicketId(ticket.id);
    setSelectedBomItemId(ticket.bomItemId);
    setManualCompanyOverride(ticket.matchedCompany);
    setIsFormOpen(true);
    setDefectiveQuantity(ticket.defectiveQuantity);
    setStatus(ticket.status);
    setAuthorizedDealerOrPartner(ticket.authorizedDealerOrPartner);
    setTroubleshootingPerformed(ticket.troubleshootingPerformed);
    setTroubleshootingNotes(ticket.troubleshootingNotes);
    setNeededByDate(ticket.neededByDate || '');
    setSerialNumbers(ticket.serialNumbers);
    setOriginalInvoiceOrPo(ticket.originalInvoiceOrPo);
    setFailureDescription(ticket.failureDescription);
    setIssuedRmaNumber(ticket.issuedRmaNumber);
    setDesignatedReturnAddress(ticket.designatedReturnAddress);
    setReturnTrackingNumber(ticket.returnTrackingNumber);
    setAllegionSrNumber(ticket.allegionServiceRequestNumber || '');
    setAllegionPartNumbers(ticket.allegionCompletePartNumbers || '');
    setEenCustomerAccountName(ticket.eenCustomerAccountName || project.propertyName);
    setEenBridgeOrCmvrName(ticket.eenBridgeOrCmvrName || '');
    setEenCmvrDataRetentionRequired(Boolean(ticket.eenCmvrDataRetentionRequired));
    setEenCmvrDataRetentionNotes(ticket.eenCmvrDataRetentionNotes || '');
    setEenReplacementMethod(ticket.eenReplacementMethod || 'Standard RMA');
    setBrivoOriginalInstallDate(ticket.brivoOriginalInstallDate || '');
    setBrivoClaimType(ticket.brivoClaimType || 'Standard Warranty RMA');
    setBrivoFormSubmitted(Boolean(ticket.brivoFormSubmitted));
    setPdkPartnerTier(ticket.pdkPartnerTier || 'Certified Partner (3 Years)');
    setPdkDefectOccurredDate(ticket.pdkDefectOccurredDate || '');
    setPdkRmaPath(ticket.pdkRmaPath || 'Advance Shipment RMA');
    setPdkConditionVerified(Boolean(ticket.pdkConditionVerified));
    setButterflyMxDoorLocation(ticket.butterflyMxDoorLocation || '');
    setButterflyMxMacAddress(ticket.butterflyMxMacAddress || '');
    const fallbackItem = bomItems.find((b) => b.id === ticket.bomItemId);
    setTicketLockFinishConfig(
      ticket.lockFinishConfig
        ? JSON.parse(JSON.stringify(ticket.lockFinishConfig))
        : fallbackItem?.lockFinishConfig
        ? JSON.parse(JSON.stringify(fallbackItem.lockFinishConfig))
        : undefined
    );
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBomItem || !activeCompany) return;

    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const ticketRecord: RMATicketRecord = {
      id: editingTicketId || `rma-${project.id}-${Date.now()}`,
      ticketNumber:
        editingTicketId
          ? existingTickets.find((t) => t.id === editingTicketId)?.ticketNumber ||
            `RMA-${String(existingTickets.length + 1).padStart(3, '0')}`
          : `RMA-${activeCompany.slice(0, 3).toUpperCase()}-${String(
              existingTickets.length + 1
            ).padStart(3, '0')}`,
      projectId: project.id,
      propertyName: project.propertyName,
      createdBy: currentUserName,
      createdAt: editingTicketId
        ? existingTickets.find((t) => t.id === editingTicketId)?.createdAt || nowFormatted
        : nowFormatted,
      updatedAt: nowFormatted,
      status,
      bomItemId: selectedBomItem.id,
      bomItemName: selectedBomItem.name,
      bomItemModel: selectedBomItem.model,
      bomItemCategory: selectedBomItem.category,
      matchedCompany: activeCompany,
      defectiveQuantity: Math.max(1, defectiveQuantity),
      authorizedDealerOrPartner: authorizedDealerOrPartner.trim(),
      troubleshootingPerformed,
      troubleshootingNotes: troubleshootingNotes.trim(),
      serialNumbers: serialNumbers.trim(),
      originalInvoiceOrPo: originalInvoiceOrPo.trim(),
      failureDescription: failureDescription.trim(),
      issuedRmaNumber: issuedRmaNumber.trim(),
      designatedReturnAddress:
        designatedReturnAddress.trim() ||
        (activeCompany === 'ProdataKey (PDK)'
          ? RMA_COMPANY_PROCEDURES['ProdataKey (PDK)'].defaultReturnAddress || ''
          : ''),
      returnTrackingNumber: returnTrackingNumber.trim(),
      neededByDate: neededByDate.trim() || undefined,
      // Company-specific fields
      allegionServiceRequestNumber:
        activeCompany === 'Allegion' ? allegionSrNumber.trim() : undefined,
      allegionCompletePartNumbers:
        activeCompany === 'Allegion'
          ? allegionPartNumbers.trim() || `${selectedBomItem.model} (${selectedBomItem.name})`
          : undefined,
      eenCustomerAccountName:
        activeCompany === 'Eagle Eye Networks' ? eenCustomerAccountName.trim() : undefined,
      eenBridgeOrCmvrName:
        activeCompany === 'Eagle Eye Networks' ? eenBridgeOrCmvrName.trim() : undefined,
      eenCmvrDataRetentionRequired:
        activeCompany === 'Eagle Eye Networks' ? eenCmvrDataRetentionRequired : undefined,
      eenCmvrDataRetentionNotes:
        activeCompany === 'Eagle Eye Networks' ? eenCmvrDataRetentionNotes.trim() : undefined,
      eenReplacementMethod:
        activeCompany === 'Eagle Eye Networks' ? eenReplacementMethod : undefined,
      brivoOriginalInstallDate:
        activeCompany === 'Brivo' ? brivoOriginalInstallDate.trim() : undefined,
      brivoClaimType: activeCompany === 'Brivo' ? brivoClaimType : undefined,
      brivoFormSubmitted: activeCompany === 'Brivo' ? brivoFormSubmitted : undefined,
      pdkPartnerTier: activeCompany === 'ProdataKey (PDK)' ? pdkPartnerTier : undefined,
      pdkDefectOccurredDate:
        activeCompany === 'ProdataKey (PDK)' ? pdkDefectOccurredDate.trim() : undefined,
      pdkRmaPath: activeCompany === 'ProdataKey (PDK)' ? pdkRmaPath : undefined,
      pdkConditionVerified:
        activeCompany === 'ProdataKey (PDK)' ? pdkConditionVerified : undefined,
      butterflyMxDoorLocation:
        activeCompany === 'ButterflyMX' ? butterflyMxDoorLocation.trim() : undefined,
      butterflyMxMacAddress:
        activeCompany === 'ButterflyMX' ? butterflyMxMacAddress.trim() : undefined,
      sourceWorkspace: contextLabel,
      sourceSectionLabel: 'Hardware RMA Ticketing Workflow',
      lockFinishConfig: ticketLockFinishConfig,
      thermostatBrand: selectedBomItem.thermostatBrand,
      unitPrice: selectedBomItem.unitPrice,
      location: selectedBomItem.location,
      description: selectedBomItem.description,
    };

    const nextTickets = editingTicketId
      ? existingTickets.map((t) => (t.id === editingTicketId ? ticketRecord : t))
      : [ticketRecord, ...existingTickets];

    onUpdateProject({
      ...project,
      rmaTickets: nextTickets,
      lastUpdated: new Date().toISOString(),
    });

    resetTicketForm();
  };

  const handleAdvanceTicketStatus = (ticket: RMATicketRecord) => {
    const currentIndex = RMA_STATUS_STEPS.indexOf(ticket.status);
    const nextIndex = (currentIndex + 1) % RMA_STATUS_STEPS.length;
    const nextStatus = RMA_STATUS_STEPS[nextIndex];
    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const nextTickets = existingTickets.map((t) =>
      t.id === ticket.id ? { ...t, status: nextStatus, updatedAt: nowFormatted } : t
    );

    onUpdateProject({
      ...project,
      rmaTickets: nextTickets,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleDeleteTicket = (ticketId: string) => {
    onUpdateProject({
      ...project,
      rmaTickets: existingTickets.filter((t) => t.id !== ticketId),
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleCopyTicketSummary = (ticket: RMATicketRecord) => {
    const finishLines = formatFullFinishDetailsLines(ticket.lockFinishConfig, {
      name: ticket.bomItemName,
      model: ticket.bomItemModel,
      category: ticket.bomItemCategory,
      thermostatBrand: ticket.thermostatBrand,
    });
    const lines = [
      `=== QUEXT HARDWARE RMA TICKET: ${ticket.ticketNumber} ===`,
      `Source: ${ticket.sourceWorkspace || contextLabel} Page — ${ticket.sourceSectionLabel || 'Hardware RMA Ticketing Workflow'}`,
      `${contextLabel}: ${ticket.propertyName}`,
      `Product Company: ${ticket.matchedCompany}`,
      `BOM Item: ${ticket.bomItemName} (Model: ${ticket.bomItemModel})`,
      `Defective Quantity: ${ticket.defectiveQuantity}`,
      ...(finishLines.length > 0 ? [`Finish & Hardware Options:`, ...finishLines.map((l) => `  ${l}`)] : []),
      `Current Status: ${ticket.status}`,
      `Authorized Partner/Dealer: ${ticket.authorizedDealerOrPartner}`,
      `Serial Number(s): ${ticket.serialNumbers || 'Pending'}`,
      `Original Invoice / PO: ${ticket.originalInvoiceOrPo || 'Pending'}`,
      `Issued RMA Number: ${ticket.issuedRmaNumber || 'Pending Authorization'}`,
      `Failure Description: ${ticket.failureDescription || 'N/A'}`,
      ticket.designatedReturnAddress ? `Return Address: ${ticket.designatedReturnAddress}` : '',
      ticket.returnTrackingNumber ? `Return Tracking #: ${ticket.returnTrackingNumber}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines);
    setCopiedTicketId(ticket.id);
    setTimeout(() => setCopiedTicketId(null), 2000);
  };

  return (
    <div
      id="rma-ticketing-workflow"
      className="scroll-mt-36 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
    >
      {/* Section Header (Collapsible — Collapsed by Default unless Expanded) */}
      <div
        onClick={() => setIsSectionExpanded((prev) => !prev)}
        className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:from-slate-800 hover:to-slate-900 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                Hardware RMA Ticketing Workflow
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                BOM Line-Item Matcher
              </span>
              {!isSectionExpanded && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300 border border-white/15">
                  Click to Expand
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Select any BOM line item from this {contextLabel.toLowerCase()} to view only its
              manufacturer&apos;s official RMA procedure and generate a matching RMA ticket.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('quext:open-product-acquisition-portal'));
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold cursor-pointer transition-colors"
            title="Open the centralized Product Acquisition Portal"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Acquisition Portal</span>
          </button>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-white">
            {existingTickets.length} Active RMA Ticket{existingTickets.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSectionExpanded((prev) => !prev);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold cursor-pointer transition-colors"
          >
            {isSectionExpanded ? (
              <>
                <span>Collapse</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Expand RMA Workflow</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {isSectionExpanded && (
        <div className="p-6 space-y-6">
        {/* Step 1: Select & Match BOM Line Item */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                1. Select BOM Line Item to Initiate RMA Ticket
              </label>
              <select
                value={selectedBomItemId}
                onChange={(e) => handleSelectBomItem(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
              >
                <option value="">
                  -- Select a BOM Line Item from {project.propertyName} ({bomItems.length} items) --
                </option>
                {bomItems.map((item) => {
                  const matched = matchBomItemToRmaCompany(item);
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name} — Model: {item.model} (Installed: {item.installedCount} / Total:{' '}
                      {item.quantity}) {matched ? `[Matched: ${matched}]` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedBomItem && (
              <div className="w-full md:w-72 space-y-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Matched RMA Product Company
                </label>
                <select
                  value={activeCompany || ''}
                  onChange={(e) => setManualCompanyOverride(e.target.value as RMAProductCompany)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold bg-white border border-indigo-300 rounded-xl text-indigo-950 focus:outline-none focus:border-indigo-600 shadow-2xs"
                >
                  <option value="" disabled>
                    Select Product Manufacturer...
                  </option>
                  {RMA_PRODUCT_COMPANIES.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp} {autoMatchedCompany === comp ? '(Auto-Matched)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBomItem && (
              <button
                type="button"
                onClick={resetTicketForm}
                className="px-3.5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition-colors shrink-0"
              >
                Clear Selection
              </button>
            )}
          </div>

          {!selectedBomItem && (
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
              <ClipboardList className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Select a BOM line item above (or click <strong>RMA Ticket</strong> on any BOM item)
                to display the manufacturer-specific RMA process and ticket form.
              </span>
            </div>
          )}
        </div>

        {/* ONLY SHOW THE RMA PROCESS & TICKET GENERATOR RELATED TO THE SELECTED BOM ITEM */}
        {selectedBomItem && activeProcedure && isFormOpen && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 cols): Official Manufacturer RMA Process for the Selected BOM Item ONLY */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div
                className={`p-4 sm:p-5 bg-gradient-to-r ${activeProcedure.headerBg} text-white space-y-2`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/15 text-white border border-white/20">
                    Matched Manufacturer RMA Process
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">
                    Model: {selectedBomItem.model}
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-white">
                  Product: {activeProcedure.company} — RMA Process
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Showing official RMA instructions exclusively for{' '}
                  <strong className="text-white">{selectedBomItem.name}</strong>.
                </p>

                {/* Support Contact Strip */}
                <div className="pt-2 space-y-1 text-xs">
                  {activeProcedure.supportPhones.map((phone, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{phone}</span>
                    </div>
                  ))}
                  {activeProcedure.supportEmail && (
                    <div className="flex items-center gap-1.5 text-sky-300 font-semibold">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <a href={`mailto:${activeProcedure.supportEmail}`} className="underline">
                        {activeProcedure.supportEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{activeProcedure.dealerRequirementNote}</span>
                </div>

                <div className="space-y-3.5">
                  {activeProcedure.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                          {step.title}
                        </h4>
                      </div>
                      <ul className="space-y-1 pl-7 list-disc text-xs text-slate-700 leading-relaxed">
                        {step.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Generated RMA Ticket Form for Selected BOM Item */}
            <form
              onSubmit={handleSubmitTicket}
              className="lg:col-span-7 rounded-2xl border-2 border-indigo-200 bg-white p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${activeProcedure.badgeColor}`}
                  >
                    {activeProcedure.company} RMA Ticket Generator
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {editingTicketId ? 'Update RMA Ticket' : 'Complete RMA Ticket'} —{' '}
                    {selectedBomItem.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Installed: {selectedBomItem.installedCount} / BOM Total:{' '}
                  {selectedBomItem.quantity}
                </span>
              </div>

              {/* Product Details & Finish Options Card (Synced with Product Acquisition Portal) */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <span>Product &amp; Finish Options (Sent to Product Acquisition Portal)</span>
                    </div>
                    <div className="font-bold text-white text-xs sm:text-sm">
                      {selectedBomItem.name}{' '}
                      <span className="text-slate-400 font-mono text-xs">
                        (Model: {selectedBomItem.model})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span>Category: {selectedBomItem.category}</span>
                      <span>Location: {selectedBomItem.location}</span>
                      {selectedBomItem.thermostatBrand && (
                        <span className="text-amber-300 font-semibold">
                          Thermostat Brand: {selectedBomItem.thermostatBrand}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFinishModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold cursor-pointer transition-colors shrink-0"
                  >
                    <span>
                      {ticketLockFinishConfig
                        ? '🎨 Edit Finish Options'
                        : '🎨 + Set Finish Options'}
                    </span>
                  </button>
                </div>

                {ticketLockFinishConfig ? (
                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-sky-300">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/50 shrink-0"
                          style={{
                            backgroundColor: getLockFinishColorHex(
                              ticketLockFinishConfig.befeColorFinish ||
                                ticketLockFinishConfig.ndeColorFinish ||
                                ticketLockFinishConfig.xe360ColorFinish
                            ),
                          }}
                        />
                        <span>
                          {getLockFinishSummaryTag(ticketLockFinishConfig) ||
                            'Configured Finish Options'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTicketLockFinishConfig(undefined)}
                        className="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        Clear Finish
                      </button>
                    </div>
                    <div className="text-slate-300 space-y-0.5 pt-1 border-t border-slate-800/80">
                      {formatFullFinishDetailsLines(ticketLockFinishConfig, selectedBomItem).map(
                        (line, idx) => (
                          <div key={idx}>{line}</div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    {isLockBOMItem(selectedBomItem)
                      ? 'No lock finish options set yet — click "🎨 + Set Finish Options" to specify Trim Style, Color Finish, Lever Style, or Split Finishes for this RMA replacement.'
                      : 'Optional: Click "🎨 + Set Finish Options" if this RMA item requires trim, finish, or hardware configuration notes.'}
                  </div>
                )}
              </div>

              {/* Core Shared RMA Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    RMA Workflow Stage
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RMATicketStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-900"
                  >
                    {RMA_STATUS_STEPS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Defective Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, selectedBomItem.quantity)}
                    required
                    value={defectiveQuantity}
                    onChange={(e) => setDefectiveQuantity(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Authorized Dealer / Partner
                  </label>
                  <input
                    type="text"
                    required
                    value={authorizedDealerOrPartner}
                    onChange={(e) => setAuthorizedDealerOrPartner(e.target.value)}
                    placeholder="Authorized Integrator / Dealer"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Device Serial Number(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={serialNumbers}
                    onChange={(e) => setSerialNumbers(e.target.value)}
                    placeholder="Enter device serial number(s) / ID..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Original Invoice / PO / Proof of Purchase
                  </label>
                  <input
                    type="text"
                    value={originalInvoiceOrPo}
                    onChange={(e) => setOriginalInvoiceOrPo(e.target.value)}
                    placeholder="Invoice # or Purchase Order #"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* ============================================================
                  COMPANY-SPECIFIC FIELDS BASED ON SELECTED BOM ITEM
              ============================================================ */}
              {activeCompany === 'Allegion' && (
                <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-3 text-xs">
                  <div className="font-black text-orange-950 uppercase tracking-wider text-[11px]">
                    Allegion / Schlage Mandatory Documentation (877-671-7011)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Tech Support Service Request (SR) Number
                      </label>
                      <input
                        type="text"
                        value={allegionSrNumber}
                        onChange={(e) => setAllegionSrNumber(e.target.value)}
                        placeholder="SR # provided by Allegion Tech Support"
                        className="w-full px-3 py-2 bg-white border border-orange-300 rounded-lg font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Complete Part Number(s)
                      </label>
                      <input
                        type="text"
                        value={allegionPartNumbers}
                        onChange={(e) => setAllegionPartNumbers(e.target.value)}
                        placeholder="Complete Allegion/Schlage part number"
                        className="w-full px-3 py-2 bg-white border border-orange-300 rounded-lg font-mono text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeCompany === 'Eagle Eye Networks' && (
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-3 text-xs">
                  <div className="font-black text-sky-950 uppercase tracking-wider text-[11px]">
                    Eagle Eye Networks Hardware &amp; CMVR Details (support@een.com)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Customer Account Name in Dashboard
                      </label>
                      <input
                        type="text"
                        value={eenCustomerAccountName}
                        onChange={(e) => setEenCustomerAccountName(e.target.value)}
                        placeholder="Customer Account Name"
                        className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Bridge / CMVR Name in Dashboard
                      </label>
                      <input
                        type="text"
                        value={eenBridgeOrCmvrName}
                        onChange={(e) => setEenBridgeOrCmvrName(e.target.value)}
                        placeholder="Bridge or CMVR Dashboard Name"
                        className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Shipping &amp; Replacement Method
                      </label>
                      <select
                        value={eenReplacementMethod}
                        onChange={(e) =>
                          setEenReplacementMethod(
                            e.target.value as
                              | 'Standard RMA'
                              | 'Rapid Replacement (30-Day Return Window)'
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg font-semibold text-slate-900"
                      >
                        <option value="Standard RMA">Standard RMA (Depot Inspect &amp; Ship)</option>
                        <option value="Rapid Replacement (30-Day Return Window)">
                          Rapid Replacement (Advance Ship - 30-Day Return)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-1 space-y-2">
                    <label className="inline-flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={eenCmvrDataRetentionRequired}
                        onChange={(e) => setEenCmvrDataRetentionRequired(e.target.checked)}
                        className="rounded border-sky-400 text-sky-600"
                      />
                      <span>
                        CMVR Local Video Data Retention Required (Do NOT remove hard drives without
                        Support guidance)
                      </span>
                    </label>
                    {eenCmvrDataRetentionRequired && (
                      <input
                        type="text"
                        value={eenCmvrDataRetentionNotes}
                        onChange={(e) => setEenCmvrDataRetentionNotes(e.target.value)}
                        placeholder="Document EEN Support authorization & chassis-replacement guidance..."
                        className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg text-slate-900"
                      />
                    )}
                  </div>
                </div>
              )}

              {activeCompany === 'Brivo' && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3 text-xs">
                  <div className="font-black text-indigo-950 uppercase tracking-wider text-[11px]">
                    Brivo Claim Classification &amp; RMA Form Submission (support@brivo.com)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Original Installation Date
                      </label>
                      <input
                        type="date"
                        value={brivoOriginalInstallDate}
                        onChange={(e) => setBrivoOriginalInstallDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Brivo Claim Type
                      </label>
                      <select
                        value={brivoClaimType}
                        onChange={(e) =>
                          setBrivoClaimType(
                            e.target.value as
                              | 'Dead on Arrival (DOA - 0 to 30 Days)'
                              | 'Standard Warranty RMA'
                              | 'Advance Replacement'
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-lg font-semibold text-slate-900"
                      >
                        <option value="Dead on Arrival (DOA - 0 to 30 Days)">
                          Dead on Arrival (DOA — 0 to 30 Days of Install)
                        </option>
                        <option value="Standard Warranty RMA">
                          Standard Warranty RMA (Normal Use Failure)
                        </option>
                        <option value="Advance Replacement">
                          Advance Replacement (Critical Security Infrastructure)
                        </option>
                      </select>
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 font-bold text-slate-800 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={brivoFormSubmitted}
                      onChange={(e) => setBrivoFormSubmitted(e.target.checked)}
                      className="rounded border-indigo-400 text-indigo-600"
                    />
                    <span>Official Brivo RMA Form completed and emailed to support@brivo.com</span>
                  </label>
                </div>
              )}

              {activeCompany === 'ProdataKey (PDK)' && (
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3 text-xs">
                  <div className="font-black text-rose-950 uppercase tracking-wider text-[11px]">
                    ProdataKey (PDK) Warranty Tier &amp; RMA Path (801-317-8802 / support@prodatakey.com)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Partner Warranty Tier
                      </label>
                      <select
                        value={pdkPartnerTier}
                        onChange={(e) =>
                          setPdkPartnerTier(
                            e.target.value as
                              | 'Standard Account (1 Year)'
                              | 'Certified Partner (3 Years)'
                              | 'Gold Partner (4 Years)'
                              | 'Platinum Partner (5 Years)'
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg font-semibold text-slate-900"
                      >
                        <option value="Standard Account (1 Year)">Standard Account (1 Year)</option>
                        <option value="Certified Partner (3 Years)">
                          Certified Partner (3 Years)
                        </option>
                        <option value="Gold Partner (4 Years)">Gold Partner (4 Years)</option>
                        <option value="Platinum Partner (5 Years)">
                          Platinum Partner (5 Years)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Date Defect Occurred (60-Day Window)
                      </label>
                      <input
                        type="date"
                        value={pdkDefectOccurredDate}
                        onChange={(e) => setPdkDefectOccurredDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Selected PDK RMA Path
                      </label>
                      <select
                        value={pdkRmaPath}
                        onChange={(e) =>
                          setPdkRmaPath(
                            e.target.value as 'Advance Shipment RMA' | 'Distribution RMA'
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg font-semibold text-slate-900"
                      >
                        <option value="Advance Shipment RMA">
                          Advance Shipment RMA (Direct from PDK)
                        </option>
                        <option value="Distribution RMA">
                          Distribution RMA (Via Authorized Distributor)
                        </option>
                      </select>
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 font-bold text-slate-800 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={pdkConditionVerified}
                      onChange={(e) => setPdkConditionVerified(e.target.checked)}
                      className="rounded border-rose-400 text-rose-600"
                    />
                    <span>
                      Condition Check Verified: Item has no unapproved structural damage beyond
                      reported defect
                    </span>
                  </label>
                </div>
              )}

              {activeCompany === 'ButterflyMX' && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3 text-xs">
                  <div className="font-black text-amber-950 uppercase tracking-wider text-[11px]">
                    ButterflyMX Intercom &amp; Door Location Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Door / Gate / Lobby Location
                      </label>
                      <input
                        type="text"
                        value={butterflyMxDoorLocation}
                        onChange={(e) => setButterflyMxDoorLocation(e.target.value)}
                        placeholder="e.g., Main Lobby Vestibule / North Gate"
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Intercom MAC Address
                      </label>
                      <input
                        type="text"
                        value={butterflyMxMacAddress}
                        onChange={(e) => setButterflyMxMacAddress(e.target.value)}
                        placeholder="e.g., 00:1A:2B:3C:4D:5E"
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg font-mono text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mandatory Tech Support Troubleshooting & Failure Description */}
              <div className="space-y-3 text-xs">
                <label className="inline-flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={troubleshootingPerformed}
                    onChange={(e) => setTroubleshootingPerformed(e.target.checked)}
                    className="rounded border-slate-400 text-indigo-600"
                  />
                  <span>
                    Mandatory Technical Support Troubleshooting Performed with{' '}
                    {activeProcedure.company} Support
                  </span>
                </label>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Specific, Detailed Description of Failure &amp; Troubleshooting Steps *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={failureDescription}
                    onChange={(e) => setFailureDescription(e.target.value)}
                    placeholder={`Describe the specific hardware failure, error codes, and troubleshooting steps performed with ${activeProcedure.company} Tech Support...`}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* RMA Authorization Number & Return Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official Issued RMA Number
                  </label>
                  <input
                    type="text"
                    value={issuedRmaNumber}
                    onChange={(e) => setIssuedRmaNumber(e.target.value)}
                    placeholder="Unique RMA # (Do not ship without)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Designated Return Address
                  </label>
                  <input
                    type="text"
                    value={designatedReturnAddress}
                    onChange={(e) => setDesignatedReturnAddress(e.target.value)}
                    placeholder="Address from RMA Confirmation"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Return Shipment Tracking #
                  </label>
                  <input
                    type="text"
                    value={returnTrackingNumber}
                    onChange={(e) => setReturnTrackingNumber(e.target.value)}
                    placeholder="UPS / FedEx / USPS Tracking #"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-300">
                  <label className="block font-bold text-amber-950 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>When needed by? *</span>
                  </label>
                  <input
                    type="date"
                    value={neededByDate}
                    onChange={(e) => setNeededByDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-amber-400 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={resetTicketForm}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingTicketId ? 'Save RMA Ticket Updates' : 'Generate RMA Ticket'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active & Logged RMA Tickets List */}
        {existingTickets.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Logged RMA Tickets for {project.propertyName} ({existingTickets.length})
              </h3>
              <span className="text-[11px] text-slate-400">
                Click any ticket status badge to advance its RMA stage
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {existingTickets.map((ticket) => {
                const proc = RMA_COMPANY_PROCEDURES[ticket.matchedCompany];
                return (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[11px] font-bold">
                          {ticket.ticketNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            proc?.badgeColor || 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          {ticket.matchedCompany}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdvanceTicketStatus(ticket)}
                          title="Click to progress RMA ticket status"
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border cursor-pointer transition-colors ${
                            ticket.status === '5. Replacement Received / Closed'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : ticket.status === '1. Tech Support Troubleshooting'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-sky-100 text-sky-900 border-sky-300'
                          }`}
                        >
                          {ticket.status} ↻
                        </button>
                        <span className="text-xs font-bold text-slate-900">
                          {ticket.bomItemName}{' '}
                          <span className="font-mono text-slate-500">({ticket.bomItemModel})</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-mono font-bold">
                          Qty: {ticket.defectiveQuantity}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] font-bold">
                          {ticket.sourceWorkspace || contextLabel} • RMA Ticket
                        </span>
                      </div>

                      {/* Acquisition Portal Status Badge & Milestones */}
                      {(() => {
                        const acqUid = `rma::${project.id}::${ticket.id}`;
                        const acqMilestone = project.acquisitionMilestones?.[acqUid];
                        const isShipped = !!(acqMilestone?.isShipped ?? ticket.isShipped ?? (ticket.status === '4. Packaged & Shipped'));
                        const isArrived = !!(acqMilestone?.isArrivedToWarehouse ?? ticket.isArrivedToWarehouse);
                        const isOrdered = !!(acqMilestone?.isOrdered ?? ticket.isOrdered ?? (ticket.status === '3. RMA Number Issued'));
                        const trackNum = acqMilestone?.trackingNumber || ticket.trackingNumber || ticket.returnTrackingNumber;
                        const neededBy = acqMilestone?.neededByDate || ticket.neededByDate;

                        return (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                isShipped
                                  ? 'bg-sky-100 text-sky-950 border-sky-300'
                                  : isArrived
                                  ? 'bg-teal-100 text-teal-950 border-teal-300'
                                  : isOrdered
                                  ? 'bg-indigo-100 text-indigo-950 border-indigo-300'
                                  : 'bg-emerald-50 text-emerald-950 border-emerald-300'
                              }`}
                            >
                              <Package className="w-3 h-3 text-emerald-700" />
                              <span>
                                Acquisition Portal:{' '}
                                {isShipped
                                  ? 'Shipped'
                                  : isArrived
                                  ? 'Arrived to Warehouse'
                                  : isOrdered
                                  ? 'Ordered'
                                  : 'In Intake Queue'}
                              </span>
                              {isShipped && trackNum && (
                                <span className="font-mono font-bold bg-white px-1.5 py-0.2 rounded text-[10px] text-sky-900 border border-sky-300">
                                  Track: {trackNum}
                                </span>
                              )}
                            </span>
                            {neededBy && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-950 border border-amber-300">
                                <Calendar className="w-3 h-3 text-amber-600" />
                                <span>Needed by: {neededBy}</span>
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {ticket.lockFinishConfig && (
                        <div className="space-y-1.5 pt-0.5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] border border-slate-700">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                              style={{
                                backgroundColor: getLockFinishColorHex(
                                  ticket.lockFinishConfig.befeColorFinish ||
                                    ticket.lockFinishConfig.ndeColorFinish ||
                                    ticket.lockFinishConfig.xe360ColorFinish
                                ),
                              }}
                            />
                            <span className="font-semibold">
                              Finish: {getLockFinishSummaryTag(ticket.lockFinishConfig)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedTicketFinishIds((prev) => ({
                                  ...prev,
                                  [ticket.id]: !prev[ticket.id],
                                }))
                              }
                              className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-sky-300 text-[9px] font-bold cursor-pointer"
                            >
                              {expandedTicketFinishIds[ticket.id] ? 'Hide Details' : 'Full Finish Details'}
                            </button>
                          </div>
                          {expandedTicketFinishIds[ticket.id] && (
                            <div className="p-2.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 text-[11px] space-y-0.5 max-w-xl">
                              {formatFullFinishDetailsLines(ticket.lockFinishConfig, {
                                name: ticket.bomItemName,
                                model: ticket.bomItemModel,
                                category: ticket.bomItemCategory,
                                thermostatBrand: ticket.thermostatBrand,
                              }).map((l, idx) => (
                                <div key={idx}>{l}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong>Failure:</strong> {ticket.failureDescription}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-mono">
                        <span>SN: {ticket.serialNumbers || 'Pending'}</span>
                        {ticket.issuedRmaNumber && (
                          <span className="text-emerald-700 font-bold">
                            RMA #: {ticket.issuedRmaNumber}
                          </span>
                        )}
                        {ticket.allegionServiceRequestNumber && (
                          <span>Allegion SR #: {ticket.allegionServiceRequestNumber}</span>
                        )}
                        {ticket.eenReplacementMethod && (
                          <span>EEN Method: {ticket.eenReplacementMethod}</span>
                        )}
                        {ticket.brivoClaimType && <span>Brivo Claim: {ticket.brivoClaimType}</span>}
                        {ticket.pdkRmaPath && <span>PDK Path: {ticket.pdkRmaPath}</span>}
                        {ticket.returnTrackingNumber && (
                          <span>Tracking: {ticket.returnTrackingNumber}</span>
                        )}
                        <span>
                          Created by {ticket.createdBy} ({ticket.createdAt})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyTicketSummary(ticket)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        {copiedTicketId === ticket.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Ticket</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditExistingTicket(ticket)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>View Process &amp; Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete RMA Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      )}

      {/* Lock Finish Modal for RMA Ticket Item */}
      {selectedBomItem && isFinishModalOpen && (
        <LockFinishModal
          item={{
            ...selectedBomItem,
            quantity: Math.max(1, defectiveQuantity),
            lockFinishConfig: ticketLockFinishConfig,
          }}
          isOpen={isFinishModalOpen}
          onClose={() => setIsFinishModalOpen(false)}
          onSave={(_itemId, config) => {
            setTicketLockFinishConfig(config);
            setIsFinishModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
