import jsPDF from 'jspdf';
import { OutreachLead, OutreachEmailTemplate } from '../types';
import { interpolateLetterTokens } from './outreachMarkdown';
import { EVENT_DETAILS } from '../data/initialData';

/**
 * Generates an official PDF Corporate Sponsor & Donation Solicitation Letter
 * for any lead regardless of status (Identified, Letter Sent, Opened, Pledged, etc.)
 */
export function generateSolicitationLetterPDF(
  lead: OutreachLead,
  template?: OutreachEmailTemplate
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const darkGreen = '#1E4D2B'; // Royal Golf Green
  const goldAccent = '#B8860B';
  const slateDark = '#1E293B';
  const slateMuted = '#475569';
  const lightBg = '#F8FAFC';

  let y = margin;

  // 1. Header Banner Box
  doc.setFillColor(30, 77, 43); // #1E4D2B
  doc.rect(margin, y, contentWidth, 68, 'F');

  // Gold accent bar
  doc.setFillColor(212, 175, 55); // #D4AF37
  doc.rect(margin, y + 68, contentWidth, 4, 'F');

  // Header Text inside banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('6TH ANNUAL CHARITY FRAGRANT BREEZE GOLF CLASSIC', margin + 15, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(230, 245, 235);
  doc.text(
    `In Loving Memory of ${EVENT_DETAILS.memorialHonoree}  |  Benefiting ${EVENT_DETAILS.beneficiaryOrg}`,
    margin + 15,
    y + 42
  );

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55);
  doc.text(
    `Event Date: ${EVENT_DETAILS.dateString} @ ${EVENT_DETAILS.venue.name}, Burford, ON`,
    margin + 15,
    y + 56
  );

  y += 90;

  // 2. Metadata & Recipient Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 75, 4, 4, 'FD');

  // Date on right
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`DATE: ${currentDateStr}`, pageWidth - margin - 15, y + 20, { align: 'right' });

  // Recipient block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 77, 43);
  doc.text('CORPORATE SOLICITATION & SPONSORSHIP INVITATION', margin + 15, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  const recipientLine = lead.recipientName || lead.businessName;
  doc.text(`TO: ${recipientLine}`, margin + 15, y + 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const companyAddr = [lead.businessName, lead.address, lead.city ? `${lead.city}, ${lead.prov || 'ON'}` : '']
    .filter(Boolean)
    .join(' · ');
  doc.text(`Company: ${companyAddr}`, margin + 15, y + 52);

  const contactEmailPhone = [lead.emailAddress, lead.contactNumber].filter(Boolean).join(' | ');
  doc.text(`Contact: ${contactEmailPhone || 'N/A'}`, margin + 15, y + 65);

  // Target Tier Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(184, 134, 11);
  doc.text(`TARGET TIER: ${(lead.targetTier || 'Hole Sponsor').toUpperCase()}`, pageWidth - margin - 15, y + 38, {
    align: 'right'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`STATUS: ${(lead.status || 'Identified').toUpperCase()}`, pageWidth - margin - 15, y + 52, {
    align: 'right'
  });

  y += 90;

  // 3. Subject Line
  const defaultSubject = `Sponsorship & Tournament Invitation: 6th Annual Fragrant Breeze Golf Classic - ${lead.businessName}`;
  const rawSubject = template ? template.subject : defaultSubject;
  const interpolatedSubject = interpolateLetterTokens(rawSubject, lead);

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`SUBJECT: ${interpolatedSubject}`, margin + 10, y + 16);

  y += 35;

  // 4. Letter Body Content
  let letterBody = '';
  if (template && template.body) {
    letterBody = interpolateLetterTokens(template.body, lead);
  } else {
    letterBody = `Dear ${lead.recipientName || lead.businessName},

On behalf of the organizing committee, I am writing to cordially invite ${lead.businessName} to partner with us for the upcoming 6th Annual Fragrant Breeze Memorial Charity Golf Classic on ${EVENT_DETAILS.dateString} at the ${EVENT_DETAILS.venue.name}.

This annual memorial tournament honors the legacy of ${EVENT_DETAILS.memorialHonoree}. 100% of all net proceeds raised directly benefit ${EVENT_DETAILS.beneficiaryOrg}.

We are currently welcoming select community leaders and local businesses to participate as a ${lead.targetTier || 'Hole Sponsor'} or Corporate Team Partner.

SPONSORSHIP & COMMUNITY PARTNER BENEFITS:
• Prominent Corporate Banner & Custom Hole Tee-Box Signage displayed on-course
• Recognition in the official Tournament Program Book & Digital Leaderboard
• Complimented Golfer Entries & Post-Tournament Awards Banquet Tickets
• Official Tax Acknowledgment & Charity Tax Receipts provided

Field spots and dedicated hole signage slots are limited. We would be honored to feature ${lead.businessName} among our distinguished community supporters this year.

Please feel free to contact our Tournament Chair directly at ${EVENT_DETAILS.phone} or reply to confirm your reservation.

With sincere gratitude,

Saied Mohammed
Tournament Founder & Director
Fragrant Breeze Memorial Charity Golf Classic
Phone: ${EVENT_DETAILS.phone}
Email: ${EVENT_DETAILS.email}
Website: https://fragrant-breeze-golf-tournament.ai.studio`;
  }

  // Strip Markdown bold asterisks and clean formatting
  const cleanedBody = letterBody
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1');

  const paragraphs = cleanedBody.split('\n');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  const lineHeight = 13;

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      y += 6;
      continue;
    }

    const splitLines = doc.splitTextToSize(paragraph, contentWidth);

    for (const line of splitLines) {
      if (y > pageHeight - margin - 50) {
        // Add new page
        doc.addPage();
        y = margin + 20;

        // Top Header line on page 2
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `6th Annual Fragrant Breeze Golf Classic — Solicitation Letter for ${lead.businessName}`,
          margin,
          y
        );
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y + 6, pageWidth - margin, y + 6);

        y += 25;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
      }

      // Highlight section headers
      if (
        line.startsWith('Dear') ||
        line.includes('BENEFITS:') ||
        line.includes('Warm regards') ||
        line.includes('With sincere gratitude')
      ) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += 4;
  }

  // 5. Official Footer on Bottom of Page
  const footerY = pageHeight - margin - 20;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 77, 43);
  doc.text('FRAGRANT BREEZE MEMORIAL CHARITY GOLF TOURNAMENT', margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Official Tax ID: ${EVENT_DETAILS.taxId} | Burford Golf Links, 120 Golf Links Rd., Burford ON`,
    margin,
    footerY + 10
  );

  doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - margin, footerY + 10, { align: 'right' });

  // Save the PDF download
  const sanitizedBizName = lead.businessName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Solicitation_Letter_${sanitizedBizName}.pdf`;
  doc.save(filename);
}

/**
 * Generates a clean consolidated PDF report document for the currently
 * active Status tab / Filtered leads section (e.g. Opened, Letter Sent, Pledged, All Leads)
 */
export function generateFilteredLeadsReportPDF(
  leads: OutreachLead[],
  statusFilter: string,
  tierFilter: string
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  // 1. Header Banner
  doc.setFillColor(30, 77, 43); // #1E4D2B
  doc.rect(margin, y, contentWidth, 52, 'F');

  // Gold accent bar
  doc.setFillColor(212, 175, 55); // #D4AF37
  doc.rect(margin, y + 52, contentWidth, 3, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('6TH ANNUAL CHARITY FRAGRANT BREEZE GOLF CLASSIC', margin + 12, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 240, 225);
  doc.text(
    `Corporate Solicitation Section Report — Section: ${(statusFilter || 'All Leads').toUpperCase()}  |  Tier Filter: ${(tierFilter || 'All Tiers').toUpperCase()}`,
    margin + 12,
    y + 38
  );

  y += 68;

  // 2. Summary KPI Box
  const totalPledged = leads.reduce((sum, l) => sum + (l.pledgedAmount || 0), 0);
  const totalOpens = leads.reduce((sum, l) => sum + (l.openCount || 0), 0);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 77, 43);
  doc.text(`ACTIVE SECTION SUMMARY: ${(statusFilter || 'All Leads').toUpperCase()}`, margin + 12, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Total Section Leads: ${leads.length}  |  Total Pledged: $${totalPledged.toLocaleString()} CAD  |  Email Opens: ${totalOpens}  |  Generated: ${new Date().toLocaleDateString()}`,
    margin + 12,
    y + 28
  );

  y += 48;

  // 3. Table Headers
  const headers = ['#', 'Business Name & Contact', 'Email Address', 'Phone', 'Target Tier', 'Status', 'Opens', 'Pledged', 'Next Action'];
  const colWidths = [25, 150, 155, 85, 85, 75, 40, 55, 50];

  doc.setFillColor(30, 77, 43);
  doc.rect(margin, y, contentWidth, 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);

  let xAcc = margin + 5;
  headers.forEach((h, idx) => {
    doc.text(h, xAcc, y + 12);
    xAcc += colWidths[idx];
  });

  y += 18;

  // 4. Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  if (leads.length === 0) {
    doc.setTextColor(148, 163, 184);
    doc.text('No leads found matching current section filter criteria.', margin + 10, y + 15);
  } else {
    leads.forEach((lead, index) => {
      if (y > pageHeight - margin - 30) {
        doc.addPage();
        y = margin + 20;

        // Header on new page
        doc.setFillColor(30, 77, 43);
        doc.rect(margin, y, contentWidth, 18, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);

        let xH = margin + 5;
        headers.forEach((h, idx) => {
          doc.text(h, xH, y + 12);
          xH += colWidths[idx];
        });

        y += 18;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
      }

      // Alternating row background
      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 17, 'F');
      }

      doc.setTextColor(30, 41, 59);

      let x = margin + 5;

      // Index
      doc.text(String(index + 1), x, y + 11);
      x += colWidths[0];

      // Business Name
      const bizText = lead.businessName.length > 26 ? lead.businessName.substring(0, 24) + '...' : lead.businessName;
      doc.setFont('helvetica', 'bold');
      doc.text(bizText, x, y + 11);
      doc.setFont('helvetica', 'normal');
      x += colWidths[1];

      // Email
      const emailText = (lead.emailAddress || '-').length > 27 ? (lead.emailAddress || '-').substring(0, 25) + '...' : (lead.emailAddress || '-');
      doc.text(emailText, x, y + 11);
      x += colWidths[2];

      // Phone
      doc.text(lead.contactNumber || '-', x, y + 11);
      x += colWidths[3];

      // Target Tier
      doc.text(lead.targetTier || '-', x, y + 11);
      x += colWidths[4];

      // Status
      doc.text(lead.status || '-', x, y + 11);
      x += colWidths[5];

      // Opens
      doc.text(String(lead.openCount || 0), x, y + 11);
      x += colWidths[6];

      // Pledged
      doc.text(lead.pledgedAmount ? `$${lead.pledgedAmount.toLocaleString()}` : '-', x, y + 11);
      x += colWidths[7];

      // Next Action
      doc.text(lead.nextFollowUpDate || '-', x, y + 11);

      // Line
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, y + 17, margin + contentWidth, y + 17);

      y += 17;
    });
  }

  // Footer
  const footerY = pageHeight - margin - 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`6th Annual Fragrant Breeze Golf Classic — ${statusFilter} Section Report`, margin, footerY);
  doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - margin, footerY, { align: 'right' });

  const sanitizedStatus = (statusFilter || 'All_Leads').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Solicitation_Report_${sanitizedStatus}.pdf`);
}
