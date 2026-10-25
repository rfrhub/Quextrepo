export interface Phase1InfoItem {
  id: string;
  scope: string;
  configurationDetails: string;
  defaultStatus: 'Pending' | 'In Progress' | 'Verified';
  notesPlaceholder: string;
}

export interface PhaseCheckItem {
  id: string;
  title: string;
  description?: string;
  subBullets?: string[];
  stepGroup?: string;
  indent?: boolean;
}

export interface BrivoPdfChecklistData {
  title: string;
  phase1: {
    title: string;
    items: Phase1InfoItem[];
  };
  phase2: {
    title: string;
    items: PhaseCheckItem[];
  };
  phase3: {
    title: string;
    step1: {
      stepTitle: string;
      items: PhaseCheckItem[];
    };
    step2: {
      stepTitle: string;
      description: string;
      items: PhaseCheckItem[];
    };
    step3: {
      stepTitle: string;
      items: PhaseCheckItem[];
    };
  };
  phase4: {
    title: string;
    items: PhaseCheckItem[];
  };
}

export const BRIVO_PLATFORM_CHECKLIST: BrivoPdfChecklistData = {
  title: 'Brivo + Quext integration Checklist',
  phase1: {
    title: 'Phase 1: Pre-Integration Information Gathering',
    items: [
      {
        id: 'p1_fob_type',
        scope: 'Key Fob Type',
        configurationDetails: 'Verify selected key fobs (dualtech, tri-tech, etc.) are compatible with installed Brivo scanners.',
        defaultStatus: 'Pending',
        notesPlaceholder: 'Enter key fob format / tech notes...'
      },
      {
        id: 'p1_door_schedules',
        scope: 'Door Schedules',
        configurationDetails: 'Confirm specific door schedules built for residents and staff with property management.',
        defaultStatus: 'Pending',
        notesPlaceholder: 'Enter schedule details (e.g. 24/7 vs curfew)...'
      },
      {
        id: 'p1_access_rules',
        scope: 'General Access Rules',
        configurationDetails: 'Determine amenity door restrictions and staff 24/7 vs. scheduled access stipulations.',
        defaultStatus: 'Pending',
        notesPlaceholder: 'Enter amenity stipulations...'
      },
      {
        id: 'p1_elevator_control',
        scope: 'Elevator / Floor Control',
        configurationDetails: 'Verify elevator access model (single cab entry point vs. per-floor control).',
        defaultStatus: 'Pending',
        notesPlaceholder: 'Enter cab / floor control specs...'
      }
    ]
  },
  phase2: {
    title: 'Phase 2: External Setup (Customer, Brivo Reseller & Brivo)',
    items: [
      {
        id: 'p2_api_quoting',
        title: 'API Tier Quoting',
        description: 'Reseller quotes API tier based on resident count and expected API calls.'
      },
      {
        id: 'p2_document_execution',
        title: 'Document Execution',
        description: 'Ownership group and reseller execute required agreement documents.'
      },
      {
        id: 'p2_api_key_gen',
        title: 'API Key Generation',
        description: 'Reseller submits request to Brivo API team; Brivo generates API key and sends it to reseller.'
      },
      {
        id: 'p2_admin_delegation',
        title: 'Admin Delegation',
        description: 'Reseller assigns both integration@onequext.com and david.robins@onequext.com as Administrators on the site.'
      },
      {
        id: 'p2_handoff_quext',
        title: 'Handoff to Quext',
        description: 'Reseller transmits API Key to Quext and confirms Administrator access is active.'
      }
    ]
  },
  phase3: {
    title: 'Phase 3: Internal Quext Technical Implementation',
    step1: {
      stepTitle: 'Step 1: API Entry & Provisioning',
      items: [
        {
          id: 'p3_s1_enter_api_key',
          title: 'Enter API Key',
          description: 'Engineering enters the provided API key into Quext.io.',
          subBullets: [
            'Settings → Smart Community → Brivo: enter API key here.'
          ]
        },
        {
          id: 'p3_s1_create_common_location',
          title: 'Create Common Area Location',
          description: 'Create new location(s) in Quext.io for common area Brivo doors.',
          subBullets: [
            'Note: Do not activate any groups at this stage. Doors can be assigned to groups prior to activation.'
          ]
        }
      ]
    },
    step2: {
      stepTitle: 'Step 2: Site Scrub Assessment',
      description: 'Check existing site state and scrub legacy data if required:',
      items: [
        {
          id: 'p3_s2_greenfield',
          title: 'Greenfield Integration',
          description: 'No scrub needed.'
        },
        {
          id: 'p3_s2_brownfield_quext',
          title: 'Brownfield (Pre-existing Quext)',
          description: 'No scrub needed.'
        },
        {
          id: 'p3_s2_brownfield_brivo',
          title: 'Brownfield (Pre-existing Brivo)',
          description: 'Requires full data scrub on Brivo site:'
        },
        {
          id: 'p3_s2_brownfield_report',
          title: 'Pull a complete report of all current users and credentials before performing scrub.',
          indent: true
        },
        {
          id: 'p3_s2_brownfield_delete',
          title: 'Delete all existing users, groups, schedules, and mobile passes from the Brivo site.',
          indent: true
        }
      ]
    },
    step3: {
      stepTitle: 'Step 3: Door Mapping & Phased Rollout',
      items: [
        {
          id: 'p3_s3_link_doors',
          title: 'Link Doors',
          description: 'Link Brivo doors to the newly created common area location(s) in Quext.io.'
        },
        {
          id: 'p3_s3_activate_first_group',
          title: 'Activate First Group',
          description: 'Activate group access one group at a time, starting with the group containing the smallest user count.'
        },
        {
          id: 'p3_s3_pacs_audit',
          title: 'PACS Transaction Audit',
          description: 'Open the PACS transaction screen and observe user additions into the Brivo door database.',
          subBullets: [
            'Validation: Confirm all users in the active group are populated successfully before proceeding to the next group.'
          ]
        },
        {
          id: 'p3_s3_sequential_rollout',
          title: 'Sequential Group Rollout',
          description: 'Repeat activation and verification for remaining user groups.'
        }
      ]
    }
  },
  phase4: {
    title: 'Phase 4: Validation & Sign-Off',
    items: [
      {
        id: 'p4_initial_testing',
        title: 'Initial System Testing',
        description: 'Test access flow starting with Property Manager and Staff user accounts.'
      },
      {
        id: 'p4_onsite_alignment',
        title: 'On-Site Alignment',
        description: 'Work with on-site property team to configure final preferences and turn on integration.'
      },
      {
        id: 'p4_completion_date',
        title: 'Completion Date',
        description: ''
      }
    ]
  }
};
