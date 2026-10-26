import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function sowWebhookPlugin(): Plugin {
  const storeFilePath = path.resolve(__dirname, 'form_submissions_cache.json');

  const readStore = () => {
    try {
      if (fs.existsSync(storeFilePath)) {
        return JSON.parse(fs.readFileSync(storeFilePath, 'utf-8'));
      }
    } catch (e) {
      console.error('Error reading form submissions cache:', e);
    }
    return [];
  };

  const writeStore = (data: any[]) => {
    try {
      fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing form submissions cache:', e);
    }
  };

  return {
    name: 'sow-google-form-webhook',
    configureServer(server) {
      // 1. Webhook intake from Google Apps Script or curl
      server.middlewares.use('/api/forms/webhook', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body || '{}');
              console.log('[Google Form Webhook] Received submission:', payload.communityName || 'New Form');

              const existing = readStore();
              const newSubmission = {
                id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                submittedAt: payload.submittedAt || new Date().toISOString(),
                source: 'google_form',
                status: 'new',
                communityName: payload.communityName || 'Unnamed Community',
                workSiteAddress: payload.workSiteAddress || 'Address Pending',
                datePrepared: payload.datePrepared || new Date().toISOString().split('T')[0],
                installDate: payload.installDate || 'TBD',
                preparedBy: payload.preparedBy || 'Google Form Intake',
                sowReferenceNumber:
                  payload.sowReferenceNumber ||
                  `SOW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-QXT`,
                pocName: payload.pocName || 'Site Contact',
                pocTitle: payload.pocTitle || 'Site Contact',
                pocPhone: payload.pocPhone || '',
                pocEmail: payload.pocEmail || '',
                alternateContact: payload.alternateContact || '',
                unitLocksIssue: payload.unitLocksIssue || '',
                accessControlIssue: payload.accessControlIssue || '',
                camerasIssue: payload.camerasIssue || '',
                residentWifiIssue: payload.residentWifiIssue || '',
                communityWifiIssue: payload.communityWifiIssue || '',
                staffWifiIssue: payload.staffWifiIssue || '',
                thermostatsIssue: payload.thermostatsIssue || '',
                leakSensorsIssue: payload.leakSensorsIssue || '',
                equipmentNeedsShipping: payload.equipmentNeedsShipping || 'No',
                equipmentToShip: payload.equipmentToShip || '',
                equipmentQuantityAndLocation: payload.equipmentQuantityAndLocation || '',
                shippingRecipient: payload.shippingRecipient || '',
                shippingPhone: payload.shippingPhone || '',
                shippingEmail: payload.shippingEmail || '',
                shippingMethod: payload.shippingMethod || 'Ground',
                primaryContactMethod: payload.primaryContactMethod || 'Cell Phone / Text',
                backupContactMethod: payload.backupContactMethod || 'Email',
                checkInFrequency: payload.checkInFrequency || 'Upon site arrival & departure',
                escalationContact: payload.escalationContact || 'Quext Operations Desk (888-555-QXT)',
              };

              existing.unshift(newSubmission);
              writeStore(existing);

              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(
                JSON.stringify({
                  success: true,
                  message: 'SOW Form response saved successfully',
                  submission: newSubmission,
                })
              );
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(
            JSON.stringify({
              status: 'online',
              endpoint: '/api/forms/webhook',
              description: 'OneQuext Google Form SOW Webhook Receiver is active and ready to accept POST submissions',
            })
          );
        } else if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          res.end();
        } else {
          next();
        }
      });

      // 2. Fetch cached submissions
      server.middlewares.use('/api/forms/submissions', (req, res, next) => {
        if (req.method === 'GET') {
          const list = readStore();
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ submissions: list }));
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), sowWebhookPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true as const,
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
