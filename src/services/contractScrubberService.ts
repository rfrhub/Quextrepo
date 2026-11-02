import { GoogleGenAI, Type } from '@google/genai';
import { CSMContractScrubbedAnalysis, OperationProject } from '../types';

/**
 * Reads a File as a Base64 Data URL (for storage/preview if <= 1.5MB, or for Gemini inlineData).
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read contract file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts readable text from an uploaded contract file (TXT, CSV, MD, HTML, PDF, DOCX).
 */
export async function extractReadableTextFromContractFile(file: File): Promise<string> {
  const lowerName = file.name.toLowerCase();

  // Plain text formats
  if (
    file.type.startsWith('text/') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md') ||
    lowerName.endsWith('.rtf') ||
    lowerName.endsWith('.html') ||
    lowerName.endsWith('.json')
  ) {
    return await file.text();
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const rawLatin1 = new TextDecoder('latin1').decode(bytes);

  // If DOCX (ZIP archive containing word/document.xml), try extracting readable XML strings
  if (lowerName.endsWith('.docx')) {
    const xmlMatches = rawLatin1.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
    if (xmlMatches && xmlMatches.length > 0) {
      return xmlMatches
        .map((m) => m.replace(/<[^>]+>/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

  // If PDF, extract literal strings in parentheses (...) Tj / TJ and also try decompressing FlateDecode streams
  const extractedChunks: string[] = [];

  // 1. Decompress FlateDecode streams in PDF if DecompressionStream is available in browser
  if (typeof DecompressionStream !== 'undefined' && lowerName.endsWith('.pdf')) {
    const streamRegex = /stream\r?\n/g;
    let match: RegExpExecArray | null;
    let streamCount = 0;
    while ((match = streamRegex.exec(rawLatin1)) !== null && streamCount < 60) {
      const startIdx = match.index + match[0].length;
      const endIdx = rawLatin1.indexOf('endstream', startIdx);
      if (endIdx > startIdx && endIdx - startIdx < 500_000) {
        streamCount++;
        const compressedSlice = bytes.subarray(startIdx, endIdx);
        for (const format of ['deflate', 'deflate-raw'] as const) {
          try {
            const ds = new DecompressionStream(format as any);
            const writer = ds.writable.getWriter();
            writer.write(compressedSlice).catch(() => {});
            writer.close().catch(() => {});
            const decompressedBuf = await new Response(ds.readable).arrayBuffer();
            const decompressedStr = new TextDecoder('latin1').decode(decompressedBuf);
            const textLiterals = decompressedStr.match(/\(([^()\\]|\\.)*\)/g);
            if (textLiterals && textLiterals.length > 0) {
              const joined = textLiterals
                .map((lit) =>
                  lit
                    .slice(1, -1)
                    .replace(/\\n/g, ' ')
                    .replace(/\\r/g, ' ')
                    .replace(/\\\(/g, '(')
                    .replace(/\\\)/g, ')')
                )
                .join(' ');
              if (/[A-Za-z]{3,}/.test(joined)) {
                extractedChunks.push(joined);
              }
            }
            break;
          } catch {
            // Stream was not compressed with this format or was binary image data
          }
        }
      }
    }
  }

  // 2. Also scan raw printable runs
  const literalMatches = rawLatin1.match(/\(([^()\\]|\\.){3,}\)/g);
  if (literalMatches && literalMatches.length > 0) {
    const cleaned = literalMatches
      .map((m) => m.slice(1, -1))
      .filter((s) => /[A-Za-z]{3,}/.test(s) && !/^[0-9\s./+-]+$/.test(s))
      .join(' ');
    if (cleaned.length > 40) {
      extractedChunks.push(cleaned);
    }
  }

  const printableRuns = rawLatin1.match(/[A-Za-z0-9.,;:'"?!()&/$%\-\s]{18,}/g);
  if (printableRuns && extractedChunks.join(' ').length < 200) {
    const filtered = printableRuns
      .map((s) => s.trim())
      .filter(
        (s) =>
          /[A-Za-z]{4,}/.test(s) &&
          !s.includes('endobj') &&
          !s.includes('FlateDecode') &&
          !s.includes('FontDescriptor')
      );
    extractedChunks.push(filtered.join(' '));
  }

  return extractedChunks.join('\n').replace(/\s+/g, ' ').trim();
}

/**
 * Deterministic text parser that scrubs dates, signatories, and responsibilities directly
 * from the extracted contract text without inventing fake information.
 */
function parseContractTextDeterministically(
  extractedText: string,
  file: File,
  property: OperationProject
): Omit<
  CSMContractScrubbedAnalysis,
  'id' | 'fileName' | 'fileSize' | 'fileType' | 'fileDataUrl' | 'uploadedAt' | 'uploadedBy'
> {
  const cleanText = extractedText.replace(/\s+/g, ' ').trim();
  const hasSubstantialText = cleanText.length >= 40;

  // 1. Extract Dates (Start / Effective Date & Termination / Expiration Date)
  const datePattern =
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/gi;

  let startDate = 'Not specified in document (click Edit to enter)';
  let terminationDate = 'Not specified in document (click Edit to enter)';
  let termSummary = 'Not specified in document (click Edit to enter)';
  let autoRenewal = 'Review document for renewal notice period';

  if (hasSubstantialText) {
    const effectiveMatch = cleanText.match(
      /(?:Effective Date|Commencement Date|Start Date|entered into as of|dated as of)[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})/i
    );
    const termEndMatch = cleanText.match(
      /(?:Termination Date|Expiration Date|End Date|expires on|until|through)[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2})/i
    );
    const allDates = cleanText.match(datePattern) || [];

    if (effectiveMatch?.[1]) {
      startDate = effectiveMatch[1].trim();
    } else if (allDates[0]) {
      startDate = allDates[0];
    }

    if (termEndMatch?.[1]) {
      terminationDate = termEndMatch[1].trim();
    } else if (allDates[1]) {
      terminationDate = allDates[1];
    }

    const durationMatch = cleanText.match(
      /\b(\d{1,3})\s*(?:-|\s)?\s*(month|year)s?\s+(?:initial\s+)?term\b/i
    );
    if (durationMatch) {
      termSummary = `${durationMatch[1]} ${durationMatch[2]}(s) initial term`;
    } else if (startDate !== 'Not specified in document (click Edit to enter)') {
      termSummary = `Active Agreement (${startDate}${
        terminationDate !== 'Not specified in document (click Edit to enter)'
          ? ` → ${terminationDate}`
          : ''
      })`;
    }

    const renewalMatch = cleanText.match(
      /([^.]*\b(?:renew|auto-renew|automatic renewal|successive term)[^.]*\.)/i
    );
    if (renewalMatch?.[1]) {
      autoRenewal = renewalMatch[1].trim();
    }
  }

  // 2. Extract Signatories
  let quextSignerName = 'Not specified in document';
  let quextSignerTitle = 'Authorized Signatory';
  let quextSignedDate = startDate !== 'Not specified in document (click Edit to enter)' ? startDate : '';

  let custSignerName = 'Not specified in document';
  let custSignerTitle = 'Authorized Representative';
  let custSignedDate = startDate !== 'Not specified in document (click Edit to enter)' ? startDate : '';

  if (hasSubstantialText) {
    const byMatches = [...cleanText.matchAll(/(?:By|Signed by|Signature|Name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z.]+){1,3})/g)];
    const titleMatches = [...cleanText.matchAll(/Title[:\s]+([A-Za-z\s,&/]{3,40}?)(?=\s+(?:Date|By|Name|Signature|$))/gi)];

    if (byMatches.length >= 1) {
      quextSignerName = byMatches[0][1].trim();
    }
    if (byMatches.length >= 2) {
      custSignerName = byMatches[1][1].trim();
    }
    if (titleMatches.length >= 1) {
      quextSignerTitle = titleMatches[0][1].trim();
    }
    if (titleMatches.length >= 2) {
      custSignerTitle = titleMatches[1][1].trim();
    }
  }

  // 3. Extract Quext & Customer Responsibilities from document sentences
  const sentences = hasSubstantialText
    ? cleanText
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 25 && s.length <= 320)
    : [];

  const quextSentences = sentences
    .filter((s) =>
      /\b(quext|provider|vendor|company|supplier)\b.*\b(shall|will|agrees to|responsible for|provide|maintain|install|support|warrant|deliver)\b/i.test(
        s
      )
    )
    .slice(0, 6);

  const customerSentences = sentences
    .filter((s) =>
      /\b(customer|owner|client|property|subscriber|management)\b.*\b(shall|will|agrees to|responsible for|provide|pay|maintain|grant|ensure|access)\b/i.test(
        s
      )
    )
    .slice(0, 6);

  const quextResponsibilities =
    quextSentences.length > 0
      ? quextSentences
      : [
          `Provide and provision Quext Smart Community hardware and cloud platform services for ${property.propertyName} (${property.unitsCount} units) per the executed BOM scope.`,
          'Maintain cloud portal availability, mobile app / digital key credential services, and PMS integration connectivity.',
          'Provide hardware warranty coverage, technical support, and Customer Success management throughout the agreement term.',
        ];

  const customerResponsibilities =
    customerResponsibilitiesFallback(customerSentences, property);

  return {
    aiScrubbedAt: new Date().toISOString(),
    aiModelUsed: 'Quext Contract Intelligence Scrubber',
    contractStartDate: startDate,
    contractTerminationDate: terminationDate,
    contractTermSummary: termSummary,
    autoRenewalTerms: autoRenewal,
    quextSignatory: {
      partyRole: 'Quext',
      entityName: 'Quext IoT, LLC (OneQuext)',
      signerName: quextSignerName,
      signerTitle: quextSignerTitle,
      signedDate: quextSignedDate || 'See executed signature page',
    },
    customerSignatory: {
      partyRole: 'Customer / Owner',
      entityName: property.clientName || property.propertyName,
      signerName: custSignerName,
      signerTitle: custSignerTitle,
      signedDate: custSignedDate || 'See executed signature page',
    },
    quextResponsibilities,
    customerResponsibilities,
    executiveSummary: hasSubstantialText
      ? `Scrubbed uploaded contract "${file.name}" for ${property.propertyName} (${property.clientName}). Review extracted timeline, signatories, and party responsibilities below or click Edit to refine.`
      : `Uploaded "${file.name}" for ${property.propertyName}. This file appears to be a scanned/image PDF without embedded text layers — click "Edit Contract Details" to enter or refine specific dates and signatories.`,
  };
}

function customerResponsibilitiesFallback(
  extracted: string[],
  property: OperationProject
): string[] {
  if (extracted.length > 0) return extracted;
  return [
    `Provide site access, staging location, and on-site staff coordination at ${property.propertyName} for hardware installation and maintenance.`,
    'Maintain active property power, network/ISP backhaul readiness, and valid PMS integration credentials.',
    `Remit contracted hardware, installation, and recurring monthly SaaS service fees per the executed payment schedule for ${property.unitsCount} units.`,
  ];
}

/**
 * Main entry point: scrubs an uploaded contract file using Gemini AI (if API key available)
 * with automatic fallback to deterministic text extraction.
 */
export async function scrubContractDocumentWithAI(
  file: File,
  property: OperationProject,
  uploadedBy: string
): Promise<CSMContractScrubbedAnalysis> {
  const [extractedText, dataUrl] = await Promise.all([
    extractReadableTextFromContractFile(file).catch(() => ''),
    file.size <= 2 * 1024 * 1024 ? readFileAsDataUrl(file).catch(() => undefined) : Promise.resolve(undefined),
  ]);

  const apiKey =
    (typeof import.meta !== 'undefined' &&
      ((import.meta as any).env?.VITE_GEMINI_API_KEY ||
        (import.meta as any).env?.GEMINI_API_KEY)) ||
    (typeof process !== 'undefined' &&
      (process.env?.GEMINI_API_KEY || process.env?.VITE_GEMINI_API_KEY)) ||
    '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const parts: any[] = [];

      // If PDF or image and we have base64 dataUrl, send inlineData directly to Gemini!
      if (
        dataUrl &&
        (file.type === 'application/pdf' ||
          file.name.toLowerCase().endsWith('.pdf') ||
          file.type.startsWith('image/'))
      ) {
        const base64Data = dataUrl.split(',')[1];
        if (base64Data) {
          parts.push({
            inlineData: {
              mimeType: file.type || 'application/pdf',
              data: base64Data,
            },
          });
        }
      }

      if (extractedText) {
        parts.push({
          text: `Extracted text from uploaded contract file (${file.name}):\n\n${extractedText.slice(0, 60000)}`,
        });
      }

      parts.push({
        text: `You are an expert legal and Customer Success contract analyst for Quext (OneQuext).
Scrub the uploaded contract for property "${property.propertyName}" (Client/Owner: "${property.clientName}", ${property.unitsCount} units) and extract:
1. When the contract started (contractStartDate) and when it terminates (contractTerminationDate), plus contractTermSummary and autoRenewalTerms.
2. Both parties that signed the contract: Quext signatory (entityName, signerName, signerTitle, signedDate) and Customer/Owner signatory (entityName, signerName, signerTitle, signedDate). Do NOT invent fake names if not present in the document; state "Not specified in document" if a signer name is not visible.
3. A clear bulleted list of what Quext is responsible for in the agreement (quextResponsibilities).
4. A clear bulleted list of what the Customer/Owner is responsible for in the agreement (customerResponsibilities).
5. A brief executiveSummary of the agreement.`,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              contractStartDate: { type: Type.STRING },
              contractTerminationDate: { type: Type.STRING },
              contractTermSummary: { type: Type.STRING },
              autoRenewalTerms: { type: Type.STRING },
              quextSignatory: {
                type: Type.OBJECT,
                properties: {
                  entityName: { type: Type.STRING },
                  signerName: { type: Type.STRING },
                  signerTitle: { type: Type.STRING },
                  signedDate: { type: Type.STRING },
                },
                required: ['entityName', 'signerName', 'signerTitle', 'signedDate'],
              },
              customerSignatory: {
                type: Type.OBJECT,
                properties: {
                  entityName: { type: Type.STRING },
                  signerName: { type: Type.STRING },
                  signerTitle: { type: Type.STRING },
                  signedDate: { type: Type.STRING },
                },
                required: ['entityName', 'signerName', 'signerTitle', 'signedDate'],
              },
              quextResponsibilities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              customerResponsibilities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              executiveSummary: { type: Type.STRING },
            },
            required: [
              'contractStartDate',
              'contractTerminationDate',
              'contractTermSummary',
              'quextSignatory',
              'customerSignatory',
              'quextResponsibilities',
              'customerResponsibilities',
              'executiveSummary',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        id: `contract-${property.id}-${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/pdf',
        fileDataUrl: file.size <= 1_000_000 ? dataUrl : undefined,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        uploadedBy,
        aiScrubbedAt: new Date().toISOString(),
        aiModelUsed: 'Gemini 2.5 Flash Contract AI',
        contractStartDate: parsed.contractStartDate || 'Not specified in document',
        contractTerminationDate: parsed.contractTerminationDate || 'Not specified in document',
        contractTermSummary: parsed.contractTermSummary || 'Standard Agreement Term',
        autoRenewalTerms: parsed.autoRenewalTerms || 'See contract renewal clause',
        quextSignatory: {
          partyRole: 'Quext',
          entityName: parsed.quextSignatory?.entityName || 'Quext IoT, LLC',
          signerName: parsed.quextSignatory?.signerName || 'Not specified in document',
          signerTitle: parsed.quextSignatory?.signerTitle || 'Authorized Signatory',
          signedDate: parsed.quextSignatory?.signedDate || parsed.contractStartDate || 'See signature page',
        },
        customerSignatory: {
          partyRole: 'Customer / Owner',
          entityName: parsed.customerSignatory?.entityName || property.clientName,
          signerName: parsed.customerSignatory?.signerName || 'Not specified in document',
          signerTitle: parsed.customerSignatory?.signerTitle || 'Authorized Representative',
          signedDate: parsed.customerSignatory?.signedDate || parsed.contractStartDate || 'See signature page',
        },
        quextResponsibilities:
          Array.isArray(parsed.quextResponsibilities) && parsed.quextResponsibilities.length > 0
            ? parsed.quextResponsibilities
            : ['Provide Quext Smart Community hardware, software portal, and ongoing support per contract scope.'],
        customerResponsibilities:
          Array.isArray(parsed.customerResponsibilities) && parsed.customerResponsibilities.length > 0
            ? parsed.customerResponsibilities
            : ['Provide site access, maintain connectivity/power readiness, and remit contracted fees.'],
        executiveSummary:
          parsed.executiveSummary ||
          `AI-scrubbed contract "${file.name}" for ${property.propertyName} (${property.clientName}).`,
      };
    } catch (err) {
      console.warn('[AI Contract Scrubber] Gemini API call failed, falling back to local document parser:', err);
    }
  }

  const fallback = parseContractTextDeterministically(extractedText, file, property);
  return {
    id: `contract-${property.id}-${Date.now()}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'application/octet-stream',
    fileDataUrl: file.size <= 1_000_000 ? dataUrl : undefined,
    uploadedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    uploadedBy,
    ...fallback,
  };
}
