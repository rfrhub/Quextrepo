import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Printer,
  Smartphone,
  ShieldCheck,
  Camera,
  FileSignature,
  Boxes,
} from 'lucide-react';

interface ProductAcceptanceQRCodeProps {
  url: string;
  propertyName: string;
  quoteNumber?: string;
  size?: number;
  compact?: boolean;
}

export const ProductAcceptanceQRCode: React.FC<ProductAcceptanceQRCodeProps> = ({
  url,
  propertyName,
  quoteNumber,
  size = 200,
  compact = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&margin=10&data=${encodeURIComponent(
    url
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintSheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Product Acceptance Mobile QR - ${propertyName}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 40px;
              color: #0f172a;
              text-align: center;
              background: #fff;
            }
            .container {
              max-width: 580px;
              margin: 0 auto;
              border: 3px solid #059669;
              border-radius: 20px;
              padding: 36px 24px;
            }
            .badge {
              display: inline-block;
              background: #ecfdf5;
              color: #065f46;
              border: 1px solid #a7f3d0;
              font-size: 13px;
              font-weight: 800;
              text-transform: uppercase;
              padding: 6px 14px;
              border-radius: 9999px;
              letter-spacing: 0.05em;
            }
            h1 {
              font-size: 24px;
              font-weight: 800;
              margin: 14px 0 6px 0;
            }
            .subtitle {
              color: #475569;
              font-size: 14px;
              margin-bottom: 24px;
            }
            .qr-wrapper {
              background: #ffffff;
              display: inline-block;
              padding: 16px;
              border: 2px dashed #059669;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            }
            .qr-wrapper img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .instructions {
              margin-top: 24px;
              text-align: left;
              background: #f8fafc;
              border-radius: 12px;
              padding: 16px 20px;
              font-size: 13px;
              color: #334155;
            }
            .instructions ol {
              margin: 8px 0 0 0;
              padding-left: 20px;
              line-height: 1.6;
            }
            .url-box {
              margin-top: 18px;
              font-family: monospace;
              font-size: 11px;
              color: #0284c7;
              word-break: break-all;
            }
            .footer {
              margin-top: 24px;
              font-size: 12px;
              color: #94a3b8;
            }
            @media print {
              body { padding: 0; }
              .container { border: 2px solid #059669; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="badge">Official On-Site Staging &amp; Receiving</div>
            <h1>${propertyName}</h1>
            <div class="subtitle">Quote #${quoteNumber || 'N/A'} · Hardware Delivery &amp; Product Acceptance</div>
            
            <div class="qr-wrapper">
              <img src="${qrImageUrl}" alt="Scan for Product Acceptance" />
            </div>

            <div class="instructions">
              <strong>Instructions for On-Site Property Staff:</strong>
              <ol>
                <li>Open your smartphone camera and point it at the QR code above.</li>
                <li>Tap the link banner to open your dedicated <strong>Product Acceptance Portal</strong>.</li>
                <li>Inspect delivery pallets against the shipped manifest.</li>
                <li>Snap and upload photos of any damaged boxes or carton exceptions directly on your phone.</li>
                <li>Provide your digital signature to confirm received inventory into property custody.</li>
              </ol>
            </div>

            <div class="url-box">${url}</div>
            <div class="footer">Quext Operations &amp; Implementation · Powered by OneQuext</div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
        <div className="w-16 h-16 bg-white p-1 rounded-lg border border-emerald-300 shadow-2xs shrink-0 flex items-center justify-center">
          {!imgError ? (
            <img
              src={qrImageUrl}
              alt="Scan QR"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain"
            />
          ) : (
            <QrCode className="w-8 h-8 text-emerald-700" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Mobile Portal QR Code</span>
          </div>
          <p className="text-[11px] text-slate-600 truncate mt-0.5">
            Scan to inspect pallets, upload box photos &amp; sign
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-[10px] font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrintSheet}
              className="text-[10px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
              title="Print On-Site Handout / QR Sheet"
            >
              <Printer className="w-3 h-3 text-slate-500" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50/90 via-white to-sky-50/50 border-2 border-emerald-300/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row items-center gap-5">
        {/* QR Code Graphic Frame */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="p-2.5 bg-white rounded-2xl border-2 border-emerald-400 shadow-md">
            {!imgError ? (
              <img
                src={qrImageUrl}
                alt="Product Acceptance QR Code"
                width={size}
                height={size}
                onError={() => setImgError(true)}
                className="rounded-lg object-contain block select-none"
              />
            ) : (
              <div
                style={{ width: size, height: size }}
                className="bg-emerald-950 text-white rounded-lg flex flex-col items-center justify-center p-4 text-center"
              >
                <QrCode className="w-12 h-12 text-emerald-400 mb-2" />
                <span className="text-xs font-mono font-bold">SCAN PORTAL</span>
                <span className="text-[10px] text-emerald-300 mt-1 select-all">{url}</span>
              </div>
            )}
          </div>
          <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
            <Smartphone className="w-3 h-3" />
            Scan with Phone Camera
          </span>
        </div>

        {/* Text & Action Capabilities */}
        <div className="flex-1 space-y-3 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-2xs mb-1.5 uppercase tracking-wide">
              <ShieldCheck className="w-3 h-3" />
              Dedicated Mobile Link &amp; QR Code
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
              On-Site Property Staff Mobile Portal
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Scan this QR code from your phone screen or print the handout for on-site staff. It gives on-site property managers and maintenance leads full mobile access to:
            </p>
          </div>

          {/* Feature Highlights Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2 bg-white/90 border border-slate-200 rounded-lg flex items-start gap-2 shadow-2xs">
              <Boxes className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] text-slate-900 block leading-tight">Inspect Pallets</span>
                <span className="text-[10px] text-slate-500">Verify seals, wrap, and total units</span>
              </div>
            </div>

            <div className="p-2 bg-white/90 border border-slate-200 rounded-lg flex items-start gap-2 shadow-2xs">
              <Camera className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] text-slate-900 block leading-tight">Upload Box Photos</span>
                <span className="text-[10px] text-slate-500">Snap pictures of crushed cartons</span>
              </div>
            </div>

            <div className="p-2 bg-white/90 border border-slate-200 rounded-lg flex items-start gap-2 shadow-2xs">
              <FileSignature className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] text-slate-900 block leading-tight">Digital Signature</span>
                <span className="text-[10px] text-slate-500">Touch signature on mobile screen</span>
              </div>
            </div>
          </div>

          {/* Direct URL input and actions */}
          <div className="space-y-2 pt-1">
            <div className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-emerald-950 font-semibold truncate select-all">
              {url}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Copy dedicated mobile portal link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <button
                type="button"
                onClick={handlePrintSheet}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Print or save on-site QR inspection sheet"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-700" />
                <span>Print QR Sheet</span>
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Open mobile portal in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
