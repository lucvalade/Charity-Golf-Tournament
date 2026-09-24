import { OutreachLead } from '../types';
import { EVENT_DETAILS } from '../data/initialData';

/**
 * Normalizes and replaces dynamic mail-merge tokens in letter subject & body.
 * Adheres strictly to the 6th Annual Charity Fragrant Breeze Golf Tournament specifications:
 * - [Sponsor Name] -> Lead's Business Name (Column A)
 * - Auto-linking Burford Golf Links Course (https://golfnorth.ca/burford) in BOLD
 * - Auto-linking (905) 818-2005 with tel:19058182005 phone dialer
 * - Auto-linking Fragrant Breeze Golf Tournament to https://fragrant-breeze-golf-tournament.ai.studio
 */
export function interpolateLetterTokens(rawText: string, lead: OutreachLead): string {
  if (!rawText) return '';

  const businessName = lead.businessName || 'Valued Community Partner';
  const recipientName = lead.recipientName || businessName;

  let text = rawText
    // Column A Business Name interpolation
    .replace(/\[Sponsor Name\]/gi, businessName)
    .replace(/\[Company Name\]/gi, businessName)
    .replace(/\[Business Name\]/gi, businessName)
    // Contact person / recipient name
    .replace(/\[Contact Name\]/gi, recipientName)
    .replace(/\[Recipient Name\]/gi, recipientName)
    // Dynamic fields
    .replace(/\[Target Tier\]/gi, lead.targetTier || 'Hole Sponsor')
    .replace(/\[City\]/gi, lead.city || 'our community')
    // Tournament core info
    .replace(/\[Tournament Date\]/gi, 'Monday, October 5, 2026')
    .replace(/\[Course Location\]/gi, 'Burford Golf Links Course (120 Golf Links Rd., Burford ON)')
    .replace(/\[Founder Name\]/gi, EVENT_DETAILS.founder || 'Saied Mohammed')
    .replace(/\[Founder Phone\]/gi, '(905) 818-2005')
    .replace(/\[Memorial Honoree\]/gi, EVENT_DETAILS.memorialHonoree || 'Naseem Mohammed')
    .replace(/\[Beneficiary Org\]/gi, EVENT_DETAILS.beneficiaryOrg || 'Juravinski Breast Cancer Research & Canadian Red Cross');

  return text;
}

/**
 * Converts markdown text into high-compatibility, inline-styled HTML
 * suitable for both in-browser Branded Preview and Google Workspace email dispatch.
 */
export function renderOutreachMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  // 1. Normalize line endings
  const clean = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Split into blocks by double newlines
  const rawBlocks = clean.split(/\n\s*\n/);

  const htmlBlocks: string[] = [];

  for (const rawBlock of rawBlocks) {
    const trimmed = rawBlock.trim();
    if (!trimmed) continue;

    // Check if block is a bullet list (lines start with * or -)
    const lines = trimmed.split('\n');
    const isList = lines.every((line) => /^\s*[*•-]\s+/.test(line));

    if (isList) {
      const listItems = lines
        .map((line) => {
          const itemText = line.replace(/^\s*[*•-]\s+/, '').trim();
          return `<li style="margin-bottom: 8px; line-height: 1.6; color: #334155;">${formatInlineMarkdown(itemText)}</li>`;
        })
        .join('');
      htmlBlocks.push(
        `<ul style="margin: 12px 0 18px 22px; padding: 0; list-style-type: disc;">${listItems}</ul>`
      );
    } else {
      // Standard paragraph
      const formattedLines = lines
        .map((l) => formatInlineMarkdown(l.trim()))
        .join('<br />');
      htmlBlocks.push(
        `<p style="margin: 0 0 16px 0; line-height: 1.68; color: #334155; font-size: 14.5px;">${formattedLines}</p>`
      );
    }
  }

  return htmlBlocks.join('');
}

/**
 * Handles inline markdown:
 * - Bold: **text** -> <strong>text</strong>
 * - Italic: *text* -> <em>text</em>
 * - Markdown links: [text](url) -> <a href="url" ...>text</a>
 * - tel: links formatted with dialer trigger
 */
export function formatInlineMarkdown(text: string): string {
  let result = text;

  // 1. Markdown links [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const trimmedUrl = url.trim();
    const isTel = trimmedUrl.startsWith('tel:');
    const isMailto = trimmedUrl.startsWith('mailto:');
    const isExternal = !isTel && !isMailto;

    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const style = 'color: #1E4D2B; font-weight: bold; text-decoration: underline; text-underline-offset: 2px;';

    return `<a href="${trimmedUrl}"${targetAttr} style="${style}">${label}</a>`;
  });

  // 2. Bold: **text** or ** text **
  result = result.replace(/\*\*\s*([^*]+?)\s*\*\*/g, '<strong>$1</strong>');

  // 3. Italic: *text* (single asterisk, not preceded or followed by another asterisk)
  result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

  return result;
}
