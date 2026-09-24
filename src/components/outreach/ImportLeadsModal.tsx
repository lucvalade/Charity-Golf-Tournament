import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Mail
} from 'lucide-react';
import { OutreachLead, OutreachTargetTier } from '../../types';

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: Array<Omit<OutreachLead, 'id' | 'createdAt' | 'updatedAt'>>) => void;
}

export const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({
  isOpen,
  onClose,
  onImportLeads
}) => {
  const [rawText, setRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<Array<Omit<OutreachLead, 'id' | 'createdAt' | 'updatedAt'>>>([]);
  const [error, setError] = useState('');

  const sampleCsv = `Company Name,Contact Person,Email Address,Phone,Target Tier,City,Website,Notes
Brantford Ford Auto,Mark Jenkins,mark@brantfordford.ca,(519) 555-8811,Eagle Sponsor,Brantford,https://brantfordford.ca,Interested in hole-in-one car sponsorship
Grand River Brewing,Sarah Tremblay,sarah@grandriverbrew.ca,(519) 555-2244,Beverage Cart Sponsor,Cambridge,https://grandriverbrew.ca,Supplying craft beer samples
Paris Dental Clinic,Dr. Raymond Shaw,drshaw@parisdental.ca,(519) 555-9933,Hole Sponsor,Paris,,Friend of the family`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'FBGT_Outreach_Leads_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCsvContent = (content: string) => {
    try {
      const lines = content.trim().split('\n');
      if (lines.length < 2) {
        setError('CSV must contain a header row and at least one lead entry.');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
      const results: Array<Omit<OutreachLead, 'id' | 'createdAt' | 'updatedAt'>> = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV splitter handling basic comma separation
        const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

        const getCol = (possibleNames: string[]): string => {
          for (let p of possibleNames) {
            const idx = headers.findIndex((h) => h.includes(p));
            if (idx !== -1 && cols[idx]) return cols[idx];
          }
          return '';
        };

        const businessName = getCol(['company', 'business', 'organization']) || cols[0] || 'Unknown Company';
        const recipientName = getCol(['contact', 'person', 'salutation', 'name']) || cols[1] || 'Partner Contact';
        const emailAddress = getCol(['email', 'mail']) || cols[2] || '';
        const contactNumber = getCol(['phone', 'tel', 'cell']) || cols[3] || '';
        const tierRaw = getCol(['tier', 'package', 'sponsorship']) || cols[4] || 'Eagle Sponsor';
        const city = getCol(['city', 'town']) || cols[5] || 'Burford';
        const businessUrl = getCol(['website', 'url', 'site']) || cols[6] || '';
        const notes = getCol(['note', 'comment', 'memo']) || cols[7] || '';

        if (!emailAddress || !emailAddress.includes('@')) {
          continue; // Skip rows without valid email
        }

        let targetTier: OutreachTargetTier = 'Eagle Sponsor';
        if (tierRaw.toLowerCase().includes('title')) targetTier = 'Title Sponsor';
        else if (tierRaw.toLowerCase().includes('birdie')) targetTier = 'Birdie Sponsor';
        else if (tierRaw.toLowerCase().includes('beverage')) targetTier = 'Beverage Cart Sponsor';
        else if (tierRaw.toLowerCase().includes('hole')) targetTier = 'Hole Sponsor';
        else if (tierRaw.toLowerCase().includes('prize') || tierRaw.toLowerCase().includes('raffle'))
          targetTier = 'Prize / Raffle Donor';
        else if (tierRaw.toLowerCase().includes('donor')) targetTier = 'General Donor';

        results.push({
          businessName,
          recipientName,
          emailAddress,
          contactNumber,
          businessUrl,
          city,
          prov: 'ON',
          targetTier,
          status: 'Identified',
          notes
        });
      }

      if (results.length === 0) {
        setError('No valid rows with email addresses found in the data.');
        setParsedRows([]);
      } else {
        setError('');
        setParsedRows(results);
      }
    } catch (e: any) {
      setError(`Failed to parse CSV: ${e?.message || 'Invalid format'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      parseCsvContent(content);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    onImportLeads(parsedRows);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#1E4D2B] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-[#D4AF37] flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-base font-bold">Import Prospective Leads via CSV</h2>
              <p className="text-xs text-emerald-200/90">
                Bulk upload prospective sponsors and donation targets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Download Sample */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-slate-600 text-[11px]">
              Need the exact spreadsheet column headings?
            </div>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Download Sample CSV</span>
            </button>
          </div>

          {/* File Dropper */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition bg-slate-50/50">
            <input
              type="file"
              id="csv-file-input"
              accept=".csv,text/csv,text/plain"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="csv-file-input"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#1E4D2B]">
                <Upload className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-800">
                Click to browse or drop your CSV file here
              </span>
              <span className="text-slate-500 text-[11px]">
                UTF-8 encoded comma-separated spreadsheet
              </span>
            </label>
          </div>

          {/* Paste Raw Text Alternative */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Or Paste CSV Content Directly:
            </label>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                parseCsvContent(e.target.value);
              }}
              placeholder={`Company Name,Contact Person,Email Address,Phone,Target Tier,City\nAcme Corp,John Doe,john@acme.com,(519) 555-0100,Eagle Sponsor,Burford`}
              className="w-full font-mono text-[11px] p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Parsed Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>
                  Ready to Import: {parsedRows.length} Prospective Leads
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Format Validated
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                {parsedRows.map((r, i) => (
                  <div key={i} className="p-2.5 bg-white flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-800">{r.businessName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.recipientName}</span>
                    </div>
                    <div className="font-mono text-slate-500">{r.emailAddress}</div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {r.targetTier}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={parsedRows.length === 0}
            onClick={handleConfirmImport}
            className="px-5 py-2.5 bg-[#1E4D2B] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>Import {parsedRows.length} Leads into CRM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
