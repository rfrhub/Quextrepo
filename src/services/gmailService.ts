import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar.events',
];

export const INSTALLATION_CALENDAR_ID =
  'c_b986a601134c4507b3806783aa84b3bef46bfe597def1bbc23c1659f3c6b49a0@group.calendar.google.com';

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the access token strictly in memory (never in localStorage/sessionStorage).
let cachedAccessToken: string | null = null;
let currentAuthUser: User | null = null;

type AuthSubscriber = (state: {
  user: User | null;
  accessToken: string | null;
  needsAuth: boolean;
}) => void;

const subscribers = new Set<AuthSubscriber>();

function notifySubscribers() {
  const needsAuth = !currentAuthUser || !cachedAccessToken;
  subscribers.forEach((cb) =>
    cb({
      user: currentAuthUser,
      accessToken: cachedAccessToken,
      needsAuth,
    })
  );
}

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    currentAuthUser = user;
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
    notifySubscribers();
  });
};

export const subscribeToGmailAuth = (cb: AuthSubscriber) => {
  subscribers.add(cb);
  cb({
    user: currentAuthUser,
    accessToken: cachedAccessToken,
    needsAuth: !currentAuthUser || !cachedAccessToken,
  });
  return () => {
    subscribers.delete(cb);
  };
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      return null;
    }

    cachedAccessToken = credential.accessToken;
    currentAuthUser = result.user;
    notifySubscribers();
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    const code = error?.code || '';
    if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/user-cancelled'
    ) {
      // User intentionally closed the popup window; return null quietly.
      return null;
    }
    throw new Error(
      error?.message || 'Unable to complete Google Sign-In. Please check popup permissions.'
    );
  } finally {
    isSigningIn = false;
  }
};

export const htmlToPlainText = (html: string): string => {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<\/(th|td)>/gi, ' | ')
    .replace(/<\/(p|div|h1|h2|h3|h4|li|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&bull;/g, '•')
    .replace(/[ \t]+\|[ \t]*\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const buildGmailWebComposeUrl = ({
  to,
  subject,
  htmlBody,
}: {
  to: string | string[];
  subject: string;
  htmlBody: string;
}): string => {
  const recipients = (Array.isArray(to) ? to : to.split(/[,;]+/))
    .map((r) => r.trim())
    .filter(Boolean)
    .join(',');
  const plainBody = htmlToPlainText(htmlBody);
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: recipients,
    su: subject,
    body: plainBody,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const getCurrentGmailUser = (): User | null => {
  return currentAuthUser;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  currentAuthUser = null;
  notifySubscribers();
};

function encodeBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeMimeHeaderUtf8(text: string): string {
  const utf8Bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return `=?UTF-8?B?${btoa(binary)}?=`;
}

export const QUEXT_EMAIL_LOGO_URL = '/assets/aistudio/Quext_Logo_Black_ba76e58b.png';
export const QUEXT_EMAIL_LOGO_CID = 'quext-logo-black';

let cachedLogoBase64: string | null = null;

async function getQuextLogoBase64(): Promise<string | null> {
  if (cachedLogoBase64) return cachedLogoBase64;
  try {
    const res = await fetch(QUEXT_EMAIL_LOGO_URL);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const rawBase64 = btoa(binary);
    // Wrap base64 at 76 characters per line for RFC 2045 MIME compliance
    cachedLogoBase64 = rawBase64.match(/.{1,76}/g)?.join('\r\n') || rawBase64;
    return cachedLogoBase64;
  } catch {
    return null;
  }
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  base64Data: string;
}

export interface SendGmailParams {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: EmailAttachment[];
}

export interface SendGmailResult {
  id: string;
  threadId?: string;
  recipients: string[];
}

export const sendRealGmailEmail = async ({
  to,
  subject,
  htmlBody,
  attachments,
}: SendGmailParams): Promise<SendGmailResult> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const recipientList = (Array.isArray(to) ? to : to.split(/[,;]+/))
    .map((r) => r.trim())
    .filter(Boolean);

  if (recipientList.length === 0) {
    throw new Error('Please specify at least one valid recipient email address.');
  }

  // Ensure the outgoing HTML always features the Quext Logo Black in the top-left corner
  let brandedHtml = htmlBody;
  if (!brandedHtml.includes(QUEXT_EMAIL_LOGO_URL) && !brandedHtml.includes(`cid:${QUEXT_EMAIL_LOGO_CID}`)) {
    brandedHtml = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b;">
        <div style="border-bottom: 2px solid #01C38D; padding-bottom: 12px; margin-bottom: 16px;">
          <img src="${QUEXT_EMAIL_LOGO_URL}" alt="Quext" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;" />
        </div>
        ${brandedHtml}
      </div>
    `;
  }

  const logoBase64 = await getQuextLogoBase64();
  let mimeLines: string[];

  const hasAttachments = attachments && attachments.length > 0;

  if (hasAttachments) {
    const mixedBoundary = `quext_mixed_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const relatedBoundary = `quext_rel_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    mimeLines = [
      `To: ${recipientList.join(', ')}`,
      `Subject: ${encodeMimeHeaderUtf8(subject)}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
      '',
      `--${mixedBoundary}`,
    ];

    if (logoBase64) {
      const htmlWithCid = brandedHtml
        .split(QUEXT_EMAIL_LOGO_URL)
        .join(`cid:${QUEXT_EMAIL_LOGO_CID}`);

      mimeLines.push(
        `Content-Type: multipart/related; boundary="${relatedBoundary}"`,
        '',
        `--${relatedBoundary}`,
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Transfer-Encoding: 8bit',
        '',
        htmlWithCid,
        '',
        `--${relatedBoundary}`,
        'Content-Type: image/png; name="Quext_Logo_Black.png"',
        'Content-Transfer-Encoding: base64',
        `Content-ID: <${QUEXT_EMAIL_LOGO_CID}>`,
        'Content-Disposition: inline; filename="Quext_Logo_Black.png"',
        '',
        logoBase64,
        '',
        `--${relatedBoundary}--`
      );
    } else {
      mimeLines.push(
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Transfer-Encoding: 8bit',
        '',
        brandedHtml
      );
    }

    // Attach each attachment
    for (const att of attachments!) {
      mimeLines.push(
        '',
        `--${mixedBoundary}`,
        `Content-Type: ${att.contentType || 'application/pdf'}; name="${att.filename}"`,
        'Content-Transfer-Encoding: base64',
        `Content-Disposition: attachment; filename="${att.filename}"`,
        '',
        att.base64Data
      );
    }

    mimeLines.push('', `--${mixedBoundary}--`);
  } else if (logoBase64) {
    const boundary = `quext_rel_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const htmlWithCid = brandedHtml
      .split(QUEXT_EMAIL_LOGO_URL)
      .join(`cid:${QUEXT_EMAIL_LOGO_CID}`);

    mimeLines = [
      `To: ${recipientList.join(', ')}`,
      `Subject: ${encodeMimeHeaderUtf8(subject)}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/related; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: 8bit',
      '',
      htmlWithCid,
      '',
      `--${boundary}`,
      'Content-Type: image/png; name="Quext_Logo_Black.png"',
      'Content-Transfer-Encoding: base64',
      `Content-ID: <${QUEXT_EMAIL_LOGO_CID}>`,
      'Content-Disposition: inline; filename="Quext_Logo_Black.png"',
      '',
      logoBase64,
      '',
      `--${boundary}--`,
    ];
  } else {
    mimeLines = [
      `To: ${recipientList.join(', ')}`,
      `Subject: ${encodeMimeHeaderUtf8(subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: 8bit',
      '',
      brandedHtml,
    ];
  }

  const rawMessage = encodeBase64Url(mimeLines.join('\r\n'));

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: rawMessage }),
    }
  );

  if (response.status === 401 || response.status === 403) {
    cachedAccessToken = null;
    notifySubscribers();
    throw new Error('NOT_AUTHENTICATED');
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg =
      errData?.error?.message || `Gmail API error (${response.status})`;
    throw new Error(errMsg);
  }

  const data = await response.json();
  return {
    id: data.id || `gmail-${Date.now()}`,
    threadId: data.threadId,
    recipients: recipientList,
  };
};

export interface CalendarInstallationEventInput {
  syncKey: string;
  summary: string;
  description: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD inclusive
  eventType:
    | 'Active Project Window'
    | 'SOW Scheduled Scope'
    | 'Daily Installation Log'
    | 'Long-Range Pipeline';
  propertyName: string;
}

export interface SyncedCalendarEventResult {
  syncKey: string;
  eventId: string;
  summary: string;
  htmlLink?: string;
  action: 'created' | 'updated';
}

function normalizeYmdDate(dateStr?: string): string {
  if (!dateStr) return '2026-10-22';
  const ymd = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getUTCFullYear();
    const m = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const d = String(parsed.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return '2026-10-22';
}

// Google Calendar API requires exclusive end dates for all-day events (YYYY-MM-DD + 1 day)
function getExclusiveEndDate(startYmd: string, inclusiveEndYmd?: string): string {
  const baseYmd = inclusiveEndYmd && inclusiveEndYmd >= startYmd ? inclusiveEndYmd : startYmd;
  const parts = baseYmd.split('-').map((n) => parseInt(n, 10));
  const dt = new Date(Date.UTC(parts[0] || 2026, (parts[1] || 10) - 1, parts[2] || 22));
  dt.setUTCDate(dt.getUTCDate() + 1);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const syncInstallationEventsToCalendar = async (
  events: CalendarInstallationEventInput[],
  calendarId: string = INSTALLATION_CALENDAR_ID,
  onProgress?: (completed: number, total: number, currentSummary: string) => void
): Promise<SyncedCalendarEventResult[]> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }

  const encodedCalId = encodeURIComponent(calendarId);
  const results: SyncedCalendarEventResult[] = [];

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    if (onProgress) {
      onProgress(i, events.length, ev.summary);
    }

    const startYmd = normalizeYmdDate(ev.startDate);
    const endExclusiveYmd = getExclusiveEndDate(
      startYmd,
      ev.endDate ? normalizeYmdDate(ev.endDate) : startYmd
    );

    const eventPayload = {
      summary: ev.summary,
      location: ev.location || '',
      description: ev.description,
      start: {
        date: startYmd,
      },
      end: {
        date: endExclusiveYmd,
      },
      extendedProperties: {
        private: {
          quextSyncKey: ev.syncKey,
          quextEventType: ev.eventType,
          quextProperty: ev.propertyName,
        },
      },
    };

    // 1. Check if an event with this quextSyncKey already exists on the target calendar
    let existingEventId: string | null = null;
    const searchUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events?privateExtendedProperty=${encodeURIComponent(
      `quextSyncKey=${ev.syncKey}`
    )}&maxResults=1`;

    const searchRes = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (searchRes.status === 401) {
      cachedAccessToken = null;
      notifySubscribers();
      throw new Error('NOT_AUTHENTICATED');
    }

    if (searchRes.status === 403) {
      const errJson = await searchRes.json().catch(() => ({}));
      const reason = errJson?.error?.message || '';
      if (
        reason.toLowerCase().includes('insufficient authentication scopes') ||
        reason.toLowerCase().includes('insufficient permission')
      ) {
        cachedAccessToken = null;
        notifySubscribers();
        throw new Error('NOT_AUTHENTICATED');
      }
      throw new Error(
        reason ||
          `Google Calendar access denied (403). Ensure your Google account has permission to edit calendar ${calendarId}.`
      );
    }

    if (searchRes.status === 404) {
      throw new Error(
        `Calendar ID "${calendarId}" was not found or is not shared with your signed-in Google account.`
      );
    }

    if (searchRes.ok) {
      const searchData = await searchRes.json().catch(() => ({}));
      if (Array.isArray(searchData.items) && searchData.items.length > 0 && searchData.items[0]?.id) {
        existingEventId = searchData.items[0].id;
      }
    }

    // 2. Update existing event or insert a new event
    const writeUrl = existingEventId
      ? `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events/${encodeURIComponent(
          existingEventId
        )}`
      : `https://www.googleapis.com/calendar/v3/calendars/${encodedCalId}/events`;

    const writeRes = await fetch(writeUrl, {
      method: existingEventId ? 'PUT' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    });

    if (writeRes.status === 401) {
      cachedAccessToken = null;
      notifySubscribers();
      throw new Error('NOT_AUTHENTICATED');
    }

    if (!writeRes.ok) {
      const errData = await writeRes.json().catch(() => ({}));
      const errMsg =
        errData?.error?.message || `Google Calendar API error (${writeRes.status})`;
      if (
        writeRes.status === 403 &&
        (errMsg.toLowerCase().includes('insufficient authentication scopes') ||
          errMsg.toLowerCase().includes('insufficient permission'))
      ) {
        cachedAccessToken = null;
        notifySubscribers();
        throw new Error('NOT_AUTHENTICATED');
      }
      throw new Error(errMsg);
    }

    const savedData = await writeRes.json();
    results.push({
      syncKey: ev.syncKey,
      eventId: savedData.id || `cal-${Date.now()}-${i}`,
      summary: ev.summary,
      htmlLink: savedData.htmlLink,
      action: existingEventId ? 'updated' : 'created',
    });
  }

  if (onProgress) {
    onProgress(events.length, events.length, 'Complete');
  }

  return results;
};


