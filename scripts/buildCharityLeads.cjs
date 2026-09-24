const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../data/charity_golf_email_addresses.csv');
const text = fs.readFileSync(csvPath, 'utf-8');

function parseCSV(csv) {
  const rows = [];
  let row = [];
  let token = '';
  let inQuotes = false;
  
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    const next = csv[i+1];
    
    if (c === '"' && inQuotes && next === '"') {
      token += '"';
      i++;
    } else if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push(token.trim());
      token = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(token.trim());
      if (row.some(field => field.length > 0)) {
        rows.push(row);
      }
      row = [];
      token = '';
    } else {
      token += c;
    }
  }
  if (token || row.length > 0) {
    row.push(token.trim());
    if (row.some(field => field.length > 0)) {
      rows.push(row);
    }
  }
  return rows;
}

const parsed = parseCSV(text);
const header = parsed[0];
const dataRows = parsed.slice(1);

console.log(`Processing ${dataRows.length} rows...`);

// Deduplicate leads by emailAddress
const seenEmails = new Set();
const cleanLeads = [];

let idCounter = 1;

for (const row of dataRows) {
  let [
    businessName,
    address,
    city,
    prov,
    description,
    contactNumber,
    emailAddress,
    namesForEmail,
    contactPerson,
    businessUrl
  ] = row;

  if (!businessName || !emailAddress) continue;

  // Clean email
  emailAddress = emailAddress.replace(/^u003e/i, '').trim().toLowerCase();
  if (!emailAddress.includes('@')) continue;

  // If already seen, skip duplicate email
  if (seenEmails.has(emailAddress)) {
    continue;
  }
  seenEmails.add(emailAddress);

  // Recipient name
  let recipientName = (contactPerson || '').trim();
  if (!recipientName) {
    if (namesForEmail && namesForEmail.trim() && namesForEmail.trim().toLowerCase() !== businessName.trim().toLowerCase()) {
      recipientName = namesForEmail.trim();
    } else {
      recipientName = businessName.trim();
    }
  }

  // Clean phone number
  contactNumber = (contactNumber || '').trim();

  // Clean URL
  businessUrl = (businessUrl || '').trim();
  if (businessUrl && !businessUrl.startsWith('http://') && !businessUrl.startsWith('https://')) {
    businessUrl = `https://${businessUrl}`;
  }

  // City & Prov
  city = (city || '').trim();
  prov = (prov || 'ON').trim();
  if (prov.toLowerCase() === 'ontario') prov = 'ON';

  // Target Tier
  let targetTier = 'Hole Sponsor';
  const nameLower = businessName.toLowerCase();
  const descLower = (description || '').toLowerCase();

  if (nameLower.includes('golf club') || nameLower.includes('country club') || nameLower.includes('golf links')) {
    targetTier = 'Hole Sponsor';
  } else if (nameLower.includes('brewery') || nameLower.includes('bar') || nameLower.includes('eatery') || nameLower.includes('kitchen') || nameLower.includes('bistro')) {
    targetTier = 'Beverage Cart Sponsor';
  } else if (nameLower.includes('sports') || nameLower.includes('trophies') || nameLower.includes('jewel') || nameLower.includes('boutique') || nameLower.includes('toys')) {
    targetTier = 'Prize / Raffle Donor';
  } else if (nameLower.includes('capital') || nameLower.includes('volkswagen') || nameLower.includes('marriott') || nameLower.includes('remax')) {
    targetTier = 'Eagle Sponsor';
  }

  cleanLeads.push({
    id: `lead-outscraper-${idCounter++}`,
    businessName: businessName.trim(),
    recipientName: recipientName,
    emailAddress: emailAddress,
    contactNumber: contactNumber || undefined,
    businessUrl: businessUrl || undefined,
    address: (address || '').trim() || undefined,
    city: city || undefined,
    prov: prov || undefined,
    targetTier: targetTier,
    status: 'Identified',
    notes: (description || '').trim() || `Sourced from Ontario Golf Vendors Directory: ${city || ''}, ${prov || 'ON'}`.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

console.log(`Successfully generated ${cleanLeads.length} unique outreach leads.`);

const tsContent = `import { OutreachLead } from '../types';

/**
 * 351 Verified Ontario Golf Vendors Directory Outreach Leads
 * Sourced from: Ontario Golf Vendors Directory
 * Columns: Column A (Business Name), Column G (Email Address)
 */
export const ONTARIO_GOLF_VENDORS_LEADS: OutreachLead[] = ${JSON.stringify(cleanLeads, null, 2)};

// Backwards compatibility alias
export const OUTSCRAPER_OUTREACH_LEADS = ONTARIO_GOLF_VENDORS_LEADS;
`;

fs.writeFileSync(path.join(__dirname, '../src/data/charityGolfLeads.ts'), tsContent, 'utf-8');
console.log('Saved to src/data/charityGolfLeads.ts');
