# OneQuext Google Form SOW Automation & Field Tech Dispatch Guide

This system detects whenever the **Onsite Visit Scheduling and SOW Information Form** is filled out:
[Google Form Link](https://docs.google.com/forms/d/1JOuBltR4J6wDwXOzv3ZuK5pFS_SI9xSslgCRCR3iUSM/edit)

It automatically creates the **OneQuext Scope of Work (SOW) — Technical Installation & Site Work Order** 2-page PDF document, populated with all site details, hardware issue scopes, contact info, and shipping specifications, ready to send via email to the assigned Field Tech.

---

## Architecture Overview

```
Google Form Submission
         │
         ▼
[onFormSubmit Trigger in Google Apps Script]
         │
         ├────────────────────────────────────────┐
         ▼                                        ▼
   Method A: Webhook                         Method B: Standalone Cloud
   POST to /api/forms/webhook                Runs 100% in Google Cloud
         │                                        │
         ▼                                        ▼
Quext SOW Automation Hub                     Converts HTML to PDF Blob
- Live Submissions Feed                      Emails Field Tech via GmailApp
- 2-Page SOW PDF Viewer                      (Zero server required)
- 1-Click PDF Download
- 1-Click Gmail Dispatch to Tech
```

---

## 60-Second Setup Guide: Connecting Your Google Form

### Step 1: Open Your Google Form
1. Open [Onsite Visit Scheduling and SOW Information Form](https://docs.google.com/forms/d/1JOuBltR4J6wDwXOzv3ZuK5pFS_SI9xSslgCRCR3iUSM/edit) in your browser.
2. In the top-right corner of Google Forms, click the **three vertical dots (⋮)** menu.
3. Select **"Script editor"** (opens Google Apps Script in a new tab).

---

### Step 2: Choose Your Deployment Mode

#### Option A: Real-Time Webhook to OneQuext Hub (Recommended)
This method syncs submissions live into your Quext Dashboard, where you can preview the 2-page SOW, download the PDF, and dispatch it to any Field Tech with 1 click.

Paste this script into `Code.gs` in the Script Editor:

```javascript
/**
 * Google Apps Script for: Onsite Visit Scheduling and SOW Information Form
 * Target: OneQuext SOW Automation Hub
 */

// If running locally, you can use ngrok or your deployed domain (e.g., https://your-domain.com/api/forms/webhook)
const WEBHOOK_URL = "http://localhost:3000/api/forms/webhook";

function onFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    const data = {
      submittedAt: formResponse.getTimestamp().toISOString(),
      source: "google_form",
      sowReferenceNumber: "SOW-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000) + "-QXT"
    };

    for (let i = 0; i < itemResponses.length; i++) {
      const itemResponse = itemResponses[i];
      const title = itemResponse.getItem().getTitle().trim();
      const answer = itemResponse.getResponse();

      if (title.indexOf("Community / Site Name") !== -1) data.communityName = answer;
      else if (title.indexOf("Work Site Address") !== -1) data.workSiteAddress = answer;
      else if (title.indexOf("Date Prepared") !== -1) data.datePrepared = answer;
      else if (title.indexOf("Install Date") !== -1) data.installDate = answer;
      else if (title.indexOf("POC Name") !== -1 && title.indexOf("Shipping") === -1) data.pocName = answer;
      else if (title.indexOf("POC Title") !== -1) data.pocTitle = answer;
      else if (title.indexOf("POC Phone Number") !== -1 && title.indexOf("Shipping") === -1) data.pocPhone = answer;
      else if (title.indexOf("POC Email Address") !== -1 && title.indexOf("Shipping") === -1) data.pocEmail = answer;
      else if (title.indexOf("Alternate Contact") !== -1) data.alternateContact = answer;
      else if (title.indexOf("Unit Locks Issue") !== -1) data.unitLocksIssue = answer;
      else if (title.indexOf("Access Control Issue") !== -1) data.accessControlIssue = answer;
      else if (title.indexOf("Cameras Issue") !== -1) data.camerasIssue = answer;
      else if (title.indexOf("Resident Wifi Issue") !== -1) data.residentWifiIssue = answer;
      else if (title.indexOf("Community Wifi Issue") !== -1) data.communityWifiIssue = answer;
      else if (title.indexOf("Staff Wifi Issue") !== -1) data.staffWifiIssue = answer;
      else if (title.indexOf("Thermostats Issue") !== -1) data.thermostatsIssue = answer;
      else if (title.indexOf("Leak Sensors Issue") !== -1) data.leakSensorsIssue = answer;
      else if (title.indexOf("Will any equipment need to be shipped") !== -1) data.equipmentNeedsShipping = answer;
      else if (title.indexOf("Equipment to be shipped") !== -1) data.equipmentToShip = answer;
      else if (title.indexOf("What equipment will be needed") !== -1) data.equipmentQuantityAndLocation = answer;
      else if (title.indexOf("Shipping Recipient Name") !== -1) data.shippingRecipient = answer;
      else if (title.indexOf("Shipping Phone Number") !== -1) data.shippingPhone = answer;
      else if (title.indexOf("Shipping Email Address") !== -1) data.shippingEmail = answer;
      else if (title.indexOf("Shipping method") !== -1) data.shippingMethod = answer;
    }

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("Webhook response: " + response.getContentText());

  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
  }
}
```

---

#### Option B: 100% Google Cloud Native (Zero Server Required)
This runs 24/7 on Google's infrastructure. It generates the exact 2-page OneQuext SOW PDF and emails it directly to the technician via `GmailApp`.

Paste this script into `Code.gs`:

```javascript
const FIELD_TECH_EMAIL = "austin.ricks@onequext.com"; // Set your default Field Tech or dispatch email

function onFormSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    const d = {
      submittedAt: formResponse.getTimestamp().toLocaleString(),
      sowRef: "SOW-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000) + "-QXT"
    };

    for (let i = 0; i < itemResponses.length; i++) {
      const item = itemResponses[i];
      const title = item.getItem().getTitle().trim();
      const ans = item.getResponse() || "";

      if (title.indexOf("Community / Site Name") !== -1) d.communityName = ans;
      else if (title.indexOf("Work Site Address") !== -1) d.workSiteAddress = ans;
      else if (title.indexOf("Date Prepared") !== -1) d.datePrepared = ans;
      else if (title.indexOf("Install Date") !== -1) d.installDate = ans;
      else if (title.indexOf("POC Name") !== -1 && title.indexOf("Shipping") === -1) d.pocName = ans;
      else if (title.indexOf("POC Title") !== -1) d.pocTitle = ans;
      else if (title.indexOf("POC Phone Number") !== -1 && title.indexOf("Shipping") === -1) d.pocPhone = ans;
      else if (title.indexOf("POC Email Address") !== -1 && title.indexOf("Shipping") === -1) d.pocEmail = ans;
      else if (title.indexOf("Alternate Contact") !== -1) d.alternateContact = ans;
      else if (title.indexOf("Unit Locks Issue") !== -1) d.unitLocks = ans;
      else if (title.indexOf("Access Control Issue") !== -1) d.accessControl = ans;
      else if (title.indexOf("Cameras Issue") !== -1) d.cameras = ans;
      else if (title.indexOf("Resident Wifi Issue") !== -1) d.residentWifi = ans;
      else if (title.indexOf("Community Wifi Issue") !== -1) d.communityWifi = ans;
      else if (title.indexOf("Staff Wifi Issue") !== -1) d.staffWifi = ans;
      else if (title.indexOf("Thermostats Issue") !== -1) d.thermostats = ans;
      else if (title.indexOf("Leak Sensors Issue") !== -1) d.leakSensors = ans;
      else if (title.indexOf("Will any equipment need to be shipped") !== -1) d.needsShipping = ans;
      else if (title.indexOf("Equipment to be shipped") !== -1) d.equipmentToShip = ans;
      else if (title.indexOf("What equipment will be needed") !== -1) d.shippingDetails = ans;
      else if (title.indexOf("Shipping Recipient Name") !== -1) d.shippingRecipient = ans;
      else if (title.indexOf("Shipping Phone Number") !== -1) d.shippingPhone = ans;
      else if (title.indexOf("Shipping Email Address") !== -1) d.shippingEmail = ans;
      else if (title.indexOf("Shipping method") !== -1) d.shippingMethod = ans;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #1e293b; padding: 24px; font-size: 11px; }
          .title { text-align: center; color: #1b365d; font-size: 18px; font-weight: bold; margin-bottom: 2px; }
          .sub { text-align: center; color: #64748b; font-style: italic; font-size: 11px; margin-bottom: 12px; }
          .navy-bar { border-top: 3px solid #1b365d; margin-bottom: 12px; }
          .section-title { color: #1b365d; font-weight: bold; font-size: 11px; margin-top: 14px; margin-bottom: 4px; border-bottom: 1px solid #334155; padding-bottom: 2px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          td { border: 1px solid #bccadb; padding: 5px 8px; font-size: 10.5px; }
          td.label { background-color: #e0e9f3; font-weight: bold; color: #1b365d; width: 160px; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <div class="title">OneQuext SCOPE OF WORK (SOW)</div>
        <div class="sub">Technical Installation & Site Work Order</div>
        <div class="navy-bar"></div>

        <table>
          <tr><td class="label">SOW Reference #:</td><td>${d.sowRef}</td></tr>
          <tr><td class="label">Date Prepared:</td><td>${d.datePrepared || d.submittedAt}</td></tr>
          <tr><td class="label">Prepared By:</td><td>Quext Field Operations & Google Form Intake</td></tr>
        </table>

        <div class="section-title">SITE & PROJECT IDENTIFICATION</div>
        <table>
          <tr><td class="label">Community / Site Name:</td><td><strong>${d.communityName || '—'}</strong></td></tr>
          <tr><td class="label">Work Site Address:</td><td>${d.workSiteAddress || '—'}</td></tr>
          <tr><td class="label">Install Date:</td><td><strong>${d.installDate || 'Pending Tech Schedule'}</strong></td></tr>
        </table>

        <div class="section-title">POINT OF CONTACT (POC)</div>
        <table>
          <tr><td class="label">POC Name:</td><td>${d.pocName || '—'}</td></tr>
          <tr><td class="label">POC Title / Role:</td><td>${d.pocTitle || 'Site Contact'}</td></tr>
          <tr><td class="label">POC Phone Number:</td><td>${d.pocPhone || '—'}</td></tr>
          <tr><td class="label">POC Email Address:</td><td>${d.pocEmail || '—'}</td></tr>
          <tr><td class="label">Alternate Contact:</td><td>${d.alternateContact || 'None'}</td></tr>
        </table>

        <div class="section-title">EQUIPMENT OVERVIEW & SCOPE OF WORK</div>
        <table>
          ${d.unitLocks ? '<tr><td class="label">Unit Locks Scope:</td><td>' + d.unitLocks + '</td></tr>' : ''}
          ${d.accessControl ? '<tr><td class="label">Access Control Scope:</td><td>' + d.accessControl + '</td></tr>' : ''}
          ${d.cameras ? '<tr><td class="label">Security Cameras:</td><td>' + d.cameras + '</td></tr>' : ''}
          ${d.residentWifi ? '<tr><td class="label">Resident Wi-Fi:</td><td>' + d.residentWifi + '</td></tr>' : ''}
          ${d.communityWifi ? '<tr><td class="label">Community Wi-Fi:</td><td>' + d.communityWifi + '</td></tr>' : ''}
          ${d.staffWifi ? '<tr><td class="label">Staff Wi-Fi:</td><td>' + d.staffWifi + '</td></tr>' : ''}
          ${d.thermostats ? '<tr><td class="label">Thermostats:</td><td>' + d.thermostats + '</td></tr>' : ''}
          ${d.leakSensors ? '<tr><td class="label">Leak Sensors:</td><td>' + d.leakSensors + '</td></tr>' : ''}
          ${d.needsShipping === 'Yes' ? '<tr><td class="label">Equipment to Ship:</td><td>' + (d.equipmentToShip || '') + ' (' + (d.shippingMethod || 'Ground') + ')<br>Details: ' + (d.shippingDetails || '') + '</td></tr>' : ''}
        </table>

        <div class="page-break"></div>

        <div class="section-title" style="margin-top:0;">COMMUNICATION METHOD WHILE ONSITE</div>
        <p>Indicate how the on-site technician(s) should communicate with the project team, POC, and/or support desk during the engagement.</p>
        <table>
          <tr><td class="label">Primary Contact Method:</td><td>Cell Phone & Text/SMS</td></tr>
          <tr><td class="label">Backup Contact Method:</td><td>Email to Site POC</td></tr>
          <tr><td class="label">Check-in Frequency:</td><td>Upon site arrival and before leaving site</td></tr>
          <tr><td class="label">Escalation Contact:</td><td>Quext Dispatch Desk (888-555-7839) & ${d.pocName || 'POC'}</td></tr>
        </table>

        <div class="section-title">DOCUMENTATION REQUIREMENTS</div>
        <ol style="padding-left: 18px; line-height: 1.5;">
          <li>Pre-Installation Documentation: Complete photos of initial hardware and wiring before disassembly.</li>
          <li>Device Asset Tracking: Accurately record all replaced MAC addresses and serial numbers.</li>
          <li>Functional Testing: Verify live telemetry on the OneQuext Cloud Dashboard for all serviced units.</li>
          <li>Tenant Respect: Clean and remove all wire trimmings and packaging prior to departure.</li>
        </ol>

        <div class="section-title">APPROVAL / SIGN-OFF</div>
        <table>
          <tr><td class="label">Technician Name / Signature:</td><td>&nbsp;</td></tr>
          <tr><td class="label">Date:</td><td>&nbsp;</td></tr>
          <tr><td class="label">POC Name / Signature:</td><td>${d.pocName || ''}</td></tr>
          <tr><td class="label">Date:</td><td>&nbsp;</td></tr>
        </table>
      </body>
      </html>
    `;

    const pdfBlob = Utilities.newBlob(html, "text/html", "OneQuext_SOW_" + (d.communityName || "Site").replace(/\s+/g, "_") + ".html")
      .getAs("application/pdf")
      .setName("OneQuext_SOW_" + (d.communityName || "Site").replace(/\s+/g, "_") + ".pdf");

    const emailSubject = "[SOW Dispatch] " + (d.communityName || "New Site") + " - Installation Work Order (" + d.sowRef + ")";
    const emailBody = "Hello Field Tech,\n\nA new OneQuext Scope of Work (SOW) has been generated for " + d.communityName + ".\n\nInstall Date: " + (d.installDate || "TBD") + "\nSite Address: " + d.workSiteAddress + "\nPOC: " + d.pocName + " (" + d.pocPhone + ")\n\nPlease find the attached 2-page SOW Work Order PDF ready for your onsite visit.\n\nQuext Field Operations";

    GmailApp.sendEmail(FIELD_TECH_EMAIL, emailSubject, emailBody, {
      name: "Quext Dispatch Automation",
      attachments: [pdfBlob]
    });

  } catch (err) {
    Logger.log("Error in onFormSubmit: " + err.toString());
  }
}
```

---

### Step 3: Add the Trigger (Takes 10 Seconds)
1. In the Apps Script editor, click the **Clock icon (Triggers)** on the left sidebar.
2. Click **"+ Add Trigger"** (bottom right button).
3. Configure the trigger:
   - **Choose which function to run:** `onFormSubmit`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `From form`
   - **Select event type:** `On form submit`
4. Click **Save** and grant permissions when prompted.

**That's it!** Whenever the form is filled out, the trigger automatically fires, generates the SOW document, and routes it to the Field Tech.
