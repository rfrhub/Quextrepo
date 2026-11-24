export type SOWOrderStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Draft';

/** A single custom data table that can be added to an SOW */
export interface SOWCustomTable {
  id: string;
  title: string;
  columns: string[]; // column header names
  rows: string[][];  // each inner array matches columns length
}

export interface GoogleFormSubmission {
  id: string;
  submittedAt: string;
  source: 'google_form' | 'webhook' | 'simulator';
  status: 'new' | 'pdf_generated' | 'sent_to_tech';
  orderStatus?: SOWOrderStatus | string;
  scheduledDate?: string;
  propertyId?: string;
  
  // Site & Project Identification
  communityName: string;
  workSiteAddress: string;
  datePrepared: string;
  installDate: string;
  integratorPartners?: string[];
  preparedBy?: string;
  sowReferenceNumber: string;

  // Point of Contact (POC)
  pocName: string;
  pocTitle: string;
  pocPhone: string;
  pocEmail: string;
  alternateContact?: string;

  // Equipment / System Issues
  unitLocksIssue?: string;
  accessControlIssue?: string;
  camerasIssue?: string;
  residentWifiIssue?: string;
  communityWifiIssue?: string;
  staffWifiIssue?: string;
  thermostatsIssue?: string;
  leakSensorsIssue?: string;

  // Equipment Shipping
  equipmentNeedsShipping: 'Yes' | 'No' | string;
  equipmentToShip?: string;
  equipmentQuantityAndLocation?: string;
  shippingRecipient?: string;
  shippingPhone?: string;
  shippingEmail?: string;
  shippingMethod?: 'Ground' | '2 Day' | 'Overnight' | string;

  // Communication Preferences
  primaryContactMethod?: string;
  backupContactMethod?: string;
  checkInFrequency?: string;
  escalationContact?: string;

  // Dispatch details
  assignedTechName?: string;
  assignedTechEmail?: string;
  dispatchedAt?: string;
  dispatchedMessageId?: string;

  // Custom user-defined data tables
  customTables?: SOWCustomTable[];
}

export interface FieldTechContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  region: string;
}
