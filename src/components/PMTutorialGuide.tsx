import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  X,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Layers,
  Wrench,
  BookOpen,
  Calendar,
  Truck,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  Building2,
  Users,
  Compass,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { OperationProject } from '../types';

export interface TutorialNavigationTarget {
  portal: 'operations' | 'field-tech' | 'partner-academy' | 'salesHub';
  operationsMainTab?: 'home' | 'operations' | 'timeline' | 'quotes' | 'analysis';
  operationsSubTab?: string;
  projectDetailTab?: 'field-bom' | 'customer-comms' | 'customer-kickoff';
  fieldTechName?: 'Sean Gates' | 'Hector Lopez';
  partnerShortName?: string;
}

export interface TutorialStep {
  id: string;
  number: number;
  chapter: string;
  title: string;
  subtitle: string;
  targetDescription: string;
  navigation: TutorialNavigationTarget;
  overview: string;
  bulletPoints: {
    icon: string;
    label: string;
    description: string;
  }[];
  keyButtons: {
    label: string;
    actionDescription: string;
    highlightColor?: string;
  }[];
  proTip: string;
  whoIsThisFor?: string;
}

interface PMTutorialGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (target: TutorialNavigationTarget) => void;
  projects: OperationProject[];
  currentPortal: 'operations' | 'field-tech' | 'partner-academy' | 'salesHub';
  currentOperationsMainTab?: string;
  currentOperationsSubTab?: string;
}

export const PMTutorialGuide: React.FC<PMTutorialGuideProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
  projects,
  currentPortal,
  currentOperationsMainTab,
  currentOperationsSubTab,
}) => {
  const primaryProject = projects[0] || { id: '33om1u0TTgW3MYKO2FhH', propertyName: 'Cortland Old Fourth Ward' };

  const TUTORIAL_STEPS: TutorialStep[] = [
    {
      id: 'step-1-welcome',
      number: 1,
      chapter: '1. Role Overview',
      title: 'Welcome to Quext Operations! 🚀',
      subtitle: 'Your Core Mission as a Multi-Family IoT Project Manager',
      targetDescription: 'Operations Dashboard — Top Overview',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      overview:
        'As a Quext Project Manager, you lead the end-to-end rollout of smart IoT building systems—including Smart Deadbolts (BLE & Apple Wallet), Smart Thermostats (LoRaWAN), Gateways, and Water Leak Sensors—across entire apartment communities.',
      bulletPoints: [
        {
          icon: '✨',
          label: 'How Projects Originate',
          description:
            'When an opportunity in the myquext.com Sales Hub reaches "Deal Won", our automated provisioning instantly creates an active installation project in your Operations workspace with unit counts, BOM quantities, and financial budgets.',
        },
        {
          icon: '🎯',
          label: 'Your Primary Goal',
          description:
            'Guide every property through the 7 Operational Milestones on time and on budget, coordinating internal field tech leads, certified low-voltage integrators, and property ownership.',
        },
        {
          icon: '🤝',
          label: 'Cross-Functional Ecosystem',
          description:
            'You bridge Sales (upstream), Field Technicians & Integrators (on-site deployment), and Customer Success (post-install resident adoption).',
        },
      ],
      keyButtons: [
        {
          label: 'Operations (Top Tab)',
          actionDescription: 'Primary navigation tab in the top header housing your entire project execution engine.',
          highlightColor: 'bg-blue-50 text-blue-700 border-blue-200',
        },
        {
          label: 'User Profile Dropdown',
          actionDescription: 'Top-right avatar menu where this PM Tutorial, Workspace, and profile settings live.',
          highlightColor: 'bg-slate-50 text-slate-700 border-slate-200',
        },
      ],
      proTip:
        'Bookmark the Installation Overview dashboard! Most PMs start their morning here to check upcoming go-lives and inspect any project flagged as "At Risk".',
    },
    {
      id: 'step-2-subnav',
      number: 2,
      chapter: '2. Navigation Bar',
      title: 'The Operations Sub-Navigation Bar 🧭',
      subtitle: 'Mastering every sub-tab & toolbar action in your daily cockpit',
      targetDescription: 'Operations Workspace Sub-Navigation Toolbar',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      overview:
        'Inside the Operations tab, the horizontal sub-navigation bar is your mission control. It gives you 7 distinct views into your active deployment portfolio, plus one-click access to field tools.',
      bulletPoints: [
        {
          icon: '📊',
          label: 'Installation Overview',
          description:
            'Executive portfolio dashboard with KPI summary metrics, delivery countdowns, and the interactive Horizon Timeline.',
        },
        {
          icon: '📁',
          label: 'All Projects',
          description:
            'Searchable master directory of all property buildouts with status health indicators (On Track, At Risk, Blocked, Critical).',
        },
        {
          icon: '⚡',
          label: 'Kickoff Attention',
          description:
            'Priority queue showing newly won deals from Sales Hub that need immediate PM review and client kickoff call scheduling.',
        },
        {
          icon: '📡',
          label: 'Live Activity Hub',
          description:
            'Real-time streaming audit trail of field technician unit completions, photo uploads, shipping alerts, and PM notes.',
        },
        {
          icon: '📅',
          label: 'Installation Timeline',
          description:
            'High-level Gantt roadmap of ongoing installations, milestone target dates, and critical path dependencies.',
        },
        {
          icon: '💼',
          label: 'Quotes & Analysis',
          description:
            'Inspect upstream Sales Hub opportunities, track deal stage movements, and audit hardware BOM margins.',
        },
      ],
      keyButtons: [
        {
          label: 'Field Tech Portal (Button)',
          actionDescription:
            'Instantly switches to the on-site mobile interface used by Sean Gates and Hector Lopez to test or inspect field logs.',
          highlightColor: 'bg-sky-50 text-sky-800 border-sky-300',
        },
        {
          label: 'Reset (Button)',
          actionDescription:
            'Restores initial sample data at any time—perfect for new PM practice and demonstrations.',
          highlightColor: 'bg-slate-100 text-slate-700 border-slate-300',
        },
      ],
      proTip:
        'Use the search bar at the top (⌘K) to quickly jump to any property by name or city across the entire platform.',
    },
    {
      id: 'step-3-horizon-timeline',
      number: 3,
      chapter: '3. Executive Timeline',
      title: 'Installation Overview & Horizon Timeline ⏱️',
      subtitle: 'Executive-level milestone forecasting, countdowns & spotlight bar',
      targetDescription: 'Installation Overview — Upcoming Go Lives & Installs',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      overview:
        'The Installation Overview gives leadership and PMs a fast pulse on go-live commitments. It features dual viewing modes: the classic Cards View and the Executive Horizon Timeline.',
      bulletPoints: [
        {
          icon: '📈',
          label: 'Portfolio KPIs',
          description:
            'Four primary metric cards: Active Deployments, Hardware Units In-Flight, Total Contract Hardware Value, and Velocity Score.',
        },
        {
          icon: '🎯',
          label: 'Interactive Horizon Timeline Axis',
          description:
            'Groups projects into 4 time buckets: +7 Days (Critical/Immediate), +8 to +14 Days, +15 to +28 Days, and +29 Days & Beyond.',
        },
        {
          icon: '🔍',
          label: 'Spotlight Bar & Project Carousel (◀ 1 of N ▶)',
          description:
            'When multiple properties fall into the same delivery window, the spotlight bar lets you scroll through each project with left/right arrows and pills before clicking "Open Project".',
        },
        {
          icon: '🚀',
          label: 'Rollout Sequence Rail Button',
          description:
            'The detailed chronological countdown rail is cleanly minimized into a button on the timeline axis—click it whenever you want a full vertical breakdown!',
        },
      ],
      keyButtons: [
        {
          label: 'Timeline / Cards Toggle',
          actionDescription: 'Switches between the visual Horizon Timeline axis and standard card grids.',
          highlightColor: 'bg-blue-600 text-white border-blue-700',
        },
        {
          label: 'Open Project (Spotlight Bar)',
          actionDescription: 'Dives directly into the active project workspace from the timeline carousel.',
          highlightColor: 'bg-blue-600 text-white border-blue-700',
        },
      ],
      proTip:
        'Executive leadership uses the Horizon Timeline during Monday morning scrums to immediately spot projects in the "+7 Days" bucket.',
    },
    {
      id: 'step-4-all-projects',
      number: 4,
      chapter: '4. Project Directory',
      title: 'All Projects & Manual Project Creation 📋',
      subtitle: 'Filtering the portfolio, status health tags, and manual provisioning',
      targetDescription: 'All Projects Directory & Search',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'all-projects',
      },
      overview:
        'The All Projects tab lists every active and completed multi-family deployment. You can filter by status health, search by property or client, and manually spin up new projects.',
      bulletPoints: [
        {
          icon: '🏷️',
          label: 'Status Health Tags',
          description:
            'Each project has a visual health indicator: On Track (green), At Risk (amber), Blocked (red), or Critical Delay (rose). Keep these updated regularly!',
        },
        {
          icon: '🔍',
          label: 'Multi-Field Filtering',
          description:
            'Instantly search by property name, client (e.g. Cortland, Greystar, Trammell Crow), city, or assigned Project Manager.',
        },
        {
          icon: '➕',
          label: '+ Create Manual Project Button',
          description:
            'While most projects auto-provision from Sales Hub "Deal Won", use this button to create custom pilot rollouts, internal hardware staging, or non-CRM contracts.',
        },
      ],
      keyButtons: [
        {
          label: '+ Create Manual Project',
          actionDescription:
            'Opens the manual project creator modal with property address, unit count, and initial BOM defaults.',
          highlightColor: 'bg-blue-600 text-white border-blue-700',
        },
        {
          label: 'Project Row / Card Click',
          actionDescription: 'Clicking any project opens its comprehensive 360° Project Detail Workspace.',
          highlightColor: 'bg-slate-50 text-slate-800 border-slate-200',
        },
      ],
      proTip:
        'Click the "Kickoff Attention" sub-tab in the sub-nav whenever you want to see only newly won deals that need to be kicked off!',
    },
    {
      id: 'step-5-seven-milestones',
      number: 5,
      chapter: '5. The 7 Milestones',
      title: 'The 7 Milestones: End-to-End Project Flow 🏁',
      subtitle: 'From Deal Won to Project Closed: Every milestone, gate, and rule',
      targetDescription: `Project Detail Workspace (${primaryProject.propertyName}) — Milestone Tracker`,
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      overview:
        'Every Quext project follows strict operational governance consisting of 7 Sequential Milestones. Advancing milestones communicates progress to leadership and triggers automated customer emails.',
      bulletPoints: [
        {
          icon: '1️⃣',
          label: '1. Project Kickoff',
          description:
            'PM introduces team to property owners/GMs, reviews SOW, confirms installation dates, and presents the Customer Kickoff Walkthrough deck.',
        },
        {
          icon: '2️⃣',
          label: '2. Portal Buildout',
          description:
            'Digital twin created in Quext Cloud: configuring buildings, units, LoRaWAN gateways, smart locks, and staff access credentials.',
        },
        {
          icon: '3️⃣',
          label: '3. Product Acquisition',
          description:
            'Hardware procurement verified against BOM. Tracking freight pallet shipments at the Shipping Dock and confirming warehouse manifests.',
        },
        {
          icon: '4️⃣',
          label: '4. CSM Intro - Pre-implementation',
          description:
            'Property leadership is introduced to their assigned Customer Success Manager (e.g. Nicole Franklin) before install to schedule staff software training.',
        },
        {
          icon: '5️⃣',
          label: '5. Implementation',
          description:
            'Physical on-site deployment! Field Techs (Sean & Hector) and certified Integrators install smart deadbolts, thermostats, and sensors unit by unit.',
        },
        {
          icon: '6️⃣',
          label: '6. CSM Handoff (⚠️ 7-Day Auto-Close Rule)',
          description:
            'Post-install sign-off and staff training. Important: Projects on CSM Handoff automatically close after 7 days, transitioning into active CSM management!',
        },
        {
          icon: '7️⃣',
          label: '7. Project Closed',
          description:
            'Final acceptance certificate signed, billing finalized, warranty documentation archived. Project transitions into the Customer Success portfolio.',
        },
      ],
      keyButtons: [
        {
          label: 'Mark In Progress / Complete (Milestone)',
          actionDescription: 'Advances the active milestone state and records official completion timestamps.',
          highlightColor: 'bg-emerald-600 text-white border-emerald-700',
        },
        {
          label: 'Target Date Picker',
          actionDescription: 'Allows PM to adjust target milestone completion dates for schedule management.',
          highlightColor: 'bg-slate-100 text-slate-800 border-slate-300',
        },
      ],
      proTip:
        'Never skip "CSM Intro - Pre-implementation"! Scheduling the CSM early prevents post-install resident confusion and drastically speeds up project closure.',
    },
    {
      id: 'step-6-bom-table',
      number: 6,
      chapter: '6. Hardware BOM',
      title: 'Hardware Bill of Materials (BOM) Table 📦',
      subtitle: 'Tracking equipment quantities, model numbers, and live install counts',
      targetDescription: 'Project Workspace — Hardware BOM Table',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      overview:
        'The Hardware BOM table tracks every physical device required for the property. It syncs directly with the field tech mobile portal so you see installation progress in real time.',
      bulletPoints: [
        {
          icon: '🔐',
          label: 'Smart Deadbolt Locks',
          description:
            'Model QXT-DL-900 (BLE, Apple Wallet, NFC, physical key override). Quantities match residential unit count + common area doors.',
        },
        {
          icon: '🌡️',
          label: 'IoT Smart Thermostats',
          description:
            'Model QXT-TH-300 (LoRaWAN & C-Wire support). Controls HVAC energy efficiency for vacant and occupied units.',
        },
        {
          icon: '📡',
          label: 'LoRaWAN Gateways & Mesh Base Stations',
          description:
            'Outdoor/indoor commercial gateways mounted on rooftops and clubhouses providing long-range RF coverage across the property.',
        },
        {
          icon: '💧',
          label: 'Water Leak Detectors',
          description:
            'Sensors placed under water heaters and sinks to prevent catastrophic multi-unit flooding.',
        },
        {
          icon: '🔄',
          label: 'Live Installed Count Tally',
          description:
            'As technicians in the field mark units finished, the "Installed Count" column and progress bar update automatically!',
        },
      ],
      keyButtons: [
        {
          label: '+ Add BOM Item',
          actionDescription: 'Adds custom or supplemental hardware items (e.g. extra common area locks, antennas).',
          highlightColor: 'bg-blue-600 text-white border-blue-700',
        },
        {
          label: 'Installed Count Counter',
          actionDescription: 'Shows installed units vs total required units with a percentage completion bar.',
          highlightColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        },
      ],
      proTip:
        'Check the BOM table when ordering spares! Quext best practice is to order a 2% attic stock buffer for replacement parts.',
    },
    {
      id: 'step-7-shipping-dock',
      number: 7,
      chapter: '7. Logistics & Dock',
      title: 'Shipping Dock & Freight Logistics 🚚',
      subtitle: 'Carrier tracking, pallet manifests, and warehouse receipt confirmation',
      targetDescription: 'Project Workspace — Shipping Dock Section',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      overview:
        'The Shipping Dock section ensures hardware arrives safely on-site before installation crews mobilize. It tracks pallet freight carriers, tracking numbers, and delivery ETAs.',
      bulletPoints: [
        {
          icon: '📦',
          label: 'Pallet Manifests',
          description:
            'Pallets are broken down by category (Locks Pallet, Thermostats Pallet, Gateway Crates) with item counts and weights.',
        },
        {
          icon: '🚛',
          label: 'Freight Carriers',
          description:
            'Live integration with commercial carriers (FedEx Freight, Estes, Old Dominion, R+L Carriers) showing delivery tracking status.',
        },
        {
          icon: '📍',
          label: 'Delivery Stages',
          description:
            'Tracks progress through: Label Created → In Transit → Out for Delivery → Delivered & Signed.',
        },
        {
          icon: '✅',
          label: 'Dock Confirmation',
          description:
            'Once property management or the PM inspects the pallets, clicking "Confirm Delivery" updates the Product Acquisition milestone.',
        },
      ],
      keyButtons: [
        {
          label: 'Track Shipment (Carrier Link)',
          actionDescription: 'Opens live freight carrier tracking in a new tab.',
          highlightColor: 'bg-sky-50 text-sky-800 border-sky-300',
        },
        {
          label: 'Confirm Delivery',
          actionDescription: 'Confirms inventory has been received and verified on-site.',
          highlightColor: 'bg-emerald-600 text-white border-emerald-700',
        },
      ],
      proTip:
        'Always confirm shipping dock delivery before sending field technicians on-site to avoid costly mobilization downtime.',
    },
    {
      id: 'step-8-sow-mitigation',
      number: 8,
      chapter: '8. SOW & Mitigations',
      title: 'SOW Forecaster & Risk Mitigation 🛡️',
      subtitle: 'Trade labor budget forecasting, field installation logs, and risk controls',
      targetDescription: 'Project Workspace — SOW Forecaster & Mitigation Plan',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'field-bom',
      },
      overview:
        'Professional project management requires tight budget control and proactive risk management. This section equips you with labor forecasting and structured delay mitigation.',
      bulletPoints: [
        {
          icon: '⏱️',
          label: 'SOW Forecaster',
          description:
            'Estimates trade labor hours (low-voltage wiring, door boring, gateway mounting, QA testing) against budgeted contractor allocations.',
        },
        {
          icon: '📝',
          label: 'Field Installation Log',
          description:
            'Unit-by-unit audit trail where technicians log completed units, battery voltages, gateway signal strengths, and photo attachments.',
        },
        {
          icon: '🛡️',
          label: 'Risk Mitigation Plan Panel',
          description:
            'When supply chain delays, severe weather, or property access issues arise, use this panel to document root causes, contingency buffers, and corrective actions.',
        },
        {
          icon: '🔔',
          label: 'Notifications Dock Sync',
          description:
            'Any blocker logged in the field instantly pings the PM Right Notifications Dock so you can unblock the team immediately.',
        },
      ],
      keyButtons: [
        {
          label: 'Open Mitigation Plan',
          actionDescription: 'Expands the risk mitigation workflow and action item tracker.',
          highlightColor: 'bg-amber-50 text-amber-900 border-amber-300',
        },
        {
          label: 'Add Mitigation Action Item',
          actionDescription: 'Assigns contingency tasks and deadlines to recover delayed milestones.',
          highlightColor: 'bg-blue-600 text-white border-blue-700',
        },
      ],
      proTip:
        'If a project drops below 80% schedule velocity, open the Mitigation Plan and add a corrective recovery plan before the weekly client sync.',
    },
    {
      id: 'step-9-customer-comms',
      number: 9,
      chapter: '9. Customer Comms',
      title: 'Customer Comms & Kickoff Presentation 💬',
      subtitle: 'Automated milestone emails, Gmail dispatch, and executive slide deck',
      targetDescription: 'Project Workspace — Customer Communications Tab',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: primaryProject.id,
        projectDetailTab: 'customer-comms',
      },
      overview:
        'Transparent stakeholder communication builds trust. The Customer Comms tab provides ready-to-send milestone notification templates and an interactive presentation deck for client meetings.',
      bulletPoints: [
        {
          icon: '📧',
          label: 'Automated Stakeholder Emails',
          description:
            'Pre-drafted, professional emails customized with property name, unit count, and milestones for Kickoff, Shipping, Installation Start, and CSM Intro.',
        },
        {
          icon: '📨',
          label: 'Live Gmail Integration Modal',
          description:
            'Clicking "Send Update" opens a review modal allowing you to inspect recipients, CC property leadership, and send via Gmail in one click.',
        },
        {
          icon: '🖥️',
          label: 'Customer Kickoff Walkthrough Deck',
          description:
            'A presentation slide deck built directly into the app for presenting project scope, timelines, resident notices, and hardware benefits during the kickoff call.',
        },
      ],
      keyButtons: [
        {
          label: 'Customer Comms / Kickoff Walkthrough Tab',
          actionDescription: 'Toggles between Internal PM Technical View and Customer Communications mode.',
          highlightColor: 'bg-amber-100 text-amber-900 border-amber-300',
        },
        {
          label: 'Send Update (Gmail Modal)',
          actionDescription: 'Triggers the live email dispatch workflow for property stakeholders.',
          highlightColor: 'bg-blue-600 text-white border-blue-700',
        },
        {
          label: 'Launch Kickoff Walkthrough',
          actionDescription: 'Enters full-screen client presentation mode with slide navigation.',
          highlightColor: 'bg-purple-600 text-white border-purple-700',
        },
      ],
      proTip:
        'Conduct your kickoff meeting directly inside the "Customer Kickoff Walkthrough" tab! Property owners love seeing the interactive timeline and resident flyer templates.',
    },
    {
      id: 'step-10-field-tech-portal',
      number: 10,
      chapter: '10. Field Tech Portal',
      title: 'The Field Tech Portal: For Sean Gates & Hector Lopez 🛠️',
      subtitle: 'Who this is for, on-site mobile unit checklists, and real-time sync',
      targetDescription: 'Field Tech Portal (Sean Gates / Hector Lopez)',
      navigation: {
        portal: 'field-tech',
        fieldTechName: 'Sean Gates',
      },
      whoIsThisFor: 'Quext On-Site Field Installation Technicians (Sean Gates & Hector Lopez)',
      overview:
        'This portal is specially designed for our on-site field technicians—Sean Gates and Hector Lopez. When walking hallways with a phone or tablet, they need a fast, durable mobile tool without heavy PM dashboards.',
      bulletPoints: [
        {
          icon: '👷',
          label: 'Who Uses This Portal?',
          description:
            'Sean Gates and Hector Lopez, our lead field technicians physically deploying hardware on-site at the property.',
        },
        {
          icon: '📱',
          label: 'Mobile-Optimized Unit Checklist',
          description:
            'Fast building/floor/unit selector (e.g. Building A, Floor 2, Unit 204) with large, touch-friendly hardware status toggles.',
        },
        {
          icon: '⚡',
          label: 'Rapid Hardware Logging',
          description:
            'One tap marks Smart Deadbolt, Thermostat, or Gateway as "Installed". Technicians scan serial numbers and log battery voltages.',
        },
        {
          icon: '⚠️',
          label: 'Blocker & Issue Reporting',
          description:
            'Allows techs to instantly flag blockers (e.g. "Resident dog inside", "Deadbolt bore hole misaligned", "Thermostat missing C-wire") with photo evidence.',
        },
        {
          icon: '🔄',
          label: 'Instant Sync with PM Dashboard',
          description:
            'Every install marked by Sean or Hector instantly increments your BOM installed tally, updates velocity metrics, and triggers activity dock notifications!',
        },
      ],
      keyButtons: [
        {
          label: 'Technician Switcher (Sean Gates / Hector Lopez)',
          actionDescription: 'Toggles active technician context and views their personal assigned route.',
          highlightColor: 'bg-white text-slate-800 border-slate-300',
        },
        {
          label: 'Log Installation / Report Blocker',
          actionDescription: 'Submits field update directly into the project activity stream.',
          highlightColor: 'bg-blue-600 text-white border-blue-700',
        },
        {
          label: 'Exit to Operations (Top Left)',
          actionDescription: 'Returns from Field Tech mode back to the myquext.com Operations Workspace.',
          highlightColor: 'bg-slate-800 text-white border-slate-900',
        },
      ],
      proTip:
        'As a PM, you can toggle into the Field Tech Portal anytime to test what your field leads see or quickly review Sean and Hector’s route!',
    },
    {
      id: 'step-11-partner-academy',
      number: 11,
      chapter: '11. Partner Academy',
      title: 'Partner Academy Portal: For Integrator Partners 🎓',
      subtitle: 'Who this is for, low-voltage certifications, and prep bundles',
      targetDescription: 'Quext Partner Training & Certification Academy (SKBM Smart Tech)',
      navigation: {
        portal: 'partner-academy',
        partnerShortName: 'SKBM',
      },
      whoIsThisFor: 'Third-Party Low-Voltage Integrator Partners (SKBM, Cortland In-House, Nationwide Cabling, etc.)',
      overview:
        'The Partner Academy Portal is a dedicated, secure training environment for third-party low-voltage subcontracting firms. External partners must complete Quext hardware certification before stepping onto a job site.',
      bulletPoints: [
        {
          icon: '🏢',
          label: 'Who Uses This Portal?',
          description:
            'Subcontracted installation crews such as SKBM Smart Tech, Cortland In-House Crew, Nationwide Cabling, and Bridge IoT.',
        },
        {
          icon: '🔒',
          label: 'Why is it Completely Separate?',
          description:
            'Integrators are external contractors. They must NOT have access to internal myquext.com systems, company profit margins, internal PM notes, or other clients’ proprietary data.',
        },
        {
          icon: '📚',
          label: 'Product Certification Curriculum',
          description:
            'Interactive video courses, wiring simulators, and quizzes covering Quext Smart Deadbolts, LoRaWAN Gateway RF placement, and Thermostat C-wire requirements.',
        },
        {
          icon: '📦',
          label: 'Project Low-Voltage Prep Bundles',
          description:
            'Integrators download property-specific prep bundles with architectural wiring schematics, door prep templates, and RF coverage heat maps.',
        },
        {
          icon: '🎖️',
          label: 'Certified Installer Badges',
          description:
            'Passing the curriculum awards verified installer credentials. As PM, you verify partner certification before approving on-site work.',
        },
      ],
      keyButtons: [
        {
          label: 'Course Modules & Quizzes',
          actionDescription: 'Opens interactive training modules and electrical wiring simulators.',
          highlightColor: 'bg-blue-600 text-white border-blue-700',
        },
        {
          label: 'Project Prep Bundle (Download / View)',
          actionDescription: 'Accesses technical low-voltage blueprints for specific assigned properties.',
          highlightColor: 'bg-emerald-600 text-white border-emerald-700',
        },
        {
          label: 'Exit to Operations (Top Left)',
          actionDescription: 'Returns from the Partner Academy back to the internal Operations Workspace.',
          highlightColor: 'bg-slate-900 text-white border-slate-950',
        },
      ],
      proTip:
        'On each project page in Operations, look for the "Integrator Partner Badge". It shows whether your subcontractor’s technicians have completed their certification courses!',
    },
    {
      id: 'step-12-graduation',
      number: 12,
      chapter: '12. Daily PM Rhythm',
      title: 'Tutorial Complete: Your Daily PM Rhythm 🏆',
      subtitle: 'Summary cheat sheet, morning routine, and key contacts',
      targetDescription: 'Operations Workspace — Full Portfolio Command',
      navigation: {
        portal: 'operations',
        operationsMainTab: 'operations',
        operationsSubTab: 'dashboard',
      },
      overview:
        'Congratulations! You now have a comprehensive understanding of the entire Quext Operations platform, project lifecycle, field technician tools, and integrator partner governance.',
      bulletPoints: [
        {
          icon: '☀️',
          label: 'Morning Check (08:30)',
          description:
            'Open Installation Overview. Check the Horizon Timeline "+7 Days" bucket and review projects with "At Risk" or "Critical Delay" status tags.',
        },
        {
          icon: '📬',
          label: 'Mid-Morning (10:00)',
          description:
            'Check "Kickoff Attention" for newly won deals from Sales Hub. Schedule kickoff calls and send the Customer Kickoff Walkthrough deck.',
        },
        {
          icon: '🚚',
          label: 'Logistics Audit (13:00)',
          description:
            'Review Shipping Dock pallet tracking. Confirm deliveries before mobilizing installation crews.',
        },
        {
          icon: '🛠️',
          label: 'Field Coordination (15:00)',
          description:
            'Check live install counts from Sean Gates and Hector Lopez. Resolve any blockers reported in the right notifications dock.',
        },
        {
          icon: '🤝',
          label: 'CSM Handoff Rule',
          description:
            'Ensure property teams meet their assigned CSM early. Remember: projects on CSM Handoff automatically close after 7 days.',
        },
      ],
      keyButtons: [
        {
          label: 'Profile Dropdown → PM Onboarding Tutorial',
          actionDescription: 'You can re-launch this interactive tutorial anytime right below Workspace in your profile menu!',
          highlightColor: 'bg-blue-50 text-blue-700 border-blue-200',
        },
        {
          label: 'Restart Tutorial (Button)',
          actionDescription: 'Resets back to Step 1 whenever you want a refresher.',
          highlightColor: 'bg-slate-100 text-slate-700 border-slate-300',
        },
      ],
      proTip:
        'Keep the Right Notifications Dock open on the side of your screen during the day—it delivers real-time audio and visual alerts when technicians complete hardware installs!',
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quext_pm_tutorial_step');
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < TUTORIAL_STEPS.length) {
          return idx;
        }
      }
    } catch {
      // ignore
    }
    return 0;
  });

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showChapterMenu, setShowChapterMenu] = useState<boolean>(false);

  const activeStep = TUTORIAL_STEPS[currentStepIndex];

  // Save current step to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quext_pm_tutorial_step', currentStepIndex.toString());
    } catch {
      // ignore
    }
  }, [currentStepIndex]);

  // Handle step change and automatic view navigation
  const goToStep = (index: number) => {
    const targetIndex = Math.max(0, Math.min(index, TUTORIAL_STEPS.length - 1));
    setCurrentStepIndex(targetIndex);
    const targetStep = TUTORIAL_STEPS[targetIndex];
    onNavigateToView(targetStep.navigation);
  };

  const handleNext = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleRestart = () => {
    goToStep(0);
  };

  // If tutorial is not open, do not render
  if (!isOpen) return null;

  // Render Minimized Floating Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl border-2 border-white cursor-pointer transition-transform hover:scale-105"
        >
          <GraduationCap className="w-5 h-5" />
          <div className="text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
              PM Tutorial • Step {activeStep.number}/{TUTORIAL_STEPS.length}
            </div>
            <div className="text-xs font-semibold truncate max-w-[180px]">
              {activeStep.title}
            </div>
          </div>
          <Maximize2 className="w-4 h-4 ml-1 opacity-80" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-end sm:justify-end p-3 sm:p-6">
      {/* Floating Interactive Guide Dock */}
      <div className="pointer-events-auto w-full max-w-[540px] max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-blue-200/90 overflow-hidden ring-1 ring-black/10">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/50 text-blue-100">
                  PM Training Guide
                </span>
                <span className="text-xs font-bold text-amber-300 tabular-nums">
                  Step {activeStep.number} of {TUTORIAL_STEPS.length}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white truncate">
                {activeStep.chapter}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Chapter Jump Menu Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowChapterMenu((v) => !v)}
                title="View All Chapters"
                className="px-2 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Index</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showChapterMenu ? 'rotate-90' : ''}`} />
              </button>

              {/* Chapters Dropdown */}
              {showChapterMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowChapterMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-40 text-slate-800 divide-y divide-slate-100">
                    <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Tutorial Chapters &amp; Flow
                    </div>
                    {TUTORIAL_STEPS.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setShowChapterMenu(false);
                          goToStep(idx);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-2 hover:bg-blue-50 transition-colors cursor-pointer ${
                          idx === currentStepIndex ? 'bg-blue-50/80 font-bold text-blue-700' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">
                          {s.number}. {s.title.replace(/[\uD800-\uDFFF].*/, '')}
                        </span>
                        {idx === currentStepIndex && (
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Minimize */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              title="Minimize guide"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              title="Close Tutorial"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full shrink-0">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Target View Breadcrumb Pill */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
              Live View:
            </span>
            <span className="font-bold text-blue-700 truncate">
              {activeStep.targetDescription}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToView(activeStep.navigation)}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            title="Auto-navigate screen to this step view"
          >
            <span>Sync View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Scrollable Step Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-slate-800 text-xs">
          
          {/* Title & Subtitle */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {activeStep.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {activeStep.subtitle}
            </p>
          </div>

          {/* Who is this for Callout (especially for Field Tech & Partner Academy) */}
          {activeStep.whoIsThisFor && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2.5">
              <Users className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                  Audience &amp; Governance
                </span>
                <p className="text-xs font-semibold text-purple-950 mt-0.5">
                  {activeStep.whoIsThisFor}
                </p>
              </div>
            </div>
          )}

          {/* Overview text */}
          <p className="text-xs leading-relaxed text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            {activeStep.overview}
          </p>

          {/* Bullet Points / What it does */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Key Concepts &amp; Workflow:</span>
            </h4>
            <div className="space-y-2">
              {activeStep.bulletPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base shrink-0 leading-none mt-0.5">
                    {item.icon}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-600 leading-relaxed block mt-0.5">
                      {item.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Key Buttons Do */}
          {activeStep.keyButtons && activeStep.keyButtons.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Buttons &amp; Actions to Learn:
              </h4>
              <div className="space-y-1.5">
                {activeStep.keyButtons.map((btn, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 text-xs"
                  >
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] shrink-0 border ${
                        btn.highlightColor || 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      {btn.label}
                    </span>
                    <span className="text-[11px] text-slate-600 text-right leading-tight">
                      {btn.actionDescription}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pro Tip Box */}
          <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-800 text-[11px] uppercase tracking-wider block">
                PM Pro-Tip:
              </span>
              <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed font-medium">
                {activeStep.proTip}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRestart}
              title="Restart Tutorial"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-400">
              {currentStepIndex + 1} / {TUTORIAL_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={handlePrev}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                currentStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                  : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{currentStepIndex === TUTORIAL_STEPS.length - 1 ? 'Finish & Graduate' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
