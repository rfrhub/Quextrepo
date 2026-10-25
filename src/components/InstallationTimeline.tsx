import React, { useState, useMemo, useEffect } from 'react';
import {
  OperationProject,
  ProjectStatusTag,
  BOMCategory,
  InstallLogEntry,
  calculateProjectScheduleHealth,
  normalizeFieldTech,
  getProjectIntegratorPartners,
  getAllIntegratorPartners,
} from '../types';
import {
  INSTALLATION_CALENDAR_ID,
  CalendarInstallationEventInput,
  SyncedCalendarEventResult,
  syncInstallationEventsToCalendar,
  subscribeToGmailAuth,
} from '../services/gmailService';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  Calendar,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  ExternalLink,
  Search,
  Check,
  ChevronRight,
  Briefcase,
  Wrench,
  Sparkles,
  Plus,
  X,
  Filter,
  CheckCircle,
  Smartphone,
  Radio,
  DoorOpen,
  Thermometer,
  Layers,
  BarChart3,
  ListFilter,
  RefreshCw,
  ChevronLeft,
  LayoutGrid,
  CalendarDays,
} from 'lucide-react';

interface InstallationTimelineProps {
  projects: OperationProject[];
  onSelectProject: (projectId: string) => void;
  onOpenCustomerKickoff?: (projectId: string) => void;
  onUpdateProject?: (project: OperationProject) => void;
}

type TimelinePerspective = 'quarterly-schedule' | 'monthly-schedule' | 'daily-tracker' | 'schedule-locations';
type ScheduleYear = '2026' | '2027' | '2028' | 'all';
type MonthlySubView = '12-month-grid' | 'calendar-grid';

interface FuturePipelineProject {
  id: string;
  propertyName: string;
  clientName: string;
  city: string;
  state: string;
  unitsCount: number;
  devicesCount: number;
  year: number;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  quarterLabel: string;
  targetDate: string;
  assignedPM: string;
  crewName: string;
  status: 'Scheduled Pipeline' | 'Contracted Phase' | 'Site Staged';
  scopeNotes: string;
}

export const InstallationTimeline: React.FC<InstallationTimelineProps> = ({
  projects,
  onSelectProject,
  onOpenCustomerKickoff,
  onUpdateProject,
}) => {
  const [perspective, setPerspective] = useState<TimelinePerspective>('quarterly-schedule');
  const [selectedYear, setSelectedYear] = useState<ScheduleYear>('2026');
  const [monthlyYear, setMonthlyYear] = useState<'2026' | '2027' | '2028'>('2026');
  const [monthlySubView, setMonthlySubView] = useState<MonthlySubView>('12-month-grid');
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedCalendarDayDate, setSelectedCalendarDayDate] = useState<string | null>('2026-10-22');
  const [showOnlyActiveMonths, setShowOnlyActiveMonths] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pmFilter, setPmFilter] = useState<string>('all');
  const [integratorFilter, setIntegratorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allAvailableIntegrators = useMemo(() => getAllIntegratorPartners(projects), [projects]);

  // Daily Tracker specific filters and state
  const [trackerPropertyFilter, setTrackerPropertyFilter] = useState<string>('all');
  const [trackerCategoryFilter, setTrackerCategoryFilter] = useState<string>('all');
  const [isDailyLogModalOpen, setIsDailyLogModalOpen] = useState<boolean>(false);

  // New Daily Log Form State
  const [newLogProjectId, setNewLogProjectId] = useState<string>(projects[0]?.id || '');
  const [newLogDate, setNewLogDate] = useState<string>('2026-10-22');
  const [newLogInstaller, setNewLogInstaller] = useState<string>('Field Crew Alpha - Marcus & Dave');
  const [newLogCategory, setNewLogCategory] = useState<BOMCategory>('Smart Access Control');
  const [newLogUnits, setNewLogUnits] = useState<number>(24);
  const [newLogLocation, setNewLogLocation] = useState<string>('Building 1 - 2nd Floor (Units 201-224)');
  const [newLogNotes, setNewLogNotes] = useState<string>('Mortise locks aligned, latch clearances checked, online verified.');

  // Long-range pipeline installations for 2027 and 2028
  const futurePipeline: FuturePipelineProject[] = useMemo(
    () => [
      {
        id: 'fp-2027-q1',
        propertyName: 'Broadstone Waterfront (Tower B Expansion)',
        clientName: 'Alliance Residential Company',
        city: 'Phoenix',
        state: 'AZ',
        unitsCount: 220,
        devicesCount: 880,
        year: 2027,
        quarter: 'Q1',
        quarterLabel: 'Q1 2027 (Jan - Mar)',
        targetDate: '2027-03-20',
        assignedPM: 'Raul Recalde',
        crewName: 'Alliance Sub-Tier 1 / Field Crew Beta',
        status: 'Contracted Phase',
        scopeNotes: 'Tower B smart lock mortise integration and 4 rooftop LoRaWAN gateways.',
      },
      {
        id: 'fp-2027-q2',
        propertyName: 'The Moderne Phase II Lofts',
        clientName: 'Greystar Real Estate Partners',
        city: 'Dallas',
        state: 'TX',
        unitsCount: 160,
        devicesCount: 640,
        year: 2027,
        quarter: 'Q2',
        quarterLabel: 'Q2 2027 (Apr - Jun)',
        targetDate: '2027-06-15',
        assignedPM: 'Megan Rossman',
        crewName: 'Quext Premier Field Ops',
        status: 'Scheduled Pipeline',
        scopeNotes: 'Luxury finishings, Honeywell T6 Pro thermostats & 14 common area access readers.',
      },
      {
        id: 'fp-2027-q3',
        propertyName: 'Lumina Park North Campus',
        clientName: 'Lincoln Property Company',
        city: 'Austin',
        state: 'TX',
        unitsCount: 310,
        devicesCount: 1240,
        year: 2027,
        quarter: 'Q3',
        quarterLabel: 'Q3 2027 (Jul - Sep)',
        targetDate: '2027-09-28',
        assignedPM: 'Bethany Condon',
        crewName: 'Lonestar Smart Installers',
        status: 'Scheduled Pipeline',
        scopeNotes: 'Full property LoRaWAN mesh riser, garage perimeter readers, and clubhouse pool gates.',
      },
      {
        id: 'fp-2027-q4',
        propertyName: 'Solstice Northline Retail & Lofts',
        clientName: 'Trammell Crow Residential',
        city: 'Houston',
        state: 'TX',
        unitsCount: 180,
        devicesCount: 720,
        year: 2027,
        quarter: 'Q4',
        quarterLabel: 'Q4 2027 (Oct - Dec)',
        targetDate: '2027-11-18',
        assignedPM: 'Raul Recalde',
        crewName: 'Gulf Coast Low Voltage',
        status: 'Contracted Phase',
        scopeNotes: 'Mixed-use residential above retail, elevator floor access dispatchers & unit locks.',
      },
      {
        id: 'fp-2028-q1',
        propertyName: 'Greystar Mountain West Portfolio - Wave 1',
        clientName: 'Greystar Real Estate Partners',
        city: 'Denver',
        state: 'CO',
        unitsCount: 450,
        devicesCount: 1800,
        year: 2028,
        quarter: 'Q1',
        quarterLabel: 'Q1 2028 (Jan - Mar)',
        targetDate: '2028-03-30',
        assignedPM: 'Bethany Condon',
        crewName: 'Mile High IoT Deployments',
        status: 'Scheduled Pipeline',
        scopeNotes: 'Cold weather tested thermostats, LoRaWAN gateways, smart entry locks across 3 towers.',
      },
      {
        id: 'fp-2028-q2',
        propertyName: 'Avalon Reserve Heights',
        clientName: 'AvalonBay Communities',
        city: 'Salt Lake City',
        state: 'UT',
        unitsCount: 280,
        devicesCount: 1120,
        year: 2028,
        quarter: 'Q2',
        quarterLabel: 'Q2 2028 (Apr - Jun)',
        targetDate: '2028-06-25',
        assignedPM: 'Megan Rossman',
        crewName: 'Wasatch Smart Subcontractors',
        status: 'Scheduled Pipeline',
        scopeNotes: 'Substantial new construction build, centralized MDF riser & amenity access locks.',
      },
      {
        id: 'fp-2028-q3',
        propertyName: 'Starwood Residential Wave 3 Retrofit',
        clientName: 'Starwood Capital Group',
        city: 'Atlanta',
        state: 'GA',
        unitsCount: 520,
        devicesCount: 2080,
        year: 2028,
        quarter: 'Q3',
        quarterLabel: 'Q3 2028 (Jul - Sep)',
        targetDate: '2028-09-15',
        assignedPM: 'Raul Recalde',
        crewName: 'Southeast Smart Installation Team',
        status: 'Contracted Phase',
        scopeNotes: 'Large portfolio retrofit from mechanical keys to Quext LoRaWAN mortise locks.',
      },
      {
        id: 'fp-2028-q4',
        propertyName: 'Cortland Gateway Smart District',
        clientName: 'Cortland Partners',
        city: 'Charlotte',
        state: 'NC',
        unitsCount: 390,
        devicesCount: 1560,
        year: 2028,
        quarter: 'Q4',
        quarterLabel: 'Q4 2028 (Oct - Dec)',
        targetDate: '2028-12-05',
        assignedPM: 'Bethany Condon',
        crewName: 'Carolina Low Voltage Techs',
        status: 'Scheduled Pipeline',
        scopeNotes: 'Master planned campus, perimeter gate integration, 390 smart thermostats & smart locks.',
      },
    ],
    []
  );

  // Filter active projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const health = calculateProjectScheduleHealth(p.targetCompletionDate, p.statusTag, p.milestones, p.notes);
      const matchesStatus = statusFilter === 'all' || health.effectiveTag === statusFilter;
      const matchesPM = pmFilter === 'all' || p.assignedPM.name === pmFilter;
      const partners = getProjectIntegratorPartners(p);
      const matchesIntegrator = integratorFilter === 'all' || partners.includes(integratorFilter);
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partners.some((partner) => partner.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesPM && matchesIntegrator && matchesSearch;
    });
  }, [projects, statusFilter, pmFilter, integratorFilter, searchQuery]);

  // Aggregate all daily installation logs across active projects
  const allDailyLogs = useMemo(() => {
    interface UnifiedDailyLog extends InstallLogEntry {
      propertyName: string;
      projectCity: string;
      projectState: string;
      pmName: string;
      category: string;
    }

    const logs: UnifiedDailyLog[] = [];
    const seenLogIds = new Set<string>();

    // 1. Logs from project.installLogs
    projects.forEach((proj) => {
      (proj.installLogs || []).forEach((entry) => {
        if (!seenLogIds.has(entry.id)) {
          seenLogIds.add(entry.id);
          const bomItem = proj.bomItems.find((b) => b.id === entry.itemId);
          logs.push({
            ...entry,
            propertyName: proj.propertyName,
            projectCity: proj.city,
            projectState: proj.state,
            pmName: proj.assignedPM.name,
            category: bomItem?.category || 'Smart Access Control',
          });
        }
      });

      // 2. Post-it logs on individual BOM items
      proj.bomItems.forEach((item) => {
        (item.postItLogs || []).forEach((entry) => {
          if (!seenLogIds.has(entry.id)) {
            seenLogIds.add(entry.id);
            logs.push({
              ...entry,
              propertyName: proj.propertyName,
              projectCity: proj.city,
              projectState: proj.state,
              pmName: proj.assignedPM.name,
              category: item.category,
            });
          }
        });
      });
    });

    // Provide default baseline field activities if empty so the tracker is active and informative
    if (logs.length === 0) {
      const mockDates = ['2026-10-22', '2026-10-21', '2026-10-20', '2026-10-19', '2026-10-18'];
      projects.forEach((p, pIdx) => {
        logs.push({
          id: `sample-log-${p.id}-1`,
          projectId: p.id,
          timestamp: mockDates[pIdx % mockDates.length],
          installerName: p.communityDetails?.subcontractorCompany || 'Field Crew Alpha - Marcus & Dave',
          itemId: p.bomItems[0]?.id || 'item-1',
          itemName: 'Smart Access Deadbolt & Mortise Lock',
          category: 'Smart Access Control',
          quantityCompleted: 24,
          locationCompleted: `Building ${pIdx + 1} - 2nd Floor (Units 201-224)`,
          statusCheck: 'Verified & Online',
          notes: 'Standard mortise fit, latch clearance verified, lock synced with gateway.',
          propertyName: p.propertyName,
          projectCity: p.city,
          projectState: p.state,
          pmName: p.assignedPM.name,
        });
        logs.push({
          id: `sample-log-${p.id}-2`,
          projectId: p.id,
          timestamp: mockDates[(pIdx + 1) % mockDates.length],
          installerName: 'Precision Low-Voltage Techs',
          itemId: p.bomItems[1]?.id || 'item-2',
          itemName: 'Smart Thermostat',
          category: 'Smart Thermostats & HVAC',
          quantityCompleted: 18,
          locationCompleted: `Building ${pIdx + 1} - 1st Floor (Units 101-118)`,
          statusCheck: 'Verified & Online',
          notes: 'C-wire checked, 24VAC active, calibrated temperature offset.',
          propertyName: p.propertyName,
          projectCity: p.city,
          projectState: p.state,
          pmName: p.assignedPM.name,
        });
      });
    }

    // Sort descending by timestamp
    return logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
  }, [projects]);

  // Filter daily logs
  const filteredDailyLogs = useMemo(() => {
    return allDailyLogs.filter((log) => {
      const matchesProperty = trackerPropertyFilter === 'all' || log.projectId === trackerPropertyFilter;
      const matchesCategory = trackerCategoryFilter === 'all' || log.category === trackerCategoryFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        log.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.installerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.locationCompleted.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.notes && log.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesProperty && matchesCategory && matchesSearch;
    });
  }, [allDailyLogs, trackerPropertyFilter, trackerCategoryFilter, searchQuery]);

  // Helper to determine quarter for 2026 active projects
  const getProjectQuarter = (dateStr: string): { quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'; year: number } => {
    const d = new Date(dateStr);
    const year = isNaN(d.getFullYear()) ? 2026 : d.getFullYear();
    const month = isNaN(d.getMonth()) ? 9 : d.getMonth(); // 0-indexed
    if (month < 3) return { quarter: 'Q1', year };
    if (month < 6) return { quarter: 'Q2', year };
    if (month < 9) return { quarter: 'Q3', year };
    return { quarter: 'Q4', year };
  };

  // Safe helper to extract month, day, and year without returning NaN
  const parseLogDateBadge = (timestampStr?: string): { month: string; day: string; year: string } => {
    if (!timestampStr) return { month: 'OCT', day: '22', year: '2026' };

    // Format 1: starts with YYYY-MM-DD
    const ymdMatch = timestampStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (ymdMatch) {
      const year = ymdMatch[1];
      const monthNum = parseInt(ymdMatch[2], 10);
      const dayNum = parseInt(ymdMatch[3], 10);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return {
        month: months[monthNum - 1] || 'OCT',
        day: !isNaN(dayNum) ? String(dayNum) : '22',
        year: year || '2026',
      };
    }

    // Format 2: Direct Date parse without string concatenation
    const d = new Date(timestampStr);
    if (!isNaN(d.getTime())) {
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const day = d.getDate();
      const year = d.getFullYear();
      return {
        month: month || 'OCT',
        day: !isNaN(day) ? String(day) : '22',
        year: !isNaN(year) ? String(year) : '2026',
      };
    }

    return { month: 'OCT', day: '22', year: '2026' };
  };

  // Group projects by quarter for each year
  const quarterlyData = useMemo(() => {
    // 2026 data based on active projects
    const q2026 = {
      Q1: [] as OperationProject[],
      Q2: [] as OperationProject[],
      Q3: [] as OperationProject[],
      Q4: [] as OperationProject[],
    };

    projects.forEach((p) => {
      const target = getProjectQuarter(p.targetCompletionDate || p.startDate);
      if (target.quarter === 'Q1') q2026.Q1.push(p);
      else if (target.quarter === 'Q2') q2026.Q2.push(p);
      else if (target.quarter === 'Q3') q2026.Q3.push(p);
      else q2026.Q4.push(p);
    });

    // 2027 and 2028 data from future pipeline
    const q2027 = {
      Q1: futurePipeline.filter((f) => f.year === 2027 && f.quarter === 'Q1'),
      Q2: futurePipeline.filter((f) => f.year === 2027 && f.quarter === 'Q2'),
      Q3: futurePipeline.filter((f) => f.year === 2027 && f.quarter === 'Q3'),
      Q4: futurePipeline.filter((f) => f.year === 2027 && f.quarter === 'Q4'),
    };

    const q2028 = {
      Q1: futurePipeline.filter((f) => f.year === 2028 && f.quarter === 'Q1'),
      Q2: futurePipeline.filter((f) => f.year === 2028 && f.quarter === 'Q2'),
      Q3: futurePipeline.filter((f) => f.year === 2028 && f.quarter === 'Q3'),
      Q4: futurePipeline.filter((f) => f.year === 2028 && f.quarter === 'Q4'),
    };

    return { q2026, q2027, q2028 };
  }, [projects, futurePipeline]);

  // Month names & metadata
  const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ] as const;

  const MONTH_SHORT_NAMES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ] as const;

  interface MonthlyInstallEvent {
    id: string;
    projectId?: string;
    propertyName: string;
    clientName: string;
    city: string;
    state: string;
    date: string; // YYYY-MM-DD
    year: number;
    monthIndex: number; // 0-11
    dayOfMonth: number;
    eventCategory:
      | 'Implementation Install'
      | 'Target Completion'
      | 'CSM Go-Live'
      | 'Project Kickoff'
      | 'SOW Scope'
      | 'Daily Field Log'
      | 'Pipeline Target';
    title: string;
    subtitle: string;
    unitsCount: number;
    devicesCount: number;
    installedDevicesCount: number;
    assignedPM: string;
    fieldTech: string;
    integrators: string[];
    healthTag?: ProjectStatusTag;
    pipelineStatus?: string;
  }

  // Build unified monthly installation events across filteredProjects, SOW scopes, daily logs, and futurePipeline
  const allMonthlyEvents = useMemo<MonthlyInstallEvent[]>(() => {
    const events: MonthlyInstallEvent[] = [];

    const parseYMD = (dateStr?: string): { year: number; monthIndex: number; day: number; normalized: string } | null => {
      if (!dateStr) return null;
      const match = dateStr.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        const y = parseInt(match[1], 10);
        const m = parseInt(match[2], 10) - 1;
        const d = parseInt(match[3], 10);
        if (!isNaN(y) && m >= 0 && m <= 11 && d >= 1 && d <= 31) {
          return {
            year: y,
            monthIndex: m,
            day: d,
            normalized: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
          };
        }
      }
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear();
        const m = parsed.getMonth();
        const d = parsed.getDate();
        return {
          year: y,
          monthIndex: m,
          day: d,
          normalized: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        };
      }
      return null;
    };

    // 1. Active filtered projects
    filteredProjects.forEach((proj) => {
      const health = calculateProjectScheduleHealth(
        proj.targetCompletionDate,
        proj.statusTag,
        proj.milestones,
        proj.notes
      );
      const totalQuoted = proj.bomItems.reduce((acc, b) => acc + b.quantity, 0);
      const totalInst = proj.bomItems.reduce((acc, b) => acc + b.installedCount, 0);
      const integrators = getProjectIntegratorPartners(proj);
      const fieldTech = normalizeFieldTech(proj.assignedFieldTech);

      // Project Start / Kickoff
      const startParsed = parseYMD(proj.startDate);
      if (startParsed) {
        events.push({
          id: `m-start-${proj.id}`,
          projectId: proj.id,
          propertyName: proj.propertyName,
          clientName: proj.clientName,
          city: proj.city,
          state: proj.state,
          date: startParsed.normalized,
          year: startParsed.year,
          monthIndex: startParsed.monthIndex,
          dayOfMonth: startParsed.day,
          eventCategory: 'Project Kickoff',
          title: `Project Start & Mobilization`,
          subtitle: `${proj.unitsCount} units · PM: ${proj.assignedPM.name}`,
          unitsCount: proj.unitsCount,
          devicesCount: totalQuoted,
          installedDevicesCount: totalInst,
          assignedPM: proj.assignedPM.name,
          fieldTech,
          integrators,
          healthTag: health.effectiveTag,
        });
      }

      // Implementation Milestone
      const implMilestone = proj.milestones.find(
        (m) =>
          m.title.toLowerCase().includes('implementation') ||
          m.title.toLowerCase().includes('installation')
      );
      const implParsed = parseYMD(implMilestone?.targetDate);
      if (implParsed) {
        events.push({
          id: `m-impl-${proj.id}`,
          projectId: proj.id,
          propertyName: proj.propertyName,
          clientName: proj.clientName,
          city: proj.city,
          state: proj.state,
          date: implParsed.normalized,
          year: implParsed.year,
          monthIndex: implParsed.monthIndex,
          dayOfMonth: implParsed.day,
          eventCategory: 'Implementation Install',
          title: `Implementation Milestone (${implMilestone?.status || 'Scheduled'})`,
          subtitle: `Physical hardware installation window · ${totalInst}/${totalQuoted} devices`,
          unitsCount: proj.unitsCount,
          devicesCount: totalQuoted,
          installedDevicesCount: totalInst,
          assignedPM: proj.assignedPM.name,
          fieldTech,
          integrators,
          healthTag: health.effectiveTag,
        });
      }

      // CSM Handoff / Go-Live Milestone
      const csmMilestone = proj.milestones.find(
        (m) =>
          m.title.toLowerCase().includes('csm handoff') ||
          m.title.toLowerCase().includes('handoff') ||
          m.title.toLowerCase().includes('go live')
      );
      const csmParsed = parseYMD(csmMilestone?.targetDate);
      if (csmParsed) {
        events.push({
          id: `m-csm-${proj.id}`,
          projectId: proj.id,
          propertyName: proj.propertyName,
          clientName: proj.clientName,
          city: proj.city,
          state: proj.state,
          date: csmParsed.normalized,
          year: csmParsed.year,
          monthIndex: csmParsed.monthIndex,
          dayOfMonth: csmParsed.day,
          eventCategory: 'CSM Go-Live',
          title: `CSM Handoff & Go-Live (${proj.assignedCSM || 'Nicole Franklin'})`,
          subtitle: `Property transition to Customer Success`,
          unitsCount: proj.unitsCount,
          devicesCount: totalQuoted,
          installedDevicesCount: totalInst,
          assignedPM: proj.assignedPM.name,
          fieldTech,
          integrators,
          healthTag: health.effectiveTag,
        });
      }

      // Target Completion Date (if distinct from CSM Handoff / Implementation)
      const compParsed = parseYMD(proj.targetCompletionDate);
      if (
        compParsed &&
        compParsed.normalized !== implParsed?.normalized &&
        compParsed.normalized !== csmParsed?.normalized
      ) {
        events.push({
          id: `m-comp-${proj.id}`,
          projectId: proj.id,
          propertyName: proj.propertyName,
          clientName: proj.clientName,
          city: proj.city,
          state: proj.state,
          date: compParsed.normalized,
          year: compParsed.year,
          monthIndex: compParsed.monthIndex,
          dayOfMonth: compParsed.day,
          eventCategory: 'Target Completion',
          title: `Target Deployment Completion`,
          subtitle: `${proj.unitsCount} units · ${totalInst}/${totalQuoted} devices installed`,
          unitsCount: proj.unitsCount,
          devicesCount: totalQuoted,
          installedDevicesCount: totalInst,
          assignedPM: proj.assignedPM.name,
          fieldTech,
          integrators,
          healthTag: health.effectiveTag,
        });
      }

      // SOW Scheduled Scopes
      (proj.sowForecastItems || []).forEach((sow) => {
        const sowParsed = parseYMD(sow.scheduledStartDate);
        if (sowParsed) {
          events.push({
            id: `m-sow-${proj.id}-${sow.id}`,
            projectId: proj.id,
            propertyName: proj.propertyName,
            clientName: proj.clientName,
            city: proj.city,
            state: proj.state,
            date: sowParsed.normalized,
            year: sowParsed.year,
            monthIndex: sowParsed.monthIndex,
            dayOfMonth: sowParsed.day,
            eventCategory: 'SOW Scope',
            title: `SOW: ${sow.bomItemName} (${sow.buildingOrArea})`,
            subtitle: `${sow.assignedInstaller} · Qty: ${sow.forecastedQuantity} (${sow.status})`,
            unitsCount: proj.unitsCount,
            devicesCount: sow.forecastedQuantity,
            installedDevicesCount: sow.status === 'Completed' ? sow.forecastedQuantity : 0,
            assignedPM: proj.assignedPM.name,
            fieldTech,
            integrators,
            healthTag: health.effectiveTag,
          });
        }
      });
    });

    // 2. Daily Field Logs
    filteredDailyLogs.forEach((log) => {
      const logParsed = parseYMD(log.timestamp);
      if (logParsed) {
        events.push({
          id: `m-log-${log.id}`,
          projectId: log.projectId,
          propertyName: log.propertyName,
          clientName: '',
          city: log.projectCity,
          state: log.projectState,
          date: logParsed.normalized,
          year: logParsed.year,
          monthIndex: logParsed.monthIndex,
          dayOfMonth: logParsed.day,
          eventCategory: 'Daily Field Log',
          title: `+${log.quantityCompleted} Units Installed (${log.category})`,
          subtitle: `${log.installerName} · ${log.locationCompleted}`,
          unitsCount: log.quantityCompleted,
          devicesCount: log.quantityCompleted,
          installedDevicesCount: log.quantityCompleted,
          assignedPM: log.pmName,
          fieldTech: '',
          integrators: [log.installerName],
        });
      }
    });

    // 3. Future Pipeline (2027 & 2028)
    futurePipeline.forEach((fp) => {
      const matchesPM = pmFilter === 'all' || fp.assignedPM === pmFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        fp.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fp.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fp.crewName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesPM || !matchesSearch) return;

      const fpParsed = parseYMD(fp.targetDate);
      if (fpParsed) {
        events.push({
          id: `m-fp-${fp.id}`,
          propertyName: fp.propertyName,
          clientName: fp.clientName,
          city: fp.city,
          state: fp.state,
          date: fpParsed.normalized,
          year: fpParsed.year,
          monthIndex: fpParsed.monthIndex,
          dayOfMonth: fpParsed.day,
          eventCategory: 'Pipeline Target',
          title: `${fp.status}: ${fp.scopeNotes}`,
          subtitle: `Crew: ${fp.crewName} · PM: ${fp.assignedPM}`,
          unitsCount: fp.unitsCount,
          devicesCount: fp.devicesCount,
          installedDevicesCount: 0,
          assignedPM: fp.assignedPM,
          fieldTech: fp.crewName,
          integrators: [fp.crewName],
          pipelineStatus: fp.status,
        });
      }
    });

    return events.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredProjects, filteredDailyLogs, futurePipeline, pmFilter, searchQuery]);

  // Group monthly events by monthIndex (0-11) for the selected monthlyYear
  const monthlyScheduleBuckets = useMemo(() => {
    const targetYearNum = parseInt(monthlyYear, 10);
    return MONTH_NAMES.map((monthName, monthIdx) => {
      const quarterLabel: 'Q1' | 'Q2' | 'Q3' | 'Q4' =
        monthIdx < 3 ? 'Q1' : monthIdx < 6 ? 'Q2' : monthIdx < 9 ? 'Q3' : 'Q4';

      const monthEvents = allMonthlyEvents.filter(
        (ev) => ev.year === targetYearNum && ev.monthIndex === monthIdx
      );

      // Unique properties active in this month
      const uniqueSiteNames = Array.from(new Set(monthEvents.map((e) => e.propertyName)));

      // Calculate unique project units & devices in this month
      const seenProperties = new Set<string>();
      let monthUnits = 0;
      let monthDevices = 0;
      let monthInstalled = 0;

      monthEvents.forEach((ev) => {
        if (ev.eventCategory !== 'Daily Field Log' && !seenProperties.has(ev.propertyName)) {
          seenProperties.add(ev.propertyName);
          monthUnits += ev.unitsCount;
          monthDevices += ev.devicesCount;
          monthInstalled += ev.installedDevicesCount;
        }
      });

      const implCount = monthEvents.filter((e) => e.eventCategory === 'Implementation Install').length;
      const goLiveCount = monthEvents.filter((e) => e.eventCategory === 'CSM Go-Live').length;
      const sowCount = monthEvents.filter((e) => e.eventCategory === 'SOW Scope').length;
      const logCount = monthEvents.filter((e) => e.eventCategory === 'Daily Field Log').length;

      return {
        monthIndex: monthIdx,
        monthName,
        shortName: MONTH_SHORT_NAMES[monthIdx],
        year: targetYearNum,
        quarterLabel,
        events: monthEvents,
        uniqueSitesCount: uniqueSiteNames.length,
        monthUnits,
        monthDevices,
        monthInstalled,
        completionPct: monthDevices > 0 ? Math.round((monthInstalled / monthDevices) * 100) : 0,
        implCount,
        goLiveCount,
        sowCount,
        logCount,
        isCurrentMonth: targetYearNum === 2026 && monthIdx === 9, // October 2026
      };
    });
  }, [allMonthlyEvents, monthlyYear]);

  // Build calendar grid cells for (monthlyYear, selectedCalendarMonth)
  const calendarGridData = useMemo(() => {
    const yearNum = parseInt(monthlyYear, 10);
    const firstDayOfMonth = new Date(yearNum, selectedCalendarMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(yearNum, selectedCalendarMonth + 1, 0).getDate();

    const cells: Array<{
      day: number | null;
      dateStr: string | null;
      events: MonthlyInstallEvent[];
      isToday: boolean;
    }> = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push({ day: null, dateStr: null, events: [], isToday: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${yearNum}-${String(selectedCalendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = allMonthlyEvents.filter((ev) => ev.date === dateStr);
      cells.push({
        day: d,
        dateStr,
        events: dayEvents,
        isToday: dateStr === '2026-10-24',
      });
    }

    return {
      yearNum,
      monthName: MONTH_NAMES[selectedCalendarMonth],
      daysInMonth,
      cells,
    };
  }, [allMonthlyEvents, monthlyYear, selectedCalendarMonth]);

  const getStatusColor = (tag: ProjectStatusTag) => {
    switch (tag) {
      case 'On Track':
        return {
          bar: 'bg-emerald-500',
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          text: 'text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'Behind Schedule':
        return {
          bar: 'bg-amber-500',
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          text: 'text-amber-800',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'High Risk':
        return {
          bar: 'bg-rose-500',
          bg: 'bg-rose-50',
          border: 'border-rose-300',
          text: 'text-rose-800',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
        };
    }
  };

  // Handler to submit a new daily installation log
  const handleCreateDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogProjectId) return;

    const targetProject = projects.find((p) => p.id === newLogProjectId);
    if (!targetProject) return;

    const newEntry: InstallLogEntry = {
      id: `daily-log-${Date.now()}`,
      projectId: targetProject.id,
      timestamp: newLogDate,
      installerName: newLogInstaller.trim() || 'On-Site Field Installer',
      itemId: targetProject.bomItems[0]?.id || 'item-1',
      itemName: `${newLogCategory} - On-Site Field Work`,
      quantityCompleted: Number(newLogUnits) || 1,
      locationCompleted: newLogLocation.trim() || 'Building Scope',
      statusCheck: 'Verified & Online',
      notes: newLogNotes.trim(),
    };

    if (onUpdateProject) {
      onUpdateProject({
        ...targetProject,
        installLogs: [newEntry, ...(targetProject.installLogs || [])],
        lastUpdated: new Date().toISOString(),
      });
    }

    setIsDailyLogModalOpen(false);
    // Reset form fields
    setNewLogUnits(24);
    setNewLogLocation('');
    setNewLogNotes('');
  };

  // Calculate year totals
  const total2026Units = projects.reduce((acc, p) => acc + p.unitsCount, 0);
  const total2026Devices = projects.reduce(
    (acc, p) => acc + p.bomItems.reduce((bAcc, b) => bAcc + b.quantity, 0),
    0
  );
  const total2027Units = futurePipeline.filter((f) => f.year === 2027).reduce((acc, f) => acc + f.unitsCount, 0);
  const total2027Devices = futurePipeline.filter((f) => f.year === 2027).reduce((acc, f) => acc + f.devicesCount, 0);
  const total2028Units = futurePipeline.filter((f) => f.year === 2028).reduce((acc, f) => acc + f.unitsCount, 0);
  const total2028Devices = futurePipeline.filter((f) => f.year === 2028).reduce((acc, f) => acc + f.devicesCount, 0);

  // Google Calendar Sync State
  const [isCalendarSyncModalOpen, setIsCalendarSyncModalOpen] = useState(false);
  const [calendarAuthState, setCalendarAuthState] = useState<{
    email: string | null;
    needsAuth: boolean;
  }>({ email: null, needsAuth: true });
  const [syncIncludeProjectWindows, setSyncIncludeProjectWindows] = useState(true);
  const [syncIncludeSowScopes, setSyncIncludeSowScopes] = useState(true);
  const [syncIncludeDailyLogs, setSyncIncludeDailyLogs] = useState(true);
  const [syncIncludePipeline, setSyncIncludePipeline] = useState(false);
  const [excludedSyncKeys, setExcludedSyncKeys] = useState<Set<string>>(new Set());
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{
    completed: number;
    total: number;
    currentSummary: string;
  } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncResults, setSyncResults] = useState<SyncedCalendarEventResult[] | null>(null);

  useEffect(() => {
    const unsub = subscribeToGmailAuth((state) => {
      setCalendarAuthState({
        email: state.user?.email || null,
        needsAuth: state.needsAuth,
      });
    });
    return unsub;
  }, []);

  // Build candidate installation events from filtered projects, SOW scopes, daily logs, and pipeline
  const candidateCalendarEvents = useMemo<CalendarInstallationEventInput[]>(() => {
    const events: CalendarInstallationEventInput[] = [];

    if (syncIncludeProjectWindows) {
      filteredProjects.forEach((proj) => {
        const partners = getProjectIntegratorPartners(proj).join(', ') || 'Assigned Field Crew';
        const fieldTech = normalizeFieldTech(proj.assignedFieldTech);
        const totalQuoted = proj.bomItems.reduce((acc, b) => acc + b.quantity, 0);
        const totalInst = proj.bomItems.reduce((acc, b) => acc + b.installedCount, 0);
        const completionPct = totalQuoted > 0 ? Math.round((totalInst / totalQuoted) * 100) : 0;
        const healthTag = calculateProjectScheduleHealth(
          proj.targetCompletionDate,
          proj.statusTag,
          proj.notes,
          proj.milestones
        ).effectiveTag;
        events.push({
          syncKey: `quext-proj-window-${proj.id}`,
          summary: `[Quext Install Window] ${proj.propertyName} (${proj.unitsCount} Units)`,
          location: `${proj.address}, ${proj.city}, ${proj.state}`,
          startDate: proj.startDate || '2026-10-01',
          endDate: proj.targetCompletionDate || proj.startDate || '2026-10-25',
          eventType: 'Active Project Window',
          propertyName: proj.propertyName,
          description: [
            `Property: ${proj.propertyName}`,
            `Client: ${proj.clientName}`,
            `Units: ${proj.unitsCount}`,
            `Project Manager: ${proj.assignedPM.name}`,
            `Quext Field Tech: ${fieldTech}`,
            `Integrator Partner(s): ${partners}`,
            `Overall Completion: ${completionPct}%`,
            `Schedule Health: ${healthTag}`,
          ].join('\n'),
        });
      });
    }

    if (syncIncludeSowScopes) {
      filteredProjects.forEach((proj) => {
        (proj.sowForecastItems || []).forEach((sow) => {
          events.push({
            syncKey: `quext-sow-${proj.id}-${sow.id}`,
            summary: `[SOW Scope] ${proj.propertyName}: ${sow.bomItemName} (${sow.buildingOrArea})`,
            location: `${proj.address}, ${proj.city}, ${proj.state}`,
            startDate: sow.scheduledStartDate || proj.startDate || '2026-10-15',
            endDate: sow.scheduledEndDate || sow.scheduledStartDate || '2026-10-20',
            eventType: 'SOW Scheduled Scope',
            propertyName: proj.propertyName,
            description: [
              `Property: ${proj.propertyName} (${proj.city}, ${proj.state})`,
              `Hardware / BOM Item: ${sow.bomItemName}`,
              `Building / Area: ${sow.buildingOrArea}`,
              `Scope of Work: ${sow.workDescription}`,
              `Assigned Installer: ${sow.assignedInstaller}`,
              `Forecasted Qty: ${sow.forecastedQuantity} (${sow.status})`,
              `Project Manager: ${proj.assignedPM.name}`,
            ].join('\n'),
          });
        });
      });
    }

    if (syncIncludeDailyLogs) {
      filteredDailyLogs.slice(0, 20).forEach((log) => {
        events.push({
          syncKey: `quext-dailylog-${log.projectId}-${log.id}`,
          summary: `[Field Log] ${log.propertyName}: ${log.quantityCompleted}x ${log.itemName}`,
          location: `${log.locationCompleted} — ${log.projectCity}, ${log.projectState}`,
          startDate: log.timestamp || '2026-10-22',
          endDate: log.timestamp || '2026-10-22',
          eventType: 'Daily Installation Log',
          propertyName: log.propertyName,
          description: [
            `Property: ${log.propertyName} (${log.projectCity}, ${log.projectState})`,
            `Hardware Installed: ${log.itemName} (${log.category || 'Hardware'})`,
            `Quantity Completed: ${log.quantityCompleted}`,
            `Location Completed: ${log.locationCompleted}`,
            `Installer / Crew: ${log.installerName}`,
            `Verification Status: ${log.statusCheck}`,
            log.notes ? `Field Notes: ${log.notes}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        });
      });
    }

    if (syncIncludePipeline) {
      futurePipeline.forEach((fp) => {
        events.push({
          syncKey: `quext-pipeline-${fp.id}`,
          summary: `[${fp.quarter} ${fp.year} Target] ${fp.propertyName} (${fp.unitsCount} Units)`,
          location: `${fp.city}, ${fp.state}`,
          startDate: fp.targetDate,
          endDate: fp.targetDate,
          eventType: 'Long-Range Pipeline',
          propertyName: fp.propertyName,
          description: [
            `Property: ${fp.propertyName}`,
            `Client: ${fp.clientName}`,
            `Planned Quarter: ${fp.quarterLabel}`,
            `Units / Devices: ${fp.unitsCount} units / ${fp.devicesCount} devices`,
            `Assigned PM: ${fp.assignedPM}`,
            `Planned Crew: ${fp.crewName}`,
            `Scope Notes: ${fp.scopeNotes}`,
          ].join('\n'),
        });
      });
    }

    return events;
  }, [
    filteredProjects,
    filteredDailyLogs,
    futurePipeline,
    syncIncludeProjectWindows,
    syncIncludeSowScopes,
    syncIncludeDailyLogs,
    syncIncludePipeline,
  ]);

  const selectedEventsToSync = useMemo(
    () => candidateCalendarEvents.filter((ev) => !excludedSyncKeys.has(ev.syncKey)),
    [candidateCalendarEvents, excludedSyncKeys]
  );

  const toggleSyncEventSelection = (syncKey: string) => {
    setExcludedSyncKeys((prev) => {
      const next = new Set(prev);
      if (next.has(syncKey)) {
        next.delete(syncKey);
      } else {
        next.add(syncKey);
      }
      return next;
    });
  };

  const handleConfirmCalendarSync = async () => {
    if (selectedEventsToSync.length === 0) return;
    setIsSyncingCalendar(true);
    setSyncError(null);
    setSyncResults(null);
    setSyncProgress({
      completed: 0,
      total: selectedEventsToSync.length,
      currentSummary: selectedEventsToSync[0]?.summary || 'Preparing events...',
    });

    try {
      const results = await syncInstallationEventsToCalendar(
        selectedEventsToSync,
        INSTALLATION_CALENDAR_ID,
        (completed, total, currentSummary) => {
          setSyncProgress({ completed, total, currentSummary });
        }
      );
      setSyncResults(results);
    } catch (err: any) {
      if (err?.message === 'NOT_AUTHENTICATED') {
        setSyncError(
          'Please sign in with Google and grant Google Calendar permission to sync installation events.'
        );
      } else {
        setSyncError(
          err?.message || 'Failed to sync installation events to Google Calendar.'
        );
      }
    } finally {
      setIsSyncingCalendar(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Installation Timeline Header Banner (Tone down theme, clean operations focus) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 rounded uppercase tracking-wider">
                Installation &amp; Deployment Timeline
              </span>
              <span className="text-xs text-slate-500">· Long-Range Scheduling &amp; Real-Time Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
              Installation Timeline &amp; Schedule
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Engineered so Field Operations, Project Management, Customer Success (CSM), and Executive Leadership have full clarity on when and where physical installs are taking place across all properties.
            </p>
          </div>

          {/* Perspective View Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start lg:self-auto shrink-0 shadow-xs">
            <button
              type="button"
              onClick={() => setPerspective('quarterly-schedule')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                perspective === 'quarterly-schedule'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
              <span>Quarterly Schedule (3-Year)</span>
            </button>

            <button
              type="button"
              onClick={() => setPerspective('monthly-schedule')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                perspective === 'monthly-schedule'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
              <span>Monthly Installation View</span>
            </button>

            <button
              type="button"
              onClick={() => setPerspective('daily-tracker')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                perspective === 'daily-tracker'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Daily Installation Tracker</span>
            </button>

            <button
              type="button"
              onClick={() => setPerspective('schedule-locations')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                perspective === 'schedule-locations'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Property &amp; Location View</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Department filter removed per prompt requirements) */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search property, city, or crew..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            {/* Project Manager Filter */}
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold">PM:</span>
              <select
                value={pmFilter}
                onChange={(e) => setPmFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Project Managers</option>
                <option value="Raul Recalde">Raul Recalde</option>
                <option value="Bethany Condon">Bethany Condon</option>
                <option value="Megan Rossman">Megan Rossman (Director of Ops)</option>
              </select>
            </div>

            {/* Integrator Partner Filter */}
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold">Integrator:</span>
              <select
                value={integratorFilter}
                onChange={(e) => setIntegratorFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Integrators / Installers</option>
                {allAvailableIntegrators.map((partner) => (
                  <option key={partner} value={partner}>
                    {partner}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Health Filter */}
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold">Health:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Health Tags</option>
                <option value="On Track">✓ On Track</option>
                <option value="Behind Schedule">⏳ Behind Schedule</option>
                <option value="High Risk">⚠ High Risk</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="text-slate-500 font-mono text-[11px]">
              Tracking <strong className="text-slate-900">{filteredProjects.length}</strong> active deployment sites
            </div>

            <button
              type="button"
              onClick={() => {
                setSyncError(null);
                setSyncResults(null);
                setIsCalendarSyncModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sync to Google Calendar</span>
              {syncResults && syncResults.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-white rounded text-[10px] font-extrabold">
                  ✓ {syncResults.length}
                </span>
              )}
            </button>

            {perspective === 'daily-tracker' && (
              <button
                type="button"
                onClick={() => setIsDailyLogModalOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Daily Install</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PERSPECTIVE 1: QUARTERLY INSTALLATION SCHEDULE (UP TO 3 YEARS)             */}
      {/* ========================================================================= */}
      {perspective === 'quarterly-schedule' && (
        <div className="space-y-6">
          {/* Year Range Tabs (2026, 2027, 2028, All 3 Years) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Planning Horizon:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedYear('2026')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    selectedYear === '2026'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2026 (Active Execution)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYear('2027')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    selectedYear === '2027'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2027 (Scheduled Pipeline)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYear('2028')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    selectedYear === '2028'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2028 (Long-Range Commitments)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYear('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    selectedYear === 'all'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All 3 Years
                </button>
              </div>
            </div>

            {/* High-Level Horizon Stats Badge */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                <span className="text-slate-500">Total Horizon Units: </span>
                <strong className="text-slate-900">
                  {selectedYear === '2026'
                    ? total2026Units.toLocaleString()
                    : selectedYear === '2027'
                    ? total2027Units.toLocaleString()
                    : selectedYear === '2028'
                    ? total2028Units.toLocaleString()
                    : (total2026Units + total2027Units + total2028Units).toLocaleString()}
                </strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                <span className="text-slate-500">Devices In Scope: </span>
                <strong className="text-sky-700">
                  {selectedYear === '2026'
                    ? total2026Devices.toLocaleString()
                    : selectedYear === '2027'
                    ? total2027Devices.toLocaleString()
                    : selectedYear === '2028'
                    ? total2028Devices.toLocaleString()
                    : (total2026Devices + total2027Devices + total2028Devices).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* Render 2026 Quarters */}
          {(selectedYear === '2026' || selectedYear === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h2 className="text-lg font-bold text-slate-900">
                    2026 Quarterly Installation Schedule (Current Active Year)
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {total2026Units.toLocaleString()} units · {total2026Devices.toLocaleString()} IoT devices
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((quarter) => {
                  const quarterProjects = quarterlyData.q2026[quarter];
                  const qUnits = quarterProjects.reduce((sum, p) => sum + p.unitsCount, 0);
                  const qDevices = quarterProjects.reduce(
                    (sum, p) => sum + p.bomItems.reduce((bSum, b) => bSum + b.quantity, 0),
                    0
                  );
                  const qInstalled = quarterProjects.reduce(
                    (sum, p) => sum + p.bomItems.reduce((bSum, b) => bSum + b.installedCount, 0),
                    0
                  );
                  const qPct = qDevices > 0 ? Math.round((qInstalled / qDevices) * 100) : 0;
                  const dateWindow =
                    quarter === 'Q1'
                      ? 'Jan 1 - Mar 31'
                      : quarter === 'Q2'
                      ? 'Apr 1 - Jun 30'
                      : quarter === 'Q3'
                      ? 'Jul 1 - Sep 30'
                      : 'Oct 1 - Dec 31';

                  const isCurrentActiveQtr = quarter === 'Q4';

                  return (
                    <div
                      key={`2026-${quarter}`}
                      className={`rounded-xl border p-4 space-y-3.5 transition-all ${
                        isCurrentActiveQtr
                          ? 'bg-white border-sky-400 shadow-md ring-2 ring-sky-300/30'
                          : 'bg-white border-slate-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                              {quarter} 2026
                            </h3>
                            {isCurrentActiveQtr && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-800 border border-sky-200 animate-pulse">
                                CURRENT QTR
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{dateWindow}</div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-extrabold text-slate-800 font-mono">
                            {quarterProjects.length} {quarterProjects.length === 1 ? 'Site' : 'Sites'}
                          </span>
                          <div className="text-[10px] text-slate-500">{qUnits.toLocaleString()} Units</div>
                        </div>
                      </div>

                      {/* Progress Meter for Quarter */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                          <span>Deployed Devices:</span>
                          <span className="font-mono text-slate-900">
                            {qInstalled.toLocaleString()} / {qDevices.toLocaleString()} ({qPct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              qPct > 70 ? 'bg-emerald-500' : qPct > 30 ? 'bg-sky-500' : 'bg-slate-300'
                            }`}
                            style={{ width: `${qPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Projects List in this Quarter */}
                      <div className="space-y-2 pt-1">
                        {quarterProjects.length === 0 ? (
                          <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center text-xs text-slate-400">
                            Completed prior baseline quarter
                          </div>
                        ) : (
                          quarterProjects.map((proj) => {
                            const health = calculateProjectScheduleHealth(
                              proj.targetCompletionDate,
                              proj.statusTag,
                              proj.milestones,
                              proj.notes
                            );
                            const statusStyle = getStatusColor(health.effectiveTag);

                            return (
                              <div
                                key={proj.id}
                                onClick={() => onSelectProject(proj.id)}
                                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-sky-400 transition-all cursor-pointer shadow-2xs space-y-1"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <strong className="text-xs text-slate-900 truncate">
                                    {proj.propertyName}
                                  </strong>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${statusStyle.badge}`}>
                                    {health.effectiveTag}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                                  <span>{proj.city}, {proj.state}</span>
                                  <span className="font-mono font-semibold text-slate-700">{proj.unitsCount} units</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                                  <span>PM: {proj.assignedPM.name.split(' ')[0]}</span>
                                  <div className="flex items-center gap-1">
                                    {getProjectIntegratorPartners(proj).map((partner) => (
                                      <span
                                        key={partner}
                                        className="px-1 py-0.2 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 text-[9px] font-bold"
                                      >
                                        {partner}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Render 2027 Quarters (Scheduled Pipeline) */}
          {(selectedYear === '2027' || selectedYear === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <h2 className="text-lg font-bold text-slate-900">
                    2027 Quarterly Installation Schedule (Scheduled Pipeline &amp; Expansions)
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {total2027Units.toLocaleString()} units · {total2027Devices.toLocaleString()} IoT devices committed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((quarter) => {
                  const qProjects = quarterlyData.q2027[quarter];
                  const qUnits = qProjects.reduce((sum, p) => sum + p.unitsCount, 0);
                  const qDevices = qProjects.reduce((sum, p) => sum + p.devicesCount, 0);
                  const dateWindow =
                    quarter === 'Q1'
                      ? 'Jan 1 - Mar 31'
                      : quarter === 'Q2'
                      ? 'Apr 1 - Jun 30'
                      : quarter === 'Q3'
                      ? 'Jul 1 - Sep 30'
                      : 'Oct 1 - Dec 31';

                  return (
                    <div
                      key={`2027-${quarter}`}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                            {quarter} 2027
                          </h3>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{dateWindow}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-sky-800 font-mono">
                            {qUnits.toLocaleString()} Units
                          </span>
                          <div className="text-[10px] text-slate-500">{qDevices.toLocaleString()} Devices</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {qProjects.map((pipe) => (
                          <div
                            key={pipe.id}
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-sky-300 transition-all space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {pipe.propertyName}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-sky-800 border border-sky-200">
                                {pipe.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center justify-between">
                              <span>{pipe.city}, {pipe.state}</span>
                              <span className="font-mono font-semibold text-slate-800">{pipe.unitsCount} Units</span>
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-2 italic">
                              {pipe.scopeNotes}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                              <span>PM: {pipe.assignedPM}</span>
                              <span className="text-indigo-700 font-semibold">Target: {pipe.targetDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Render 2028 Quarters (Long-Range Commitments) */}
          {(selectedYear === '2028' || selectedYear === 'all') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <h2 className="text-lg font-bold text-slate-900">
                    2028 Quarterly Installation Schedule (Multi-Year Portfolio Commitments)
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {total2028Units.toLocaleString()} units · {total2028Devices.toLocaleString()} IoT devices
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((quarter) => {
                  const qProjects = quarterlyData.q2028[quarter];
                  const qUnits = qProjects.reduce((sum, p) => sum + p.unitsCount, 0);
                  const qDevices = qProjects.reduce((sum, p) => sum + p.devicesCount, 0);
                  const dateWindow =
                    quarter === 'Q1'
                      ? 'Jan 1 - Mar 31'
                      : quarter === 'Q2'
                      ? 'Apr 1 - Jun 30'
                      : quarter === 'Q3'
                      ? 'Jul 1 - Sep 30'
                      : 'Oct 1 - Dec 31';

                  return (
                    <div
                      key={`2028-${quarter}`}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                            {quarter} 2028
                          </h3>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{dateWindow}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-indigo-900 font-mono">
                            {qUnits.toLocaleString()} Units
                          </span>
                          <div className="text-[10px] text-slate-500">{qDevices.toLocaleString()} Devices</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {qProjects.map((pipe) => (
                          <div
                            key={pipe.id}
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition-all space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {pipe.propertyName}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                                {pipe.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center justify-between">
                              <span>{pipe.city}, {pipe.state}</span>
                              <span className="font-mono font-semibold text-slate-800">{pipe.unitsCount} Units</span>
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-2 italic">
                              {pipe.scopeNotes}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                              <span>PM: {pipe.assignedPM}</span>
                              <span className="text-indigo-700 font-semibold">Target: {pipe.targetDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 1.5: MONTHLY INSTALLATION VIEW (12-MONTH & CALENDAR GRID)     */}
      {/* ========================================================================= */}
      {perspective === 'monthly-schedule' && (
        <div className="space-y-6">
          {/* Top Control Bar: Year Selector + Sub-View Mode (12-Month Breakdown vs Day-by-Day Calendar Grid) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Schedule Year:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                {(['2026', '2027', '2028'] as const).map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setMonthlyYear(yr);
                      if (yr === '2026') {
                        setSelectedCalendarMonth(9);
                        setSelectedCalendarDayDate('2026-10-22');
                      } else {
                        setSelectedCalendarMonth(2); // March (Q1 target)
                        setSelectedCalendarDayDate(null);
                      }
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      monthlyYear === yr
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {yr === '2026'
                      ? '2026 (Active Execution)'
                      : yr === '2027'
                      ? '2027 (Scheduled Pipeline)'
                      : '2028 (Long-Range)'}
                  </button>
                ))}
              </div>

              {monthlySubView === '12-month-grid' && (
                <button
                  type="button"
                  onClick={() => setShowOnlyActiveMonths((prev) => !prev)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    showOnlyActiveMonths
                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {showOnlyActiveMonths ? 'Showing Active Months Only' : 'Showing All 12 Months'}
                </button>
              )}
            </div>

            {/* Sub-View Switcher: 12-Month Breakdown vs Interactive Month Calendar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMonthlySubView('12-month-grid')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    monthlySubView === '12-month-grid'
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-sky-600" />
                  <span>12-Month Breakdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMonthlySubView('calendar-grid')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    monthlySubView === 'calendar-grid'
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interactive Month Calendar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Summary KPI Ribbon */}
          {(() => {
            const activeMonths = monthlyScheduleBuckets.filter((m) => m.events.length > 0);
            const peakMonth = [...monthlyScheduleBuckets].sort(
              (a, b) => b.events.length - a.events.length || b.monthUnits - a.monthUnits
            )[0];
            const totalImplEvents = monthlyScheduleBuckets.reduce((s, m) => s + m.implCount, 0);
            const totalGoLiveEvents = monthlyScheduleBuckets.reduce((s, m) => s + m.goLiveCount, 0);
            const totalSowEvents = monthlyScheduleBuckets.reduce((s, m) => s + m.sowCount, 0);

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
                    <span>Active Install Months ({monthlyYear})</span>
                    <CalendarDays className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                    {activeMonths.length} <span className="text-xs font-normal text-slate-500">/ 12 months</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    With scheduled deployments or field logs
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
                    <span>Peak Deployment Month</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1 truncate">
                    {peakMonth && peakMonth.events.length > 0
                      ? `${peakMonth.monthName} ${monthlyYear}`
                      : 'No Scheduled Activity'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    {peakMonth && peakMonth.events.length > 0
                      ? `${peakMonth.uniqueSitesCount} sites · ${peakMonth.events.length} scheduled events`
                      : 'Adjust filters to view months'}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
                    <span>Implementation &amp; SOW Windows</span>
                    <Wrench className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-sky-700 font-mono mt-1">
                    {totalImplEvents + totalSowEvents}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    <strong className="text-slate-800">{totalImplEvents}</strong> Implementation milestones ·{' '}
                    <strong className="text-slate-800">{totalSowEvents}</strong> SOW scopes
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
                    <span>Scheduled CSM Go-Lives</span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-purple-900 font-mono mt-1">
                    {totalGoLiveEvents}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Customer Success handoffs in {monthlyYear}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* SUB-VIEW A: 12-MONTH BREAKDOWN GRID */}
          {monthlySubView === '12-month-grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyScheduleBuckets
                .filter((bucket) => !showOnlyActiveMonths || bucket.events.length > 0)
                .map((bucket) => {
                  return (
                    <div
                      key={`${bucket.year}-${bucket.monthName}`}
                      className={`rounded-xl border p-4 flex flex-col justify-between space-y-3.5 transition-all ${
                        bucket.isCurrentMonth
                          ? 'bg-white border-sky-400 shadow-md ring-2 ring-sky-300/30'
                          : bucket.events.length > 0
                          ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                          : 'bg-slate-50/60 border-slate-200/80'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Month Card Header */}
                        <div className="flex items-start justify-between border-b border-slate-100 pb-2.5 gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                                {bucket.monthName} {bucket.year}
                              </h3>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {bucket.quarterLabel}
                              </span>
                              {bucket.isCurrentMonth && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-800 border border-sky-200 animate-pulse">
                                  CURRENT MONTH
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {bucket.uniqueSitesCount} {bucket.uniqueSitesCount === 1 ? 'Property' : 'Properties'} ·{' '}
                              {bucket.monthUnits.toLocaleString()} Units
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCalendarMonth(bucket.monthIndex);
                              const firstEventDate = bucket.events[0]?.date || null;
                              setSelectedCalendarDayDate(firstEventDate);
                              setMonthlySubView('calendar-grid');
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                            title={`Open ${bucket.monthName} ${bucket.year} day-by-day calendar`}
                          >
                            <CalendarDays className="w-3 h-3" />
                            <span>Calendar</span>
                          </button>
                        </div>

                        {/* Month Activity Summary Badges */}
                        {bucket.events.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {bucket.implCount > 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                                {bucket.implCount} Install {bucket.implCount === 1 ? 'Target' : 'Targets'}
                              </span>
                            )}
                            {bucket.goLiveCount > 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                {bucket.goLiveCount} CSM {bucket.goLiveCount === 1 ? 'Go-Live' : 'Go-Lives'}
                              </span>
                            )}
                            {bucket.sowCount > 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                                {bucket.sowCount} SOW {bucket.sowCount === 1 ? 'Scope' : 'Scopes'}
                              </span>
                            )}
                            {bucket.logCount > 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {bucket.logCount} Field {bucket.logCount === 1 ? 'Log' : 'Logs'}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Events List inside Month */}
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5">
                          {bucket.events.length === 0 ? (
                            <div className="p-4 bg-white/80 rounded-lg border border-dashed border-slate-200 text-center text-xs text-slate-400">
                              No installation milestones or SOW scopes scheduled in {bucket.monthName} {bucket.year}
                            </div>
                          ) : (
                            bucket.events.map((ev) => {
                              const categoryBadge =
                                ev.eventCategory === 'Implementation Install'
                                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                                  : ev.eventCategory === 'CSM Go-Live'
                                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                                  : ev.eventCategory === 'Target Completion'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : ev.eventCategory === 'SOW Scope'
                                  ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                  : ev.eventCategory === 'Daily Field Log'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : ev.eventCategory === 'Pipeline Target'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300';

                              return (
                                <div
                                  key={ev.id}
                                  onClick={() => {
                                    if (ev.projectId) {
                                      onSelectProject(ev.projectId);
                                    }
                                  }}
                                  className={`p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-white hover:border-sky-400 transition-all space-y-1 shadow-2xs ${
                                    ev.projectId ? 'cursor-pointer' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span
                                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${categoryBadge}`}
                                    >
                                      {ev.eventCategory}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-slate-700">
                                      {bucket.shortName} {ev.dayOfMonth}, {ev.year}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between gap-1">
                                    <strong className="text-xs text-slate-900 truncate">
                                      {ev.propertyName}
                                    </strong>
                                    {ev.healthTag && (
                                      <span
                                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                                          getStatusColor(ev.healthTag).badge
                                        }`}
                                      >
                                        {ev.healthTag}
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-[11px] font-semibold text-slate-700 truncate">
                                    {ev.title}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">{ev.subtitle}</div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Month Card Footer */}
                      {bucket.monthDevices > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
                            <span>Hardware Installed:</span>
                            <strong className="text-slate-900">
                              {bucket.monthInstalled.toLocaleString()} / {bucket.monthDevices.toLocaleString()} (
                              {bucket.completionPct}%)
                            </strong>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full rounded-full ${
                                bucket.completionPct >= 75
                                  ? 'bg-emerald-500'
                                  : bucket.completionPct >= 30
                                  ? 'bg-sky-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${bucket.completionPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* SUB-VIEW B: INTERACTIVE DAY-BY-DAY MONTH CALENDAR GRID */}
          {monthlySubView === 'calendar-grid' && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-5">
              {/* Month Picker Strip & Prev/Next Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCalendarMonth === 0) {
                        setSelectedCalendarMonth(11);
                      } else {
                        setSelectedCalendarMonth((m) => m - 1);
                      }
                    }}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                      {calendarGridData.monthName} {calendarGridData.yearNum}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Click any date or installation badge below to inspect site details
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCalendarMonth === 11) {
                        setSelectedCalendarMonth(0);
                      } else {
                        setSelectedCalendarMonth((m) => m + 1);
                      }
                    }}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMonthlyYear('2026');
                      setSelectedCalendarMonth(9);
                      setSelectedCalendarDayDate('2026-10-22');
                    }}
                    className="px-2.5 py-1 text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 rounded-lg hover:bg-sky-100 cursor-pointer"
                  >
                    Current Month (Oct 2026)
                  </button>
                </div>

                {/* Quick 12-Month Jump Pills */}
                <div className="flex flex-wrap items-center gap-1">
                  {MONTH_SHORT_NAMES.map((shortM, idx) => {
                    const count = monthlyScheduleBuckets[idx]?.events.length || 0;
                    const isSelected = selectedCalendarMonth === idx;
                    return (
                      <button
                        key={shortM}
                        type="button"
                        onClick={() => setSelectedCalendarMonth(idx)}
                        className={`px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : count > 0
                            ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                            : 'bg-slate-50 text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <span>{shortM}</span>
                        {count > 0 && (
                          <span
                            className={`text-[9px] font-mono px-1 rounded-full ${
                              isSelected ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Event Key:
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>Implementation Install</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>CSM Handoff (Go-Live)</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>SOW Scheduled Scope</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Target Completion / Field Log</span>
                </span>
              </div>

              {/* 7-Column Calendar Header + Day Cells */}
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayLabel) => (
                      <div
                        key={dayLabel}
                        className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 py-1.5 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        {dayLabel}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarGridData.cells.map((cell, cIdx) => {
                      if (cell.day === null || !cell.dateStr) {
                        return (
                          <div
                            key={`empty-${cIdx}`}
                            className="min-h-[110px] rounded-xl bg-slate-50/40 border border-dashed border-slate-200/60"
                          />
                        );
                      }

                      const isSelectedDay = selectedCalendarDayDate === cell.dateStr;

                      return (
                        <div
                          key={cell.dateStr}
                          onClick={() => setSelectedCalendarDayDate(cell.dateStr)}
                          className={`min-h-[110px] rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                            isSelectedDay
                              ? 'bg-sky-50/50 border-sky-500 ring-2 ring-sky-300/40 shadow-xs'
                              : cell.isToday
                              ? 'bg-amber-50/30 border-amber-400'
                              : cell.events.length > 0
                              ? 'bg-white border-slate-200 hover:border-sky-300 shadow-2xs'
                              : 'bg-white border-slate-200/70 hover:bg-slate-50/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                                cell.isToday
                                  ? 'bg-amber-500 text-white'
                                  : isSelectedDay
                                  ? 'bg-sky-600 text-white'
                                  : cell.events.length > 0
                                  ? 'text-slate-900 bg-slate-100'
                                  : 'text-slate-400'
                              }`}
                            >
                              {cell.day}
                            </span>
                            {cell.events.length > 0 && (
                              <span className="text-[10px] font-mono font-bold text-slate-500">
                                {cell.events.length} {cell.events.length === 1 ? 'event' : 'events'}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 mt-1.5 flex-1">
                            {cell.events.slice(0, 3).map((ev) => {
                              const pillStyle =
                                ev.eventCategory === 'Implementation Install'
                                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                                  : ev.eventCategory === 'CSM Go-Live'
                                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                                  : ev.eventCategory === 'SOW Scope'
                                  ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                  : ev.eventCategory === 'Daily Field Log'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-300';

                              return (
                                <div
                                  key={ev.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCalendarDayDate(cell.dateStr);
                                  }}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border truncate ${pillStyle}`}
                                  title={`${ev.propertyName} — ${ev.eventCategory}: ${ev.title}`}
                                >
                                  {ev.propertyName}
                                </div>
                              );
                            })}
                            {cell.events.length > 3 && (
                              <div className="text-[10px] font-bold text-sky-700 pl-1">
                                +{cell.events.length - 3} more...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected Day Inspector Drawer */}
              {selectedCalendarDayDate && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Scheduled Installations &amp; Logs for{' '}
                        <span className="font-mono text-sky-700">{selectedCalendarDayDate}</span>
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCalendarDayDate(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Clear selection
                    </button>
                  </div>

                  {(() => {
                    const dayEvents = allMonthlyEvents.filter(
                      (ev) => ev.date === selectedCalendarDayDate
                    );
                    if (dayEvents.length === 0) {
                      return (
                        <div className="text-xs text-slate-500 py-2">
                          No installation milestones, SOW scopes, or field logs recorded on this date.
                        </div>
                      );
                    }
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => {
                              if (ev.projectId) onSelectProject(ev.projectId);
                            }}
                            className={`p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-400 shadow-2xs space-y-1.5 transition-all ${
                              ev.projectId ? 'cursor-pointer' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                                {ev.eventCategory}
                              </span>
                              {ev.healthTag && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                    getStatusColor(ev.healthTag).badge
                                  }`}
                                >
                                  {ev.healthTag}
                                </span>
                              )}
                            </div>
                            <div className="font-bold text-xs text-slate-900">{ev.propertyName}</div>
                            <div className="text-xs text-slate-700 font-semibold">{ev.title}</div>
                            <div className="text-[11px] text-slate-500">{ev.subtitle}</div>
                            {ev.projectId && (
                              <div className="pt-1 text-[11px] font-bold text-sky-600 flex items-center gap-1">
                                <span>Open Project Workspace</span>
                                <ChevronRight className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 2: DAILY INSTALLATION TRACKER                                  */}
      {/* ========================================================================= */}
      {perspective === 'daily-tracker' && (
        <div className="space-y-4">
          {/* Tracker Filters & Summary Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Property Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 font-semibold">Property:</span>
                <select
                  value={trackerPropertyFilter}
                  onChange={(e) => setTrackerPropertyFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Properties</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.propertyName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <ListFilter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 font-semibold">Category:</span>
                <select
                  value={trackerCategoryFilter}
                  onChange={(e) => setTrackerCategoryFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Smart Access Control">Smart Access Control</option>
                  <option value="Smart Thermostats & HVAC">Smart Thermostats &amp; HVAC</option>
                  <option value="IoT Gateways & Mesh">IoT Gateways &amp; Mesh</option>
                  <option value="Common Area & Utilities">Common Area &amp; Utilities</option>
                  <option value="Sensors & Leak Protection">Sensors &amp; Leak Protection</option>
                  <option value="Bulk Managed Wi-Fi">Bulk Managed Wi-Fi</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">
                Showing <strong className="text-slate-900">{filteredDailyLogs.length}</strong> daily installer entries
              </span>
              <button
                type="button"
                onClick={() => setIsDailyLogModalOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Today&apos;s Field Work</span>
              </button>
            </div>
          </div>

          {/* Daily Logs Feed */}
          {filteredDailyLogs.length === 0 ? (
            <div className="p-10 bg-white border border-dashed border-slate-300 rounded-xl text-center space-y-3">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No installation logs match the selected filter.</div>
              <p className="text-xs text-slate-500">
                Click <strong>&quot;+ Log Today&apos;s Field Work&quot;</strong> to document installer units and building locations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDailyLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Date Badge */}
                    {(() => {
                      const { month, day, year } = parseLogDateBadge(log.timestamp);
                      return (
                        <div className="flex flex-col items-center justify-center bg-slate-100 border border-slate-200 rounded-xl w-14 h-14 shrink-0 font-mono">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">
                            {month}
                          </span>
                          <span className="text-lg font-extrabold text-slate-900 leading-none">
                            {day}
                          </span>
                          <span className="text-[9px] text-slate-500 font-semibold">{year}</span>
                        </div>
                      );
                    })()}

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectProject(log.projectId)}
                          className="font-extrabold text-sm text-slate-900 hover:text-sky-600 transition-colors text-left cursor-pointer"
                        >
                          {log.propertyName}
                        </button>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-600">
                          {log.projectCity}, {log.projectState}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>+{log.quantityCompleted} Units Complete</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5 text-amber-600" />
                          {log.installerName}
                        </span>
                        <span>·</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                          {log.category || log.itemName}
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-sky-600" />
                          {log.locationCompleted}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                          &quot;{log.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-[11px] text-slate-500 font-mono">
                      PM: <strong>{log.pmName}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectProject(log.projectId)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Project Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE 3: BY PROPERTY & PHYSICAL LOCATION (Clean Stakeholder View)     */}
      {/* ========================================================================= */}
      {perspective === 'schedule-locations' && (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const health = calculateProjectScheduleHealth(
              project.targetCompletionDate,
              project.statusTag,
              project.milestones,
              project.notes
            );
            const statusStyle = getStatusColor(health.effectiveTag);
            const totalQuoted = project.bomItems.reduce((acc, i) => acc + i.quantity, 0);
            const totalInstalled = project.bomItems.reduce((acc, i) => acc + i.installedCount, 0);
            const pct = totalQuoted > 0 ? Math.min(100, Math.round((totalInstalled / totalQuoted) * 100)) : 0;
            const remaining = Math.max(0, totalQuoted - totalInstalled);

            // Latest install location from logs
            const latestLog = project.installLogs?.[0];

            return (
              <div
                key={project.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all space-y-4"
              >
                {/* Header row: Property, Location, Health Badge, Action */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={project.heroImage}
                      alt={project.propertyName}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          {project.propertyName}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusStyle.badge}`}>
                          {health.effectiveTag}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {health.weeksBehindLabel}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-sky-600" />
                          {project.address}, {project.city}, {project.state}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-slate-700">{project.unitsCount} Residential Units</span>
                        <span>·</span>
                        <span className="text-slate-500">
                          Client: <strong>{project.clientName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project.id)}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>View Project Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stakeholders & Location Info Bar (Cleaned, no "Department 1/2" labels) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  {/* Lead 1: Project Management */}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-sky-600" />
                      <span>Project Management (PM)</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5">{project.assignedPM.name}</div>
                    <div className="text-[11px] text-slate-500">{project.assignedPM.email}</div>
                  </div>

                  {/* Lead 2: Field Ops & Field Tech */}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-amber-600" />
                      <span>Field Operations &amp; Tech</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-sky-900 font-semibold">{getProjectIntegratorPartners(project).join(', ') || 'Quext Field Crew Alpha'}</span>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-300">
                        Tech: {normalizeFieldTech(project.assignedFieldTech)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {latestLog ? `Working on: ${latestLog.locationCompleted}` : 'All buildings in scope'}
                    </div>
                  </div>

                  {/* Lead 3: Customer Success (CSM) */}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Customer Success (CSM)</span>
                    </div>
                    <div className="font-bold text-purple-900 mt-0.5">{project.assignedCSM || 'Nicole Franklin'}</div>
                    <div className="text-[11px] text-purple-700">
                      Handoff: {project.milestones.find((m) => m.title.includes('CSM Handoff') || m.title.includes('Training') || m.title.includes('Handoff'))?.targetDate || 'Upcoming'}
                    </div>
                  </div>

                  {/* Lead 4: Dates & Handover Schedule */}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-600" />
                      <span>Target Handover Schedule</span>
                    </div>
                    <div className="font-mono font-bold text-slate-900 mt-0.5">
                      {project.startDate} → {project.targetCompletionDate}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {remaining} devices remaining to install
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar & Milestones Strip */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span>Deployment Progress:</span>
                      <strong className="text-slate-900 font-mono">{pct}%</strong>
                      <span className="text-slate-500">
                        ({totalInstalled.toLocaleString()} / {totalQuoted.toLocaleString()} devices installed)
                      </span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Target: {project.targetCompletionDate}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusStyle.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Milestones Horizontal Flow */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1 text-center">
                    {project.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          milestone.status === 'Completed'
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                            : milestone.status === 'In Progress'
                            ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold ring-2 ring-sky-300/40'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="text-[10px] truncate">{milestone.title}</div>
                        <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                          {milestone.status === 'Completed' ? '✓ Done' : milestone.targetDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Log Daily Installation Entry */}
      {isDailyLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Log Daily Installation Progress</h3>
                  <p className="text-xs text-slate-500">Document units installed and physical building locations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDailyLogModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDailyLog} className="py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Property
                  </label>
                  <select
                    value={newLogProjectId}
                    onChange={(e) => setNewLogProjectId(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.propertyName} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Install Date
                  </label>
                  <input
                    type="date"
                    value={newLogDate}
                    onChange={(e) => setNewLogDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Installer / Crew Lead
                    </label>
                    {(() => {
                      const selProj = projects.find((p) => p.id === newLogProjectId);
                      const partners = selProj ? getProjectIntegratorPartners(selProj) : [];
                      if (partners.length === 0) return null;
                      return (
                        <div className="flex items-center gap-1 text-[10px] flex-wrap justify-end">
                          {partners.map((partner) => (
                            <button
                              key={partner}
                              type="button"
                              onClick={() => setNewLogInstaller(`${partner} Field Crew`)}
                              className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-bold hover:bg-sky-100 cursor-pointer"
                              title={`Select ${partner} as installer`}
                            >
                              {partner}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  <input
                    type="text"
                    value={newLogInstaller}
                    onChange={(e) => setNewLogInstaller(e.target.value)}
                    placeholder="Field Crew Alpha, Subcontractor lead..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Units Installed Today
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={newLogUnits}
                    onChange={(e) => setNewLogUnits(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Device Category
                </label>
                <select
                  value={newLogCategory}
                  onChange={(e) => setNewLogCategory(e.target.value as BOMCategory)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Smart Access Control">Smart Access Control</option>
                  <option value="Smart Thermostats & HVAC">Smart Thermostats &amp; HVAC</option>
                  <option value="IoT Gateways & Mesh">IoT Gateways &amp; Mesh</option>
                  <option value="Common Area & Utilities">Common Area &amp; Utilities</option>
                  <option value="Sensors & Leak Protection">Sensors &amp; Leak Protection</option>
                  <option value="Bulk Managed Wi-Fi">Bulk Managed Wi-Fi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Physical Building &amp; Location Completed
                </label>
                <input
                  type="text"
                  value={newLogLocation}
                  onChange={(e) => setNewLogLocation(e.target.value)}
                  placeholder="e.g. Building 2 - Floors 2 & 3 (Units 201-224), Clubhouse East Gate"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Field Notes &amp; Observations
                </label>
                <textarea
                  rows={3}
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                  placeholder="Mortise fit, strike plates aligned, signal checked, confirmed online in software..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDailyLogModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Save Daily Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SYNC INSTALLATION EVENTS TO GOOGLE CALENDAR                        */}
      {/* ========================================================================= */}
      {isCalendarSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base font-['Plus_Jakarta_Sans']">
                    Sync Installation Events to Google Calendar
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review and confirm the installation events to push to your shared Google Calendar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarSyncModalOpen(false)}
                disabled={isSyncingCalendar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
              {/* Target Calendar ID Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Target Google Calendar ID
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-800 break-all mt-0.5">
                    {INSTALLATION_CALENDAR_ID}
                  </div>
                </div>
                <a
                  href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
                    INSTALLATION_CALENDAR_ID
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg shrink-0 transition-colors"
                >
                  <span>Open Calendar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Event Source Toggles */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Event Types to Include
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={syncIncludeProjectWindows}
                      onChange={(e) => setSyncIncludeProjectWindows(e.target.checked)}
                      disabled={isSyncingCalendar}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">Active Project Windows</div>
                      <div className="text-[11px] text-slate-500">
                        Start &amp; target completion dates ({filteredProjects.length} sites)
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={syncIncludeSowScopes}
                      onChange={(e) => setSyncIncludeSowScopes(e.target.checked)}
                      disabled={isSyncingCalendar}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">SOW Forecaster Scopes</div>
                      <div className="text-[11px] text-slate-500">
                        Scheduled building &amp; hardware install windows
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={syncIncludeDailyLogs}
                      onChange={(e) => setSyncIncludeDailyLogs(e.target.checked)}
                      disabled={isSyncingCalendar}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">Daily Field Install Logs</div>
                      <div className="text-[11px] text-slate-500">
                        Completed daily crew logs ({Math.min(filteredDailyLogs.length, 20)} entries)
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={syncIncludePipeline}
                      onChange={(e) => setSyncIncludePipeline(e.target.checked)}
                      disabled={isSyncingCalendar}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="font-bold text-slate-800">2027–2028 Pipeline Targets</div>
                      <div className="text-[11px] text-slate-500">
                        Long-range quarterly deployment milestones ({futurePipeline.length})
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Event Preview & Individual Confirmation List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Confirm Events to Sync ({selectedEventsToSync.length} of{' '}
                    {candidateCalendarEvents.length} selected)
                  </span>
                  {candidateCalendarEvents.length > 0 && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setExcludedSyncKeys(new Set())}
                        disabled={isSyncingCalendar}
                        className="text-sky-600 hover:text-sky-800 font-bold cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() =>
                          setExcludedSyncKeys(
                            new Set(candidateCalendarEvents.map((e) => e.syncKey))
                          )
                        }
                        disabled={isSyncingCalendar}
                        className="text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                      >
                        Deselect All
                      </button>
                    </div>
                  )}
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto bg-slate-50/50">
                  {candidateCalendarEvents.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Select at least one event category above to preview installation events.
                    </div>
                  ) : (
                    candidateCalendarEvents.map((ev) => {
                      const isChecked = !excludedSyncKeys.has(ev.syncKey);
                      return (
                        <label
                          key={ev.syncKey}
                          className="flex items-start gap-2.5 p-2.5 hover:bg-white transition-colors cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSyncEventSelection(ev.syncKey)}
                            disabled={isSyncingCalendar}
                            className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-900 truncate">
                                {ev.summary}
                              </span>
                              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 rounded border border-slate-200 shrink-0">
                                {ev.startDate}
                                {ev.endDate && ev.endDate !== ev.startDate
                                  ? ` → ${ev.endDate}`
                                  : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="text-sky-700 font-semibold">{ev.eventType}</span>
                              {ev.location && (
                                <>
                                  <span>·</span>
                                  <span className="truncate">{ev.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Progress / Error / Results Feedback */}
              {isSyncingCalendar && syncProgress && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                      Syncing events to Google Calendar...
                    </span>
                    <span className="font-mono">
                      {syncProgress.completed} / {syncProgress.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 transition-all duration-200"
                      style={{
                        width: `${Math.round(
                          (syncProgress.completed / Math.max(syncProgress.total, 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-sky-700 truncate">
                    {syncProgress.currentSummary}
                  </div>
                </div>
              )}

              {syncError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <div className="font-bold">Calendar Sync Notice</div>
                    <div>{syncError}</div>
                    <div className="pt-1">
                      <GoogleSignInButton
                        label="Sign in / Authorize Google Calendar"
                        onSuccess={() => setSyncError(null)}
                        onError={(msg) => setSyncError(msg)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {syncResults && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2.5 text-xs text-emerald-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        Synced {syncResults.length} Installation Event
                        {syncResults.length === 1 ? '' : 's'} to Google Calendar!
                      </span>
                    </div>
                    <a
                      href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
                        INSTALLATION_CALENDAR_ID
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-800 underline hover:text-emerald-950"
                    >
                      <span>View in Google Calendar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Created:{' '}
                    <strong>
                      {syncResults.filter((r) => r.action === 'created').length}
                    </strong>{' '}
                    · Updated existing:{' '}
                    <strong>
                      {syncResults.filter((r) => r.action === 'updated').length}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Auth & Confirmation Controls */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="text-[11px] text-slate-500">
                {calendarAuthState.needsAuth ? (
                  <span>Sign in with your Google account to enable calendar syncing.</span>
                ) : (
                  <span>
                    Authenticated as{' '}
                    <strong className="text-slate-800">
                      {calendarAuthState.email || 'Google Workspace User'}
                    </strong>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCalendarSyncModalOpen(false)}
                  disabled={isSyncingCalendar}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  {syncResults ? 'Close' : 'Cancel'}
                </button>

                {calendarAuthState.needsAuth ? (
                  <GoogleSignInButton
                    label="Sign in with Google"
                    onSuccess={() => setSyncError(null)}
                    onError={(msg) => setSyncError(msg)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmCalendarSync}
                    disabled={isSyncingCalendar || selectedEventsToSync.length === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {isSyncingCalendar
                        ? 'Syncing...'
                        : `Confirm & Sync ${selectedEventsToSync.length} Event${
                            selectedEventsToSync.length === 1 ? '' : 's'
                          }`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
