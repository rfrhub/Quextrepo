/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Quote,
  OperationProject,
  DealStage,
  ProjectStatusTag,
  FieldTechName,
  ProjectActivityNotification,
  normalizeFieldTech,
  checkAndApplyCsmHandoffAutoClose,
  getProjectIntegratorPartners,
} from './types';
import {
  loadStoredQuotes,
  saveStoredQuotes,
  loadStoredProjects,
  saveStoredProjects,
  createProjectFromQuote,
  INITIAL_QUOTES,
  INITIAL_PROJECTS,
} from './data/initialData';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { InstallationTimeline } from './components/InstallationTimeline';
import { OperationsView } from './components/OperationsView';
import { QuotesPipelineView } from './components/QuotesPipelineView';
import { QuoteAnalysisView } from './components/QuoteAnalysisView';
import { CustomerKickoffWalkthrough } from './components/CustomerKickoffWalkthrough';
import { ProductAcceptancePortalModal } from './components/ShippingDockSection';
import { QuextVisionFocusController, FocusModeType } from './components/QuextVisionFocusController';
import { FieldTechPortal, FieldTechLoginModal } from './components/FieldTechPortal';
import { RightNotificationsDock } from './components/RightNotificationsDock';
import { QuextLogo } from './components/QuextLogo';
import { MyQuextPlatformShell, MyQuextTopTab } from './components/MyQuextPlatformShell';
import { SOWFormAutomationHub } from './components/SOWFormAutomationHub';
import { PMTutorialGuide, TutorialNavigationTarget } from './components/PMTutorialGuide';
import {
  MyQuextLoginPage,
  MyQuextSignedInUser,
  resolveEmailToMyQuextUser,
} from './components/MyQuextLoginPage';
import { syncLiveOpportunitiesFromMyQuext } from './services/myquextLiveSync';
import {
  subscribeToLiveProjects,
  subscribeToLiveQuotes,
  saveLiveProject,
  saveLiveQuote,
} from './services/realtimeSyncService';
import PartnerAcademyApp from './partner-academy/App';
import {
  buildProjectPrePackagedBundle,
  resolveMyQuextEmailIdentity,
  PARTNER_IDENTITY_DIRECTORY,
} from './partner-academy/utils/projectCoursePackager';
import { RotateCcw, ArrowLeft, Building2, Mail, Eye } from 'lucide-react';

function extractKickoffIdFromLocation(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';
  const search = window.location.search || '';
  const searchParams = new URLSearchParams(
    search || (hash.includes('?') ? hash.split('?')[1] : '')
  );

  const queryId = searchParams.get('customer-kickoff') || searchParams.get('kickoff');
  if (queryId) return decodeURIComponent(queryId.trim());

  if (hash.includes('/customer-kickoff/')) {
    const parts = hash.split('/customer-kickoff/');
    if (parts[1]) {
      return decodeURIComponent(parts[1].split('?')[0].replace(/\/+$/, '').trim());
    }
  }
  if (hash.includes('/kickoff/')) {
    const parts = hash.split('/kickoff/');
    if (parts[1]) {
      return decodeURIComponent(parts[1].split('?')[0].replace(/\/+$/, '').trim());
    }
  }
  return null;
}

function extractAcceptanceIdFromLocation(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';
  if (hash.includes('/product-acceptance/')) {
    const parts = hash.split('/product-acceptance/');
    if (parts[1]) {
      return decodeURIComponent(parts[1].split('?')[0].replace(/\/+$/, '').trim());
    }
  }
  return null;
}

export default function App() {
  const [quotes, setQuotes] = useState<Quote[]>(() => loadStoredQuotes());
  const [projects, setProjects] = useState<OperationProject[]>(() => loadStoredProjects());

  // Signed-in myquext.com user state (null = show myquext.com Welcome Back login screen)
  const [signedInUser, setSignedInUser] = useState<MyQuextSignedInUser | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('/login')) {
      return null;
    }
    return resolveEmailToMyQuextUser('raul.recalde@onequext.com');
  });

  // Field Tech Portal toggle state (null = viewing myquext.com shell; 'Sean Gates' | 'Hector Lopez' = viewing Field Tech Portal)
  const [loggedInFieldTech, setLoggedInFieldTech] = useState<FieldTechName | null>(null);
  // Partner Academy Login state (routed directly when an Integrator Partner signs in at myquext.com)
  const [loggedInPartnerAcademy, setLoggedInPartnerAcademy] = useState<{
    email: string;
    companyId?: string;
    partnerShortName?: string;
    selectedProjectId?: string | null;
  } | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('/partner-academy')) {
      return {
        email: PARTNER_IDENTITY_DIRECTORY[0].defaultEmail,
        companyId: PARTNER_IDENTITY_DIRECTORY[0].companyId,
        partnerShortName: PARTNER_IDENTITY_DIRECTORY[0].partnerShortName,
        selectedProjectId: null,
      };
    }
    return null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isSowHubOpen, setIsSowHubOpen] = useState<boolean>(false);

  // Live Right-Side Notification Dock auto-slide-out state (5-second reveal)
  const [latestNotification, setLatestNotification] = useState<ProjectActivityNotification | null>(null);
  const [autoPopTriggerKey, setAutoPopTriggerKey] = useState<number>(0);

  // Navigation states
  const [isMyQuextShellMode, setIsMyQuextShellMode] = useState<boolean>(true);
  const [myQuextTopTab, setMyQuextTopTab] = useState<MyQuextTopTab>('salesHub');
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);
  const [lastSyncedInfo, setLastSyncedInfo] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<'home' | 'operations' | 'timeline' | 'quotes' | 'analysis'>('operations');
  const [operationsSubTab, setOperationsSubTab] = useState<string>('dashboard');
  const [selectedAnalysisQuoteId, setSelectedAnalysisQuoteId] = useState<string>(() => {
    const initialQuotes = loadStoredQuotes();
    return initialQuotes[0]?.id || '0SD2YXBmJXWZa1qM7Rk4';
  });
  const [standaloneKickoffProjectId, setStandaloneKickoffProjectId] = useState<string | null>(
    extractKickoffIdFromLocation
  );
  const [standaloneAcceptanceProjectId, setStandaloneAcceptanceProjectId] = useState<string | null>(
    extractAcceptanceIdFromLocation
  );

  // PM Onboarding Tutorial Guidance Feature State
  const [isPMTutorialOpen, setIsPMTutorialOpen] = useState<boolean>(false);
  const [pmTutorialStep, setPmTutorialStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quext_pm_tutorial_step');
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0) return idx;
      }
    } catch {
      // ignore
    }
    return 0;
  });
  const [pmProjectDetailTab, setPmProjectDetailTab] = useState<'field-bom' | 'customer-comms' | 'customer-kickoff'>('field-bom');

  useEffect(() => {
    try {
      localStorage.setItem('quext_pm_tutorial_step', pmTutorialStep.toString());
    } catch {
      // ignore
    }
  }, [pmTutorialStep]);

  // Real-Time Cloud Firestore Sync for multi-user out-of-state collaboration
  const seenCloudNotifIdsRef = useRef<Set<string>>(new Set());
  const isInitialSnapshotRef = useRef<boolean>(true);

  useEffect(() => {
    const unsubProjects = subscribeToLiveProjects((liveProjects) => {
      // First snapshot on startup: record existing IDs without triggering popup
      if (isInitialSnapshotRef.current) {
        liveProjects.forEach((p) => {
          (p.activityNotifications || []).forEach((n) => seenCloudNotifIdsRef.current.add(n.id));
        });
        isInitialSnapshotRef.current = false;
        setProjects(liveProjects);
        return;
      }

      // Subsequent snapshots from Cloud Firestore: inspect for notifications generated by other users (Integrator Partners, Field Techs, etc.)
      let incomingLatest: ProjectActivityNotification | null = null;
      liveProjects.forEach((p) => {
        (p.activityNotifications || []).forEach((n) => {
          if (!seenCloudNotifIdsRef.current.has(n.id)) {
            seenCloudNotifIdsRef.current.add(n.id);
            const myName = (signedInUser?.name || 'Raul Recalde').trim().toLowerCase();
            const actor = (n.actorName || '').trim().toLowerCase();
            const isSelf = actor === myName || (actor.length > 0 && (actor.startsWith(myName) || myName.startsWith(actor)));
            if (!isSelf) {
              if (!incomingLatest || new Date(n.createdAtIso || 0) > new Date(incomingLatest.createdAtIso || 0)) {
                incomingLatest = n;
              }
            }
          }
        });
      });

      setProjects(liveProjects);

      if (incomingLatest) {
        setLatestNotification(incomingLatest);
        setAutoPopTriggerKey((prev) => prev + 1);
      }
    });

    const unsubQuotes = subscribeToLiveQuotes((liveQuotes) => {
      setQuotes(liveQuotes);
    });

    return () => {
      unsubProjects();
      unsubQuotes();
    };
  }, [signedInUser]);

  // Secret 4-Part Focus Mode / Quext Vision states
  const [focusMode, setFocusMode] = useState<FocusModeType>('none');
  const [focusedProjectId, setFocusedProjectId] = useState<string>(() => {
    const initial = loadStoredProjects();
    return initial[0]?.id || '';
  });

  // Live sync handler with https://myquext.com Firestore
  const handleSyncLiveMyQuext = async () => {
    setIsSyncingLive(true);
    try {
      const res = await syncLiveOpportunitiesFromMyQuext(quotes as any, projects);
      setQuotes(res.quotes);
      saveStoredQuotes(res.quotes);

      // CRITICAL SAFEGUARD: Never overwrite any project information when live sync runs!
      // All existing projects remain 100% immutable and intact.
      setProjects((currentProjects) => {
        const existingProjectIds = new Set(currentProjects.map((p) => p.id));
        const existingQuoteIds = new Set(currentProjects.map((p) => p.quoteId).filter(Boolean));
        const existingQuoteNumbers = new Set(
          currentProjects.map((p) => (p.quoteNumber || '').trim().toLowerCase()).filter(Boolean)
        );
        const existingPropNames = new Set(
          currentProjects.map((p) => (p.propertyName || '').trim().toLowerCase()).filter(Boolean)
        );
        const existingAlphaNames = new Set(
          currentProjects
            .map((p) => (p.propertyName || '').toLowerCase().replace(/[^a-z0-9]/g, ''))
            .filter(Boolean)
        );

        // Filter for truly new projects that don't match any existing project by ID, quoteId, quoteNumber, or propertyName
        const trulyNewProjects = (res.projects || []).filter((p) => {
          const pId = p.id;
          const qId = p.quoteId;
          const qNum = (p.quoteNumber || '').trim().toLowerCase();
          const propName = (p.propertyName || '').trim().toLowerCase();
          const alphaName = (p.propertyName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

          if (existingProjectIds.has(pId)) return false;
          if (qId && existingQuoteIds.has(qId)) return false;
          if (qNum && existingQuoteNumbers.has(qNum)) return false;
          if (propName && existingPropNames.has(propName)) return false;
          if (alphaName && existingAlphaNames.has(alphaName)) return false;

          return true;
        });

        if (trulyNewProjects.length === 0) {
          // Zero modifications to existing projects
          return currentProjects;
        }

        // Only append truly new won projects; all existing projects remain untouched
        const merged = [...currentProjects, ...trulyNewProjects];
        saveStoredProjects(merged);
        return merged;
      });

      setLastSyncedInfo(
        `Synced ${res.syncedCount} live myquext.com opportunities (${res.newWonCount} newly won) at ${new Date().toLocaleTimeString()}`
      );
    } catch (err: any) {
      console.warn('Live myquext.com sync warning:', err);
      setLastSyncedInfo(`Using bundled myquext.com snapshot (${quotes.length} opportunities)`);
    } finally {
      setIsSyncingLive(false);
    }
  };

  // Automatically check 7-day CSM Handoff auto-close rule on mount
  useEffect(() => {
    setProjects((prev) => {
      let changed = false;
      const checked = prev.map((proj) => {
        const afterCheck = checkAndApplyCsmHandoffAutoClose(proj);
        if (afterCheck !== proj) changed = true;
        return afterCheck;
      });
      if (changed) {
        saveStoredProjects(checked);
        return checked;
      }
      return prev;
    });
  }, []);

  // Handle URL hash and ?email= parameter on load and change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(
        window.location.search || (hash.includes('?') ? hash.split('?')[1] : '')
      );
      const emailParam = searchParams.get('email');

      if (emailParam) {
        const resolved = resolveMyQuextEmailIdentity(emailParam, projects);
        if (resolved.portal === 'partner_academy') {
          setLoggedInFieldTech(null);
          setLoggedInPartnerAcademy({
            email: resolved.email,
            companyId: resolved.companyId,
            partnerShortName: resolved.partnerShortName,
          });
          return;
        }
        if (resolved.portal === 'field_tech') {
          setLoggedInPartnerAcademy(null);
          setLoggedInFieldTech(resolved.fieldTech);
          return;
        }
        if (resolved.portal === 'pm_operations') {
          setLoggedInPartnerAcademy(null);
          setLoggedInFieldTech(null);
          setSignedInUser(resolveEmailToMyQuextUser(resolved.email));
        }
      }

      if (hash.includes('/login')) {
        setLoggedInFieldTech(null);
        setLoggedInPartnerAcademy(null);
        setSignedInUser(null);
        return;
      }

      // Check if Partner Academy hash is accessed directly
      if (hash.includes('/partner-academy')) {
        setLoggedInFieldTech(null);
        setLoggedInPartnerAcademy((prev) =>
          prev || {
            email: PARTNER_IDENTITY_DIRECTORY[0].defaultEmail,
            companyId: PARTNER_IDENTITY_DIRECTORY[0].companyId,
            partnerShortName: PARTNER_IDENTITY_DIRECTORY[0].partnerShortName,
          }
        );
        return;
      }

      // Check if Field Tech direct login hash is accessed
      if (hash.includes('/field-tech/')) {
        const lower = hash.toLowerCase();
        if (lower.includes('sean')) {
          setLoggedInPartnerAcademy(null);
          setLoggedInFieldTech('Sean Gates');
          return;
        }
        if (lower.includes('hector')) {
          setLoggedInPartnerAcademy(null);
          setLoggedInFieldTech('Hector Lopez');
          return;
        }
      }

      // Check if standalone customer kickoff link is accessed
      // Supports #/customer-kickoff/:id, #/kickoff/:id, or ?customer-kickoff=:id or ?kickoff=:id
      const detectedKickoffId = extractKickoffIdFromLocation();
      if (detectedKickoffId) {
        setStandaloneKickoffProjectId(detectedKickoffId);
        setStandaloneAcceptanceProjectId(null);
        setLoggedInFieldTech(null);
        setLoggedInPartnerAcademy(null);
        return;
      } else {
        setStandaloneKickoffProjectId(null);
      }

      // Check if standalone product acceptance portal link is accessed
      const detectedAcceptanceId = extractAcceptanceIdFromLocation();
      if (detectedAcceptanceId) {
        setStandaloneAcceptanceProjectId(detectedAcceptanceId);
        setStandaloneKickoffProjectId(null);
        return;
      } else {
        setStandaloneAcceptanceProjectId(null);
      }

      if (hash.includes('/partner-academy') || hash.includes('#partner-academy')) {
        setLoggedInPartnerAcademy((prev) => prev || {
          email: PARTNER_IDENTITY_DIRECTORY[0].defaultEmail,
          companyId: PARTNER_IDENTITY_DIRECTORY[0].companyId,
          partnerShortName: PARTNER_IDENTITY_DIRECTORY[0].partnerShortName,
          selectedProjectId: null,
        });
        return;
      }

      if (hash.includes('/analysis/')) {
        const parts = hash.split('/analysis/');
        if (parts[1]) {
          setSelectedAnalysisQuoteId(parts[1]);
          setMainTab('analysis');
          setMyQuextTopTab('operations');
        }
      } else if (hash.includes('/operations')) {
        const parts = hash.split('/operations');
        const sub = parts[1] ? parts[1].replace(/^\//, '') : '';
        setMainTab('operations');
        if (sub) {
          setOperationsSubTab(sub);
        }
        setMyQuextTopTab('operations');
      } else if (hash.includes('#/catalog') || hash.includes('#catalog')) {
        setMyQuextTopTab('productCatalog');
      } else if (hash.includes('#/timeline') || hash.includes('#timeline')) {
        setMainTab('timeline');
        setMyQuextTopTab('operations');
      } else if (hash.includes('#/quotes') || hash.includes('#quotes')) {
        setMainTab('quotes');
        setMyQuextTopTab('salesHub');
      } else if (hash.includes('#/home') || hash.includes('#home')) {
        setMainTab('home');
        setMyQuextTopTab('operations');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync projects with quotes marked as "Deal Won"
  const handleUpdateQuoteStage = (
    quoteId: string,
    newStage: DealStage,
    myquextStageLabel?: string
  ) => {
    const updatedQuotes = quotes.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          stage: newStage,
          myquextStage: myquextStageLabel || (newStage === 'Deal Won' ? 'Deal Won' : newStage),
          stageUpdatedAt: new Date().toISOString(),
        };
      }
      return q;
    });

    setQuotes(updatedQuotes);
    saveStoredQuotes(updatedQuotes);
    const updatedQ = updatedQuotes.find((q) => q.id === quoteId);
    if (updatedQ) {
      saveLiveQuote(updatedQ).catch((e) => console.warn('[Cloud Sync] Quote save deferred:', e));
    }

    // If marked as Deal Won, check if project exists; if not, create one!
    if (newStage === 'Deal Won') {
      const existingProject = projects.find((p) => p.id === quoteId || p.quoteId === quoteId);
      if (!existingProject) {
        const quoteObj = updatedQuotes.find((q) => q.id === quoteId);
        if (quoteObj) {
          const newProject = createProjectFromQuote(quoteObj);
          const notif: ProjectActivityNotification = {
            id: `notif-won-${Date.now()}`,
            projectId: newProject.id,
            propertyName: newProject.propertyName,
            assignedPMName: newProject.assignedPM.name,
            assignedFieldTech: newProject.assignedFieldTech || 'Hector Lopez',
            timestamp: 'Just now',
            createdAtIso: new Date().toISOString(),
            audience: 'pm',
            category: 'pm_update',
            title: `New Deal Won Project Provisioned: ${newProject.propertyName}`,
            details: `${newProject.unitsCount} units (${newProject.clientName}) moved to Deal Won in myquext.com Sales Hub and added to Operations.`,
            actorName: quoteObj.assignedSalesLead || 'Raul Recalde',
            badgeLabel: 'Deal Won → Ops',
          };
          newProject.activityNotifications = [notif, ...(newProject.activityNotifications || [])];
          const updatedProjects = [newProject, ...projects];
          setProjects(updatedProjects);
          saveStoredProjects(updatedProjects);
          saveLiveProject(newProject).catch((e) => console.warn('[Cloud Sync] Project save deferred:', e));
          setLatestNotification(notif);
          setAutoPopTriggerKey((k) => k + 1);
        }
      }
    }
  };

  // Create a brand new opportunity in Sales Hub
  const handleCreateNewOpportunity = (newQuote: Quote, markWonImmediately: boolean) => {
    const updatedQuotes = [newQuote, ...quotes];
    setQuotes(updatedQuotes);
    saveStoredQuotes(updatedQuotes);
    saveLiveQuote(newQuote).catch((e) => console.warn('[Cloud Sync] Quote save deferred:', e));

    if (markWonImmediately) {
      const newProject = createProjectFromQuote(newQuote);
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      saveStoredProjects(updatedProjects);
      saveLiveProject(newProject).catch((e) => console.warn('[Cloud Sync] Project save deferred:', e));
    }
  };

  // Update project & automatically generate notifications for Customer Updates (PM dock + Latest Updates) and PM / Installer Log Updates (Field Tech dock)
  const handleUpdateProject = (updated: OperationProject) => {
    const prevProject = projects.find((p) => p.id === updated.id);
    let enrichedProject = { ...updated };
    let triggeredNotif: ProjectActivityNotification | null = null;

    if (prevProject) {
      const prevNotifCount = (prevProject.activityNotifications || []).length;
      const nextNotifCount = (updated.activityNotifications || []).length;

      // 1. Check if a new notification was already explicitly attached (e.g. from CustomerKickoffWalkthrough)
      if (nextNotifCount > prevNotifCount && updated.activityNotifications?.[0]) {
        triggeredNotif = updated.activityNotifications[0];
      }

      const now = new Date();
      const formattedTime = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const techName = normalizeFieldTech(updated.assignedFieldTech);

      // 2. Check if Customer signed Product Acceptance
      if (
        !triggeredNotif &&
        updated.productAcceptanceSubmission &&
        JSON.stringify(prevProject.productAcceptanceSubmission) !==
          JSON.stringify(updated.productAcceptanceSubmission)
      ) {
        const sub = updated.productAcceptanceSubmission;
        const custAccNotif: ProjectActivityNotification = {
          id: `notif-acc-${updated.id}-${Date.now()}`,
          projectId: updated.id,
          propertyName: updated.propertyName,
          assignedPMName: updated.assignedPM.name,
          assignedFieldTech: techName,
          timestamp: formattedTime,
          createdAtIso: now.toISOString(),
          audience: 'pm',
          category: 'customer_acceptance',
          title: `Customer Signed Product Acceptance (${sub.signedByName})`,
          details: `${sub.signedByTitle} (${sub.signedByEmail}) signed off on hardware delivery for ${updated.propertyName}.`,
          actorName: sub.signedByName,
          badgeLabel: 'Customer Acceptance',
        };
        enrichedProject.activityNotifications = [
          custAccNotif,
          ...(enrichedProject.activityNotifications || []),
        ];
        triggeredNotif = custAccNotif;
      }

      // 3. Check for changes in the Installer Log section (installLogs or BOM postItLogs) -> Field Tech Notification
      const prevLogsJson = JSON.stringify(prevProject.installLogs || []);
      const nextLogsJson = JSON.stringify(updated.installLogs || []);
      const prevPostItsJson = JSON.stringify(
        (prevProject.bomItems || []).map((b) => b.postItLogs || [])
      );
      const nextPostItsJson = JSON.stringify(
        (updated.bomItems || []).map((b) => b.postItLogs || [])
      );

      if (prevLogsJson !== nextLogsJson || prevPostItsJson !== nextPostItsJson) {
        const prevLen = (prevProject.installLogs || []).length;
        const nextLen = (updated.installLogs || []).length;
        const latestLog = updated.installLogs?.[0];

        let logTitle = `Installer Log Updated on ${updated.propertyName}`;
        let logDetails = `Verification log updated for ${updated.propertyName}.`;
        let actor = techName;

        if (nextLen > prevLen && latestLog) {
          logTitle = `New Installer Log: +${latestLog.quantityCompleted} ${latestLog.itemName}`;
          logDetails = `${latestLog.locationCompleted} · Verified by ${latestLog.installerName} (${latestLog.statusCheck})${
            latestLog.notes ? ` — "${latestLog.notes}"` : ''
          }`;
          actor = normalizeFieldTech(latestLog.installerName);
        } else if (nextLen < prevLen) {
          logTitle = `Installer Log Entry Removed (${updated.propertyName})`;
          logDetails = `An installer completion log entry was removed from the verification log.`;
        } else if (latestLog) {
          logTitle = `Installer Log Edited: ${latestLog.itemName}`;
          logDetails = `${latestLog.locationCompleted} (${latestLog.quantityCompleted} units · ${latestLog.statusCheck})`;
          actor = normalizeFieldTech(latestLog.installerName);
        }

        const isPartnerLog = latestLog?.submittedByRole === 'integrator_partner';
        const installerNotif: ProjectActivityNotification = {
          id: `notif-ft-log-${updated.id}-${Date.now()}`,
          projectId: updated.id,
          propertyName: updated.propertyName,
          assignedPMName: updated.assignedPM.name,
          assignedFieldTech: techName,
          timestamp: formattedTime,
          createdAtIso: now.toISOString(),
          audience: 'all',
          category: 'installer_log',
          section: 'installer_logs',
          sectionTargetId: 'pm-installer-logs',
          actorRole: isPartnerLog ? 'installer_partner' : (loggedInFieldTech ? 'field_tech' : 'pm'),
          title: logTitle,
          details: logDetails,
          actorName: latestLog?.installerName || actor,
          badgeLabel: isPartnerLog ? 'Partner Field Log' : 'Installer Log Update',
        };
        enrichedProject.activityNotifications = [
          installerNotif,
          ...(enrichedProject.activityNotifications || []),
        ];
        if (!triggeredNotif || loggedInFieldTech || isPartnerLog) {
          triggeredNotif = installerNotif;
        }
      } else {
        // 4. Check for PM updates on the project (SOW Forecaster, Shipping Dock, BOM quantities, Notes, Milestones, Doors, Status) -> Field Tech Notification
        const sowChanged =
          JSON.stringify(prevProject.sowForecastItems || []) !==
          JSON.stringify(updated.sowForecastItems || []);
        const shippingChanged =
          JSON.stringify(prevProject.shippingDockItems || []) !==
          JSON.stringify(updated.shippingDockItems || []);
        const bomChanged =
          JSON.stringify(
            (prevProject.bomItems || []).map((b) => ({
              id: b.id,
              q: b.quantity,
              i: b.installedCount,
              s: b.sparesDelivered,
            }))
          ) !==
          JSON.stringify(
            (updated.bomItems || []).map((b) => ({
              id: b.id,
              q: b.quantity,
              i: b.installedCount,
              s: b.sparesDelivered,
            }))
          );
        const notesChanged =
          JSON.stringify(prevProject.notes || []) !== JSON.stringify(updated.notes || []);
        const milestonesChanged =
          JSON.stringify(prevProject.milestones || []) !==
          JSON.stringify(updated.milestones || []);
        const doorsChanged =
          JSON.stringify(prevProject.customerIntake?.commonAreaDoors || []) !==
          JSON.stringify(updated.customerIntake?.commonAreaDoors || []);
        const statusChanged = prevProject.statusTag !== updated.statusTag;

        if (
          sowChanged ||
          shippingChanged ||
          bomChanged ||
          notesChanged ||
          milestonesChanged ||
          doorsChanged ||
          statusChanged
        ) {
          let pmTitle = `PM Project Update: ${updated.propertyName}`;
          let pmDetails = `${updated.assignedPM.name} updated project details on ${updated.propertyName}.`;
          let badge = 'PM Project Update';

          if (sowChanged) {
            const latestSow = updated.sowForecastItems?.[0];
            pmTitle = `PM Updated SOW Forecaster (${updated.propertyName})`;
            pmDetails = latestSow
              ? `${updated.assignedPM.name} updated SOW scope: ${latestSow.bomItemName} (${latestSow.forecastedQuantity} units at ${latestSow.buildingOrArea}, ${latestSow.status}).`
              : `${updated.assignedPM.name} modified the SOW Forecaster schedule.`;
            badge = 'SOW Forecaster Update';
          } else if (shippingChanged) {
            const latestShip = updated.shippingDockItems?.[0];
            pmTitle = `PM Updated Shipping Dock (${updated.propertyName})`;
            pmDetails = latestShip
              ? `${updated.assignedPM.name} updated shipment "${latestShip.shipmentBatchLabel}" (${latestShip.shippedQuantity} units via ${latestShip.carrier} · ${latestShip.status}).`
              : `${updated.assignedPM.name} updated the Shipping Dock.`;
            badge = 'Shipping Dock Update';
          } else if (bomChanged) {
            const totalQuoted = updated.bomItems.reduce((a, b) => a + b.quantity, 0);
            const totalInstalled = updated.bomItems.reduce((a, b) => a + b.installedCount, 0);
            pmTitle = `PM Updated Hardware Progress / BOM (${updated.propertyName})`;
            pmDetails = `${updated.assignedPM.name} updated BOM hardware counts: ${totalInstalled.toLocaleString()} / ${totalQuoted.toLocaleString()} devices installed.`;
            badge = 'Hardware BOM Update';
          } else if (notesChanged) {
            const latestNote = updated.notes?.[0];
            pmTitle = `PM Posted Note: ${latestNote?.category || 'Project Update'}`;
            pmDetails = latestNote
              ? `${latestNote.author}: "${latestNote.text}"`
              : `${updated.assignedPM.name} updated project notes.`;
            badge = 'PM Note';
          } else if (doorsChanged) {
            const doorCount = updated.customerIntake?.commonAreaDoors?.length || 0;
            pmTitle = `Common Area Doors Updated (${updated.propertyName})`;
            pmDetails = `Common Area Doors Location Tree & Device Mapping updated (${doorCount} total doors configured).`;
            badge = 'Common Doors Update';
          } else if (milestonesChanged || statusChanged) {
            pmTitle = `PM Updated Schedule / Milestones (${updated.propertyName})`;
            pmDetails = `${updated.assignedPM.name} updated project milestone progress or status tag (${updated.statusTag}).`;
            badge = 'PM Milestone Update';
          }

          const pmNotif: ProjectActivityNotification = {
            id: `notif-ft-pm-${updated.id}-${Date.now()}`,
            projectId: updated.id,
            propertyName: updated.propertyName,
            assignedPMName: updated.assignedPM.name,
            assignedFieldTech: techName,
            timestamp: formattedTime,
            createdAtIso: now.toISOString(),
            audience: 'field_tech',
            category: 'pm_update',
            title: pmTitle,
            details: pmDetails,
            actorName: updated.assignedPM.name,
            badgeLabel: badge,
          };

          enrichedProject.activityNotifications = [
            pmNotif,
            ...(enrichedProject.activityNotifications || []),
          ];
          if (!triggeredNotif || loggedInFieldTech) {
            triggeredNotif = pmNotif;
          }
        }
      }

      // 5. Check if Integrator Partner updated Pre-Installation SOP Checklist
      if (!triggeredNotif) {
        const prevChecklist = prevProject.partnerCourseBundle?.checklist || [];
        const nextChecklist = updated.partnerCourseBundle?.checklist || [];
        const toggledChecklistItem = nextChecklist.find((item) => {
          const prev = prevChecklist.find((p) => p.id === item.id);
          return prev && prev.completed !== item.completed;
        });

        if (toggledChecklistItem) {
          const partnerShortName =
            loggedInPartnerAcademy?.partnerShortName ||
            getProjectIntegratorPartners(updated)[0] ||
            'SKBM';
          const partnerLead =
            PARTNER_IDENTITY_DIRECTORY.find(
              (d) => d.partnerShortName.toLowerCase() === partnerShortName.toLowerCase()
            )?.leadName || 'Shanna Olmstead';
          const actorDisplay = `${partnerLead} (${partnerShortName})`;

          const partnerChecklistNotif: ProjectActivityNotification = {
            id: `notif-partner-sop-${updated.id}-${Date.now()}`,
            projectId: updated.id,
            propertyName: updated.propertyName,
            assignedPMName: updated.assignedPM.name,
            assignedFieldTech: techName,
            timestamp: formattedTime,
            createdAtIso: now.toISOString(),
            audience: 'all',
            category: 'bom_update',
            section: 'bom',
            sectionTargetId: 'pm-bom-table',
            actorRole: 'installer_partner',
            actorName: actorDisplay,
            title: toggledChecklistItem.completed
              ? `Partner Verified SOP: ${toggledChecklistItem.title}`
              : `Partner SOP Reopened: ${toggledChecklistItem.title}`,
            details: `${actorDisplay} ${
              toggledChecklistItem.completed
                ? 'signed off on pre-installation field SOP'
                : 'reopened SOP verification'
            } for ${updated.propertyName}.`,
            badgeLabel: toggledChecklistItem.completed ? 'Partner SOP Verified' : 'Partner SOP Updated',
          };

          enrichedProject.activityNotifications = [
            partnerChecklistNotif,
            ...(enrichedProject.activityNotifications || []),
          ];
          triggeredNotif = partnerChecklistNotif;
        }
      }
    }

    // Always keep the Pre-Packaged Partner Academy Course Bundle synced with the project's BOM & partners
    enrichedProject.partnerCourseBundle = buildProjectPrePackagedBundle(enrichedProject);

    const updatedProjects = projects.map((p) =>
      p.id === enrichedProject.id ? enrichedProject : p
    );
    setProjects(updatedProjects);
    saveStoredProjects(updatedProjects);
    saveLiveProject(enrichedProject).catch((e) =>
      console.warn('[Cloud Sync] Background project save failed:', e)
    );

    if (triggeredNotif) {
      setLatestNotification(triggeredNotif);
      setAutoPopTriggerKey((prev) => prev + 1);
    }
  };

  // Create manual project with automatic Pre-Packaged Partner Academy Course Bundle
  const handleCreateManualProject = (newProject: OperationProject) => {
    const enrichedManual: OperationProject = {
      ...newProject,
      partnerCourseBundle: buildProjectPrePackagedBundle(newProject, 'Manual Project Creation'),
    };
    const updatedProjects = [enrichedManual, ...projects];
    setProjects(updatedProjects);
    saveStoredProjects(updatedProjects);
    saveLiveProject(enrichedManual).catch((e) =>
      console.warn('[Cloud Sync] Background manual project save failed:', e)
    );
  };

  // Update status tag directly
  const handleUpdateProjectStatusTag = (projectId: string, newTag: ProjectStatusTag) => {
    const target = projects.find((p) => p.id === projectId);
    if (target) {
      handleUpdateProject({
        ...target,
        statusTag: newTag,
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  // View quote analysis
  const handleViewQuoteAnalysis = (quoteId: string) => {
    setSelectedAnalysisQuoteId(quoteId);
    setMainTab('analysis');
    setMyQuextTopTab('operations');
    window.location.hash = `/analysis/${quoteId}`;
  };

  // Switch to project under Operations
  const handleGoToOperationsProject = (projectId: string, sectionTargetId?: string) => {
    setStandaloneKickoffProjectId(null);
    setFocusedProjectId(projectId);
    setMainTab('operations');
    setOperationsSubTab(projectId);
    setMyQuextTopTab('operations');
    window.location.hash = `/operations/${projectId}`;

    if (sectionTargetId) {
      setTimeout(() => {
        const cleanId = sectionTargetId.replace(/^#/, '');
        const target =
          document.getElementById(cleanId) ||
          document.querySelector(`[data-tutorial-id="${cleanId}"]`) ||
          document.querySelector(sectionTargetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 350);
    }
  };

  // Switch directly to Installation Overview Dashboard under Operations
  const handleGoToOperationsDashboard = () => {
    setStandaloneKickoffProjectId(null);
    setMainTab('operations');
    setOperationsSubTab('dashboard');
    setMyQuextTopTab('operations');
    window.location.hash = '/operations/dashboard';
  };

  // Reset to initial myquext.com data
  const handleResetData = () => {
    if (window.confirm('Reset all opportunities, field installation logs, and BOM counts to the default myquext.com dataset?')) {
      setQuotes(INITIAL_QUOTES);
      setProjects(INITIAL_PROJECTS);
      saveStoredQuotes(INITIAL_QUOTES);
      saveStoredProjects(INITIAL_PROJECTS);
      setOperationsSubTab('dashboard');
      setStandaloneKickoffProjectId(null);
    }
  };

  // Dedicated Tutorial Navigator driving views across myquext.com, Field Tech Portal, and Partner Academy
  const handleTutorialNavigate = (target: TutorialNavigationTarget) => {
    if (target.portal === 'field-tech') {
      const techName = target.fieldTechName || 'Sean Gates';
      setLoggedInPartnerAcademy(null);
      setLoggedInFieldTech(techName);
      window.location.hash = `#/field-tech/${techName.toLowerCase().replace(' ', '-')}`;
      return;
    }

    if (target.portal === 'partner-academy') {
      const partnerShort = target.partnerShortName || 'SKBM';
      const targetProjId = projects[0]?.id || null;
      setLoggedInFieldTech(null);
      setLoggedInPartnerAcademy({
        email: 'skbm.tech@gmail.com',
        companyId: 'skbm_systems',
        partnerShortName: partnerShort,
        selectedProjectId: targetProjId,
      });
      window.location.hash = '#/partner-academy';
      return;
    }

    if (target.portal === 'salesHub') {
      setLoggedInFieldTech(null);
      setLoggedInPartnerAcademy(null);
      setIsMyQuextShellMode(true);
      setMyQuextTopTab('salesHub');
      window.location.hash = '#/quotes';
      return;
    }

    if (target.portal === 'productCatalog' || target.operationsMainTab === 'productCatalog') {
      setLoggedInFieldTech(null);
      setLoggedInPartnerAcademy(null);
      setIsMyQuextShellMode(true);
      setMyQuextTopTab('productCatalog');
      return;
    }

    // Portal === 'operations'
    setLoggedInFieldTech(null);
    setLoggedInPartnerAcademy(null);
    setIsMyQuextShellMode(true);
    setMyQuextTopTab('operations');

    if (target.operationsMainTab) {
      setMainTab(target.operationsMainTab);
    }
    if (target.operationsSubTab) {
      setOperationsSubTab(target.operationsSubTab);
      if (projects.some((p) => p.id === target.operationsSubTab)) {
        setFocusedProjectId(target.operationsSubTab);
        window.location.hash = `/operations/${target.operationsSubTab}`;
      } else {
        window.location.hash = `/operations/${target.operationsSubTab}`;
      }
    }
    if (target.projectDetailTab) {
      setPmProjectDetailTab(target.projectDetailTab);
    }
  };

  // Resolves the project for the standalone customer Product Acceptance Portal.
  // Supports automated projects (converted from Deal Won quotes) and manual projects (created via modal).
  const standaloneAcceptanceProject = useMemo(() => {
    if (!standaloneAcceptanceProjectId) return null;
    const target = standaloneAcceptanceProjectId.trim().toLowerCase();

    // 1. Search in current in-memory projects
    let matched = projects.find(
      (p) =>
        p.id.toLowerCase() === target ||
        (p.quoteId && p.quoteId.toLowerCase() === target) ||
        (p.quoteNumber && p.quoteNumber.toLowerCase() === target)
    );

    // 2. Search in localStorage stored projects
    if (!matched) {
      try {
        const stored = loadStoredProjects();
        matched = stored.find(
          (p) =>
            p.id.toLowerCase() === target ||
            (p.quoteId && p.quoteId.toLowerCase() === target) ||
            (p.quoteNumber && p.quoteNumber.toLowerCase() === target)
        );
      } catch (err) {
        console.error('Error loading stored projects for standalone acceptance', err);
      }
    }

    // 3. Fallback to INITIAL_PROJECTS
    if (!matched) {
      matched = INITIAL_PROJECTS.find(
        (p) =>
          p.id.toLowerCase() === target ||
          (p.quoteId && p.quoteId.toLowerCase() === target) ||
          (p.quoteNumber && p.quoteNumber.toLowerCase() === target)
      );
    }

    // 4. Fuzzy fallback by alphanumeric match
    if (!matched) {
      const cleanAlpha = target.replace(/[^a-z0-9]/g, '');
      if (cleanAlpha.length >= 4) {
        matched =
          projects.find((p) => p.id.replace(/[^a-z0-9]/g, '').toLowerCase().includes(cleanAlpha)) ||
          INITIAL_PROJECTS.find((p) => p.id.replace(/[^a-z0-9]/g, '').toLowerCase().includes(cleanAlpha));
      }
    }

    return matched || null;
  }, [standaloneAcceptanceProjectId, projects]);

  if (standaloneAcceptanceProjectId) {
    if (standaloneAcceptanceProject) {
      return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Inter']">
          {/* Customer Portal Clean White Header */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
            <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QuextLogo />
                <div className="h-4 w-px bg-slate-300"></div>
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Product Acceptance Portal
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Hardware Delivery &amp; Verification
                </span>
              </div>

              {/* Property & Client Info Banner */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{standaloneAcceptanceProject.propertyName}</span>
                {standaloneAcceptanceProject.clientName && (
                  <>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{standaloneAcceptanceProject.clientName}</span>
                  </>
                )}
              </div>

              {/* Controls / Support */}
              <div className="flex items-center gap-2">
                {signedInUser ? (
                  <div className="flex items-center gap-2">
                    <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-800 rounded-md text-[11px] font-mono font-bold">
                      <Eye className="w-3 h-3 text-amber-600" />
                      Quext Team Preview
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGoToOperationsProject(standaloneAcceptanceProject.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to PM Workspace</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="hidden sm:flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Assigned Project Manager
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {standaloneAcceptanceProject.assignedPM?.name || 'Quext Operations Team'}
                      </span>
                    </div>
                    {standaloneAcceptanceProject.assignedPM?.email && (
                      <a
                        href={`mailto:${standaloneAcceptanceProject.assignedPM.email}?subject=Question regarding Product Acceptance for ${encodeURIComponent(standaloneAcceptanceProject.propertyName)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 rounded-lg font-bold text-xs transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        <span>Contact PM</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ProductAcceptancePortalModal
              project={standaloneAcceptanceProject}
              onClose={signedInUser ? () => handleGoToOperationsProject(standaloneAcceptanceProject.id) : undefined}
              onUpdateProject={handleUpdateProject}
              isStandaloneClientView={!signedInUser}
            />
          </main>

          {/* Customer Portal Clean Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} Quext (OneQuext). Official Hardware Delivery &amp; Product Acceptance Portal. Need assistance? Contact{' '}
            <a href="mailto:support@onequext.com" className="text-emerald-700 hover:underline">
              support@onequext.com
            </a>
          </footer>

          {signedInUser && (
            <RightNotificationsDock
              mode="pm"
              projects={projects}
              latestNotification={latestNotification}
              autoPopTriggerKey={autoPopTriggerKey}
              onSelectProject={handleGoToOperationsProject}
              currentUserName={signedInUser?.name}
            />
          )}
        </div>
      );
    }

    // Acceptance Project ID provided, but project not found
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Inter']">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sm:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <QuextLogo />
            <div className="h-4 w-px bg-slate-300"></div>
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              Product Acceptance Portal
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Product Acceptance Portal Not Found
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We couldn&apos;t locate the active shipment acceptance records for project identifier{' '}
              <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-[11px]">
                {standaloneAcceptanceProjectId}
              </code>.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Please check with your assigned Quext Project Manager or contact{' '}
              <a href="mailto:support@onequext.com" className="text-sky-600 underline font-semibold">
                support@onequext.com
              </a>{' '}
              to request an updated portal link.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Resolves the project for the standalone customer kickoff portal.
  // Supports automated projects (converted from Deal Won quotes) and manual projects (created via modal).
  const standaloneProject = useMemo(() => {
    if (!standaloneKickoffProjectId) return null;
    const target = standaloneKickoffProjectId.trim().toLowerCase();

    // 1. Search in current in-memory projects
    let matched = projects.find(
      (p) =>
        p.id.toLowerCase() === target ||
        (p.quoteId && p.quoteId.toLowerCase() === target) ||
        (p.quoteNumber && p.quoteNumber.toLowerCase() === target)
    );

    // 2. Search in localStorage stored projects (handles direct refresh or freshly created manual projects)
    if (!matched) {
      try {
        const stored = loadStoredProjects();
        matched = stored.find(
          (p) =>
            p.id.toLowerCase() === target ||
            (p.quoteId && p.quoteId.toLowerCase() === target) ||
            (p.quoteNumber && p.quoteNumber.toLowerCase() === target)
        );
      } catch (err) {
        console.error('Error loading stored projects for standalone kickoff', err);
      }
    }

    // 3. Fallback to INITIAL_PROJECTS
    if (!matched) {
      matched = INITIAL_PROJECTS.find(
        (p) =>
          p.id.toLowerCase() === target ||
          (p.quoteId && p.quoteId.toLowerCase() === target) ||
          (p.quoteNumber && p.quoteNumber.toLowerCase() === target)
      );
    }

    // 4. Fuzzy fallback by alphanumeric match (handles slugified IDs or property names)
    if (!matched) {
      const cleanAlpha = target.replace(/[^a-z0-9]/g, '');
      const pool = [...projects, ...loadStoredProjects(), ...INITIAL_PROJECTS];
      matched = pool.find(
        (p) =>
          p.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanAlpha ||
          (p.propertyName &&
            p.propertyName.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanAlpha)
      );
    }

    return matched || null;
  }, [standaloneKickoffProjectId, projects]);

  // If a standalone customer kickoff link is accessed, render the customer portal
  if (standaloneKickoffProjectId) {
    if (standaloneProject) {
      return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Inter']">
          {/* Customer Portal Clean White Header */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
            <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QuextLogo />
                <div className="h-4 w-px bg-slate-300"></div>
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Customer Kickoff Portal
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {standaloneProject.isManuallyCreated ? 'Dedicated Property Onboarding' : 'Official Community Kickoff'}
                </span>
              </div>

              {/* Property & Client Info Banner */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{standaloneProject.propertyName}</span>
                {standaloneProject.clientName && (
                  <>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{standaloneProject.clientName}</span>
                  </>
                )}
              </div>

              {/* Controls / Support */}
              <div className="flex items-center gap-2">
                {signedInUser ? (
                  // Internal Quext Employee Preview Control
                  <div className="flex items-center gap-2">
                    <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-800 rounded-md text-[11px] font-mono font-bold">
                      <Eye className="w-3 h-3 text-amber-600" />
                      Quext Team Preview
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGoToOperationsProject(standaloneProject.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to PM Workspace</span>
                    </button>
                  </div>
                ) : (
                  // External Customer View: NO internal buttons! Only PM Contact & Support
                  <div className="flex items-center gap-2.5 text-xs">
                    <div className="hidden sm:flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Assigned Project Manager
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {standaloneProject.assignedPM?.name || 'Quext Implementation Team'}
                      </span>
                    </div>
                    {standaloneProject.assignedPM?.email && (
                      <a
                        href={`mailto:${standaloneProject.assignedPM.email}?subject=Question about ${encodeURIComponent(standaloneProject.propertyName)} Kickoff`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-lg text-xs transition-colors"
                        title="Email your assigned Quext Implementation PM"
                      >
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Contact PM</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CustomerKickoffWalkthrough
              project={standaloneProject}
              onUpdateProject={handleUpdateProject}
              isStandaloneClientView={true}
            />
          </main>

          {/* Customer Portal Clean Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} Quext (OneQuext). Official Multifamily Smart Community Kickoff Portal. Need assistance? Contact{' '}
            <a href="mailto:support@onequext.com" className="text-emerald-700 hover:underline">
              support@onequext.com
            </a>
          </footer>
        </div>
      );
    }

    // Standalone customer kickoff ID was given, but project was not found in storage:
    // Render clean Customer Portal 404/Loading screen, NEVER dropping customer into employee login!
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Inter']">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sm:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <QuextLogo />
            <div className="h-4 w-px bg-slate-300"></div>
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              Customer Kickoff Portal
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Kickoff Walkthrough Not Found
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We couldn&apos;t find the Customer Kickoff Walkthrough matching reference{' '}
              <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                {standaloneKickoffProjectId}
              </code>
              . Please check the link sent by your Quext Implementation Project Manager.
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@onequext.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Quext Support</span>
              </a>
            </div>

            {signedInUser && (
              <div className="pt-4 border-t border-slate-100 text-left space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  PM Quick Switch (Internal Only):
                </span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      window.location.hash = `#/customer-kickoff/${e.target.value}`;
                    }
                  }}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="">Select a project to preview kickoff...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.propertyName} ({p.isManuallyCreated ? 'Manual' : 'Automated'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // If no user is signed in to myquext.com, render the myquext.com Welcome Back login screen
  if (!signedInUser) {
    return (
      <MyQuextLoginPage
        onSignInSuccess={(user) => {
          setSignedInUser(user);
          if (user.accountType === 'integrator_partner') {
            setLoggedInFieldTech(null);
            setLoggedInPartnerAcademy({
              email: user.email,
              companyId: user.partnerCompanyId,
              partnerShortName: user.partnerShortName,
              selectedProjectId: null,
            });
            window.location.hash = '#/partner-academy';
          } else {
            setLoggedInPartnerAcademy(null);
            setLoggedInFieldTech(null);
            window.location.hash = '#/home';
          }
        }}
      />
    );
  }

  // If logged in to the Quext Partner Training & Certification Academy Portal (via Integrator Partner login or project prep bundle)
  if (loggedInPartnerAcademy || signedInUser.accountType === 'integrator_partner') {
    const activePartnerEmail =
      loggedInPartnerAcademy?.email ||
      signedInUser.email ||
      PARTNER_IDENTITY_DIRECTORY[0].defaultEmail;
    const activePartnerCompanyId =
      loggedInPartnerAcademy?.companyId ||
      signedInUser.partnerCompanyId ||
      PARTNER_IDENTITY_DIRECTORY[0].companyId;

    return (
      <>
        <PartnerAcademyApp
          projects={projects}
          onUpdateProject={handleUpdateProject}
          activePartnerEmail={activePartnerEmail}
          activeCompanyId={activePartnerCompanyId}
          initialSelectedProjectId={loggedInPartnerAcademy?.selectedProjectId || null}
          onOpenUnifiedSignInModal={undefined}
          onExitToOperationsHub={() => {
            if (signedInUser.accountType === 'integrator_partner') {
              // Integrator Partners do not have access to internal myquext.com — Sign Out returns to the myquext.com login screen
              setLoggedInPartnerAcademy(null);
              setLoggedInFieldTech(null);
              setSignedInUser(null);
              window.location.hash = '#/login';
            } else {
              // Internal team member returning from viewing a project's Partner Academy bundle
              setLoggedInPartnerAcademy(null);
              window.location.hash = '#/home';
            }
          }}
        />
        {isPMTutorialOpen && (
          <PMTutorialGuide
            isOpen={isPMTutorialOpen}
            onClose={() => setIsPMTutorialOpen(false)}
            onNavigateToView={handleTutorialNavigate}
            projects={projects}
            currentPortal="partner-academy"
            currentStepIndex={pmTutorialStep}
            onStepChange={setPmTutorialStep}
          />
        )}
      </>
    );
  }

  // If toggled into the Field Tech Portal (from the Operations tab button on myquext.com)
  if (loggedInFieldTech) {
    return (
      <>
        <FieldTechPortal
          fieldTech={loggedInFieldTech}
          projects={projects}
          onUpdateProject={handleUpdateProject}
          onSwitchFieldTech={(tech) => {
            setLoggedInFieldTech(tech);
            window.location.hash = `#/field-tech/${tech.toLowerCase().replace(' ', '-')}`;
          }}
          onLogoutToMainSite={() => {
            setLoggedInFieldTech(null);
            setMyQuextTopTab('operations');
            window.location.hash = `/operations/${operationsSubTab}`;
          }}
          onOpenLoginModal={() => {
            setLoggedInFieldTech(null);
            setMyQuextTopTab('operations');
          }}
        />
        <RightNotificationsDock
          mode="field-tech"
          projects={projects}
          fieldTech={loggedInFieldTech}
          latestNotification={latestNotification}
          autoPopTriggerKey={autoPopTriggerKey}
          onSelectProject={handleGoToOperationsProject}
          currentUserName={loggedInFieldTech || undefined}
        />
        {isPMTutorialOpen && (
          <PMTutorialGuide
            isOpen={isPMTutorialOpen}
            onClose={() => setIsPMTutorialOpen(false)}
            onNavigateToView={handleTutorialNavigate}
            projects={projects}
            currentPortal="field-tech"
            currentStepIndex={pmTutorialStep}
            onStepChange={setPmTutorialStep}
          />
        )}
      </>
    );
  }

  const activeQuoteForAnalysis =
    quotes.find((q) => q.id === selectedAnalysisQuoteId) || quotes[0];

  // If in Standard Focus Mode or Quext Vision Mode, replace the entire site view with the Focus Mode controller
  if (focusMode === 'standard' || focusMode === 'quext-vision') {
    return (
      <QuextVisionFocusController
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        projects={projects}
        quotesList={quotes}
        activeProjectId={focusedProjectId || projects[0]?.id || ''}
        onSelectProjectId={setFocusedProjectId}
        onUpdateProject={handleUpdateProject}
      />
    );
  }

  const operationsWorkspaceContent = (
    <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {mainTab === 'home' && (
        <HomeScreen
          projects={projects}
          currentUserName={signedInUser?.name}
          currentUserRole={signedInUser?.roleLabel}
          onNavigateToOperationsDashboard={handleGoToOperationsDashboard}
          onNavigateToAllProjects={() => {
            setMainTab('operations');
            setOperationsSubTab('all-projects');
            window.location.hash = '/operations/all-projects';
          }}
          onNavigateToProject={(projectId) => {
            setFocusedProjectId(projectId);
            handleGoToOperationsProject(projectId);
          }}
          onNavigateToQuotes={() => {
            if (isMyQuextShellMode) {
              setMyQuextTopTab('salesHub');
            } else {
              setMainTab('quotes');
              window.location.hash = '#/quotes';
            }
          }}
          onTriggerSecretFocus={() => setFocusMode('initial-prompt')}
          onOpenPartnerAcademy={(partnerShortName, projectId) => {
            const targetPartner = partnerShortName || PARTNER_IDENTITY_DIRECTORY[0].partnerShortName;
            const resolved = resolveMyQuextEmailIdentity(targetPartner, projects);
            setLoggedInFieldTech(null);
            setLoggedInPartnerAcademy({
              email:
                resolved.portal === 'partner_academy'
                  ? resolved.email
                  : PARTNER_IDENTITY_DIRECTORY[0].defaultEmail,
              companyId:
                resolved.portal === 'partner_academy'
                  ? resolved.companyId
                  : PARTNER_IDENTITY_DIRECTORY[0].companyId,
              partnerShortName: targetPartner,
              selectedProjectId: projectId || null,
            });
            window.location.hash = '#/partner-academy';
          }}
        />
      )}

      {mainTab === 'timeline' && (
        <InstallationTimeline
          projects={projects}
          onSelectProject={(projectId) => {
            handleGoToOperationsProject(projectId);
          }}
          onOpenCustomerKickoff={(projectId) => {
            handleGoToOperationsProject(projectId);
          }}
          onUpdateProject={handleUpdateProject}
        />
      )}

      {mainTab === 'operations' && (
        <OperationsView
          projects={projects}
          quotesList={quotes}
          onUpdateProject={handleUpdateProject}
          onCreateProject={handleCreateManualProject}
          onUpdateProjectStatusTag={handleUpdateProjectStatusTag}
          onViewQuoteAnalysis={handleViewQuoteAnalysis}
          activeSubTab={operationsSubTab}
          projectDetailInitialTab={pmProjectDetailTab}
          onSelectSubTab={(tabId) => {
            if (projects.some((p) => p.id === tabId)) {
              setFocusedProjectId(tabId);
            }
            setOperationsSubTab(tabId);
            window.location.hash = `/operations/${tabId}`;
          }}
          onOpenProjectInPartnerAcademy={(proj) => {
            const firstPartner = (proj.integratorPartners && proj.integratorPartners[0]) || 'SKBM';
            const resolved = resolveMyQuextEmailIdentity(firstPartner, projects);
            setLoggedInFieldTech(null);
            setLoggedInPartnerAcademy({
              email:
                resolved.portal === 'partner_academy'
                  ? resolved.email
                  : PARTNER_IDENTITY_DIRECTORY[0].defaultEmail,
              companyId:
                resolved.portal === 'partner_academy'
                  ? resolved.companyId
                  : PARTNER_IDENTITY_DIRECTORY[0].companyId,
              partnerShortName: firstPartner,
              selectedProjectId: proj.id,
            });
            window.location.hash = '#/partner-academy';
          }}
        />
      )}

      {mainTab === 'quotes' && (
        <QuotesPipelineView
          quotes={quotes}
          onUpdateQuoteStage={handleUpdateQuoteStage}
          onViewQuoteAnalysis={handleViewQuoteAnalysis}
          onGoToOperationsProject={handleGoToOperationsProject}
        />
      )}

      {mainTab === 'analysis' && activeQuoteForAnalysis && (
        <QuoteAnalysisView
          quote={activeQuoteForAnalysis}
          quotesList={quotes}
          onSelectQuoteForAnalysis={(quoteId) => {
            setSelectedAnalysisQuoteId(quoteId);
            window.location.hash = `/analysis/${quoteId}`;
          }}
          onGoToOperationsProject={handleGoToOperationsProject}
        />
      )}
    </main>
  );

  if (isMyQuextShellMode) {
    return (
      <>
        {focusMode === 'initial-prompt' && (
          <QuextVisionFocusController
            focusMode={focusMode}
            setFocusMode={setFocusMode}
            projects={projects}
            quotesList={quotes}
            activeProjectId={focusedProjectId || projects[0]?.id || ''}
            onSelectProjectId={setFocusedProjectId}
            onUpdateProject={handleUpdateProject}
          />
        )}

        <MyQuextPlatformShell
          quotes={quotes as any}
          projects={projects}
          onCreateProject={handleCreateManualProject}
          onUpdateQuoteStage={handleUpdateQuoteStage}
          onCreateNewOpportunity={handleCreateNewOpportunity}
          onSyncLiveMyQuext={handleSyncLiveMyQuext}
          isSyncingLive={isSyncingLive}
          lastSyncedInfo={lastSyncedInfo}
          activeTopTab={myQuextTopTab}
          onSelectTopTab={(tab) => {
            setMyQuextTopTab(tab);
            if (tab === 'operations' && mainTab === 'quotes') {
              setMainTab('operations');
            }
          }}
          operationsMainTab={mainTab}
          onSelectOperationsMainTab={(tab) => {
            setMainTab(tab);
            if (tab === 'analysis') {
              window.location.hash = `/analysis/${selectedAnalysisQuoteId}`;
            } else if (tab === 'operations') {
              window.location.hash = `/operations/${operationsSubTab}`;
            } else if (tab === 'timeline') {
              window.location.hash = '#/timeline';
            } else if (tab === 'quotes') {
              window.location.hash = '#/quotes';
            } else {
              window.location.hash = '#/home';
            }
          }}
          operationsSubTab={operationsSubTab}
          onSelectOperationsSubTab={(sub) => {
            setOperationsSubTab(sub);
            window.location.hash = `/operations/${sub}`;
          }}
          onGoToOperationsDashboard={handleGoToOperationsDashboard}
          onGoToOperationsProject={handleGoToOperationsProject}
          onViewQuoteAnalysis={handleViewQuoteAnalysis}
          currentUserName={signedInUser.name}
          currentUserEmail={signedInUser.email}
          currentUserRoleLabel={signedInUser.roleLabel}
          currentUserAvatarInitial={signedInUser.avatarInitial}
          onSwitchUser={(user) => setSignedInUser(user)}
          onLogout={() => {
            setLoggedInFieldTech(null);
            setLoggedInPartnerAcademy(null);
            setSignedInUser(null);
            window.location.hash = '#/login';
          }}
          onOpenFieldTechPortal={() => {
            const targetTech = signedInUser.fieldTechDefault || 'Sean Gates';
            setLoggedInFieldTech(targetTech);
            window.location.hash = `#/field-tech/${targetTech.toLowerCase().replace(' ', '-')}`;
          }}
          onOpenLoginModal={() => {
            setLoggedInFieldTech(null);
            setLoggedInPartnerAcademy(null);
            setSignedInUser(null);
            window.location.hash = '#/login';
          }}
          onOpenPartnerAcademy={() => {
            setLoggedInFieldTech(null);
            setLoggedInPartnerAcademy({
              email: PARTNER_IDENTITY_DIRECTORY[0].defaultEmail,
              companyId: PARTNER_IDENTITY_DIRECTORY[0].companyId,
              partnerShortName: PARTNER_IDENTITY_DIRECTORY[0].partnerShortName,
              selectedProjectId: null,
            });
            window.location.hash = '#/partner-academy';
          }}
          onOpenSowAutomation={() => setIsSowHubOpen(true)}
          onOpenPMTutorial={() => setIsPMTutorialOpen(true)}
          onResetData={handleResetData}
          onToggleStandaloneMode={() => setIsMyQuextShellMode(false)}
        >
          {operationsWorkspaceContent}
        </MyQuextPlatformShell>

        {isPMTutorialOpen && (
          <PMTutorialGuide
            isOpen={isPMTutorialOpen}
            onClose={() => setIsPMTutorialOpen(false)}
            onNavigateToView={handleTutorialNavigate}
            projects={projects}
            currentPortal="operations"
            currentOperationsMainTab={mainTab}
            currentOperationsSubTab={operationsSubTab}
            currentStepIndex={pmTutorialStep}
            onStepChange={setPmTutorialStep}
          />
        )}

        <RightNotificationsDock
          mode="pm"
          projects={projects}
          latestNotification={latestNotification}
          autoPopTriggerKey={autoPopTriggerKey}
          onSelectProject={handleGoToOperationsProject}
          currentUserName={signedInUser?.name}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Inter']">
      {/* Banner to return to myquext.com Shell Mode */}
      <div className="bg-slate-900 text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <span>Viewing Standalone Operations Mode</span>
        <button
          type="button"
          onClick={() => setIsMyQuextShellMode(true)}
          className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
        >
          Switch to myquext.com Platform Shell →
        </button>
      </div>

      {/* Initial Pop-Up Window when Quext Vision logo is clicked 10 times within 5 seconds */}
      {focusMode === 'initial-prompt' && (
        <QuextVisionFocusController
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          projects={projects}
          quotesList={quotes}
          activeProjectId={focusedProjectId || projects[0]?.id || ''}
          onSelectProjectId={setFocusedProjectId}
          onUpdateProject={handleUpdateProject}
        />
      )}

      {/* Quext Unified Header (White Theme) */}
      <Header
        currentMainTab={mainTab}
        onSelectMainTab={(tab) => {
          setMainTab(tab);
          if (tab === 'analysis') {
            window.location.hash = `/analysis/${selectedAnalysisQuoteId}`;
          } else if (tab === 'operations') {
            window.location.hash = `/operations/${operationsSubTab}`;
          } else if (tab === 'timeline') {
            window.location.hash = '#/timeline';
          } else if (tab === 'quotes') {
            window.location.hash = '#/quotes';
          } else {
            window.location.hash = '#/home';
          }
        }}
        onGoToOperationsDashboard={handleGoToOperationsDashboard}
        wonProjectsCount={projects.length}
        totalQuotesCount={quotes.length}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenPartnerAcademy={() => {
          setLoggedInFieldTech(null);
          setLoggedInPartnerAcademy({
            email: PARTNER_IDENTITY_DIRECTORY[0].defaultEmail,
            companyId: PARTNER_IDENTITY_DIRECTORY[0].companyId,
            partnerShortName: PARTNER_IDENTITY_DIRECTORY[0].partnerShortName,
            selectedProjectId: null,
          });
          window.location.hash = '#/partner-academy';
        }}
      />

      {operationsWorkspaceContent}

      {/* Quext White Theme Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 pb-24 md:pb-5 mt-12 text-xs text-slate-500">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">QUEXT</span>
            <span>·</span>
            <span>Multifamily IoT &amp; Smart Community Operations</span>
            <span>·</span>
            <span className="font-mono text-slate-500">myquext.com</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-medium cursor-pointer"
              title="Reset test data to initial values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => {
                setLoggedInFieldTech(null);
                setLoggedInPartnerAcademy({
                  email: PARTNER_IDENTITY_DIRECTORY[0].defaultEmail,
                  companyId: PARTNER_IDENTITY_DIRECTORY[0].companyId,
                  partnerShortName: PARTNER_IDENTITY_DIRECTORY[0].partnerShortName,
                  selectedProjectId: null,
                });
                window.location.hash = '#/partner-academy';
              }}
              className="text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
            >
              Partner Academy Portal
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
            >
              myquext.com Email Router (Partner / Field Tech / PM)
            </button>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>Logged in as: <strong className="text-slate-800">raul.recalde@onequext.com</strong></span>
          </div>
        </div>
      </footer>

      {/* Hidden Right-Side Customer Updates Notifications Dock (Accessible on all pages) */}
      <RightNotificationsDock
        mode="pm"
        projects={projects}
        latestNotification={latestNotification}
        autoPopTriggerKey={autoPopTriggerKey}
        onSelectProject={handleGoToOperationsProject}
        currentUserName={signedInUser?.name}
      />

      {/* Unified myquext.com Email Identity Router & Portal Switcher Modal */}
      <FieldTechLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentLoggedInTech={loggedInFieldTech}
        currentPartnerEmail={null}
        onLoginAsFieldTech={(tech) => {
          setLoggedInPartnerAcademy(null);
          setLoggedInFieldTech(tech);
          window.location.hash = `#/field-tech/${tech.toLowerCase().replace(' ', '-')}`;
        }}
        onLoginAsAdminPM={() => {
          setLoggedInPartnerAcademy(null);
          setLoggedInFieldTech(null);
          window.location.hash = '#/home';
        }}
        onLoginAsPartnerAcademy={(email, companyId, partnerShortName) => {
          setLoggedInFieldTech(null);
          setLoggedInPartnerAcademy({
            email,
            companyId,
            partnerShortName,
            selectedProjectId: null,
          });
          window.location.hash = '#/partner-academy';
        }}
        projects={projects}
      />

      {/* OneQuext SOW Google Form Automation Hub & Field Tech Dispatcher */}
      <SOWFormAutomationHub
        isOpen={isSowHubOpen}
        onClose={() => setIsSowHubOpen(false)}
        onNavigateToProject={handleGoToOperationsProject}
      />

      {isPMTutorialOpen && (
        <PMTutorialGuide
          isOpen={isPMTutorialOpen}
          onClose={() => setIsPMTutorialOpen(false)}
          onNavigateToView={handleTutorialNavigate}
          projects={projects}
          currentPortal="operations"
          currentOperationsMainTab={mainTab}
          currentOperationsSubTab={operationsSubTab}
          currentStepIndex={pmTutorialStep}
          onStepChange={setPmTutorialStep}
        />
      )}
    </div>
  );
}
