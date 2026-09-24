import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'pt',
  format: 'letter'
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 54; // 0.75 in
const contentWidth = pageWidth - margin * 2;

// Header / Letterhead
// Organization title on left
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
doc.setTextColor(19, 74, 134); // #134A86 Hamilton Health blue
doc.text('Hamilton\nHealth Sciences\nFoundation', margin, 58, { lineHeightFactor: 1.15 });

// Slogan on right
doc.setFont('helvetica', 'bold');
doc.setFontSize(15);
doc.setTextColor(16, 92, 137);
doc.text('Give today,', pageWidth - margin, 58, { align: 'right' });
doc.setTextColor(41, 145, 178);
doc.text('save lives', pageWidth - margin, 74, { align: 'right' });
doc.text('tomorrow', pageWidth - margin, 90, { align: 'right' });

// Decorative top accent line
doc.setDrawColor(220, 225, 230);
doc.setLineWidth(0.75);
doc.line(margin, 106, pageWidth - margin, 106);

// Date
let y = 135;
doc.setFont('helvetica', 'normal');
doc.setFontSize(10.5);
doc.setTextColor(40, 40, 40);
doc.text('September 1, 2026', margin, y);

y += 24;
doc.text('Dear Friends and Supporters,', margin, y);

y += 20;
const paragraphs = [
  'On behalf of the Hamilton Health Sciences Foundation, we are pleased to acknowledge the 6th Annual Fragrant Breeze Golf Tournament, taking place on Monday, October 5, 2026 at Burford Golf Links Course in Burford, Ontario. A portion of the proceeds from this event will directly support critical cancer research at Juravinski Hospital and Cancer Centre.',

  'Juravinski Hospital and Cancer Centre is one of Ontario’s most comprehensive cancer centres and the only site in south-central Ontario treating all types of cancer. It is also home to the Breast Assessment Centre (BAC), one of the most advanced breast screening and assessment centres of its kind, providing care for more than 14,000 patients annually. Our world-class research team is conducting ground-breaking studies aimed at better understanding and treating various types of cancer. With your generous support, we can continue to make strides in cancer research, ultimately enhancing the level of care we provide to our patients.',

  'Your contributions to this event are a vital part of our mission to advance cancer research. These funds enable us to explore new treatment options, improve patient outcomes, and bring hope to countless individuals and families affected by cancer. Every dollar raised brings us closer to breakthroughs that will make a real difference in the fight against cancer.',

  'A special thank you to Saied Mohammed for organizing this incredible event and for championing this cause on behalf of our community’s patients and families who rely on the advancements made possible by Juravinski Hospital and Cancer Centre’s research initiatives. It is through support like yours that we can continue to push the boundaries of cancer research and improve the lives of those we serve.',

  'Thank you for your efforts to support our mission. If you have any questions or need further information, please feel free to contact me at 905-521-2100 ext. 66381 or at trivediru@hhsc.ca.'
];

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);
doc.setTextColor(35, 35, 35);

paragraphs.forEach((p) => {
  const lines = doc.splitTextToSize(p, contentWidth);
  doc.text(lines, margin, y, { lineHeightFactor: 1.4 });
  y += lines.length * 14 + 11;
});

// Signoff
y += 6;
doc.text('Sincerely,', margin, y);

// Signature
y += 20;
doc.setFont('times', 'italic');
doc.setFontSize(16);
doc.setTextColor(25, 45, 80);
doc.text('Rutva Trivedi', margin + 5, y);

y += 24;
doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(30, 30, 30);
doc.text('Rutva Trivedi', margin, y);

y += 13;
doc.setFont('helvetica', 'normal');
doc.setFontSize(9.5);
doc.setTextColor(60, 60, 60);
doc.text('Development Coordinator', margin, y);

y += 13;
doc.text('Hamilton Health Sciences Foundation', margin, y);

y += 13;
doc.setTextColor(19, 74, 134);
doc.text('trivediru@hhsc.ca', margin, y);

y += 13;
doc.setTextColor(60, 60, 60);
doc.text('905-521-2100 ext. 66381', margin, y);

// Footer
const footerY = pageHeight - 34;
doc.setDrawColor(200, 205, 210);
doc.setLineWidth(0.5);
doc.line(margin, footerY - 14, pageWidth - margin, footerY - 14);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(100, 110, 120);
doc.text(
  'PO Box 739 LCD 1, Hamilton, ON L8N 3M8  |  905-522-3863  |  hamiltonhealth.ca  |  Charitable Reg. No: 131159543 RR0001',
  pageWidth / 2,
  footerY,
  { align: 'center' }
);

const outputDir = path.resolve('public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const targetFileName = 'Fragrant Breeze Acknowledgement Letter - September 1, 2026.pdf';
const outputPath = path.join(outputDir, targetFileName);
const pdfData = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfData));

console.log('PDF successfully generated at:', outputPath);
