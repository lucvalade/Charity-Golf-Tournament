import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { SPONSORSHIP_PACKAGES } from '../../data/initialData';
import { SponsorRecord, SponsorTier } from '../../types';
import {
  Award,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Globe,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Edit3,
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { formatNameTitleCase } from '../../utils/textFormatting';

interface SponsorsCardProps {
  title?: string;
  subtitle?: string;
  onSendSolicitation?: (email: string, companyName?: string) => void;
  className?: string;
}

export const SponsorsCard: React.FC<SponsorsCardProps> = ({
  title = "Corporate Sponsors & Event Partners Directory",
  subtitle = "Real-time directory of tournament sponsors, contribution amounts, contact points, payment status, and sponsorship packages.",
  onSendSolicitation,
  className = ""
}) => {
  const { sponsors, openSponsorModal, deleteSponsor, addToast } = useTournament();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Helper to map sponsor tier to package details
  const getPackageDetails = (tier: SponsorTier) => {
    const pkg = SPONSORSHIP_PACKAGES.find((p) => p.id === tier);
    if (pkg) return pkg;
    switch (tier) {
      case 'presenting':
        return { name: 'Presenting Title Sponsor', amount: 10000, badgeColor: 'bg-amber-100 text-amber-950 border-amber-400' };
      case 'eagle':
        return { name: 'Memorial Eagle Sponsor', amount: 5000, badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-400' };
      case 'birdie':
        return { name: 'Birdie Foursome Sponsor', amount: 2500, badgeColor: 'bg-blue-100 text-blue-950 border-blue-400' };
      case 'hole':
        return { name: 'Hole & Tee Box Sponsor', amount: 500, badgeColor: 'bg-[#D4AF37]/20 text-emerald-950 border-[#D4AF37]' };
      case 'contest':
        return { name: 'Putting & Contest Sponsor', amount: 300, badgeColor: 'bg-purple-100 text-purple-950 border-purple-300' };
      default:
        return { name: 'Corporate Sponsor', amount: 1000, badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  // Filter sponsors based on search & filter state
  const filteredSponsors = sponsors.filter((sponsor) => {
    if (selectedTier !== "all" && sponsor.tier !== selectedTier) return false;
    if (selectedStatus !== "all" && sponsor.status !== selectedStatus) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchCompany = sponsor.companyName?.toLowerCase().includes(q);
    const matchContact = sponsor.contactName?.toLowerCase().includes(q);
    const matchEmail = sponsor.email?.toLowerCase().includes(q);
    const matchPhone = sponsor.phone?.toLowerCase().includes(q);

    return matchCompany || matchContact || matchEmail || matchPhone;
  });

  // Calculate metrics
  const totalRevenuePledged = sponsors.reduce((sum, s) => {
    const pkg = getPackageDetails(s.tier);
    return sum + (pkg ? pkg.amount : 0);
  }, 0);

  const confirmedCount = sponsors.filter((s) => s.status === 'confirmed').length;
  const titleEagleCount = sponsors.filter((s) => s.tier === 'presenting' || s.tier === 'eagle').length;

  const handleDeleteSponsor = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete sponsor "${name}" from the database?`)) {
      deleteSponsor(id);
      addToast('info', 'Sponsor Removed', `Removed ${name} from corporate sponsors directory.`);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden ${className}`}>
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#1E4D2B] via-[#15803D] to-[#0F2D17] p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37] text-emerald-950 font-bold text-[10px] uppercase tracking-wider mb-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>Corporate Partners &bull; Sponsors Card</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-serif-heading text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-emerald-100/90 mt-1">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => openSponsorModal('eagle')}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-amber-400 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Corporate Sponsor</span>
            </button>
          </div>
        </div>

        {/* Metric Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-800/70">
          <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-700/60">
            <div className="text-[10px] uppercase font-bold text-emerald-300">Total Partners</div>
            <div className="text-lg font-extrabold text-white mt-0.5 font-mono">
              {sponsors.length} Sponsors
            </div>
          </div>
          <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-700/60">
            <div className="text-[10px] uppercase font-bold text-amber-300">Sponsorship Pledged</div>
            <div className="text-lg font-extrabold text-amber-300 mt-0.5 font-mono">
              ${totalRevenuePledged.toLocaleString()} CAD
            </div>
          </div>
          <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-700/60">
            <div className="text-[10px] uppercase font-bold text-emerald-300">Confirmed / Paid</div>
            <div className="text-lg font-extrabold text-emerald-200 mt-0.5 font-mono">
              {confirmedCount} Confirmed
            </div>
          </div>
          <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-700/60">
            <div className="text-[10px] uppercase font-bold text-amber-300">Title &amp; Eagle Sponsors</div>
            <div className="text-lg font-extrabold text-white mt-0.5 font-mono">
              {titleEagleCount} Premier
            </div>
          </div>
        </div>

        {/* Filter & Search Controls Bar */}
        <div className="mt-4 pt-4 border-t border-emerald-800/70 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input
              type="text"
              placeholder="Search company name, primary contact, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-emerald-950/70 border border-emerald-700/80 rounded-xl text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap">
            <div className="flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60 text-xs">
              <span className="text-[11px] text-emerald-300 px-2 font-medium">Tier:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-emerald-900 border border-emerald-700 rounded-lg text-white text-xs px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="all">All Packages</option>
                <option value="presenting">Presenting Title ($10,000)</option>
                <option value="eagle">Memorial Eagle ($5,000)</option>
                <option value="birdie">Birdie Foursome ($2,500)</option>
                <option value="hole">Hole &amp; Tee Box ($500)</option>
                <option value="contest">Contest Sponsor ($300)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60 text-xs">
              <span className="text-[11px] text-emerald-300 px-2 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-emerald-900 border border-emerald-700 rounded-lg text-white text-xs px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sponsor Cards List */}
      <div className="p-5 sm:p-6 bg-slate-100/60">
        {filteredSponsors.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-2xl p-6">
            <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Sponsors Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm ? "No sponsors matched your search criteria." : "No corporate sponsors registered yet."}
            </p>
            <button
              type="button"
              onClick={() => openSponsorModal('eagle')}
              className="mt-4 px-4 py-2 bg-[#1E4D2B] text-white text-xs font-bold rounded-xl shadow-sm transition hover:bg-emerald-800 cursor-pointer"
            >
              + Register First Sponsor
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredSponsors.map((sponsor) => {
              const pkg = getPackageDetails(sponsor.tier);
              const isConfirmed = sponsor.status === 'confirmed';

              return (
                <div
                  key={sponsor.id}
                  className="bg-white border-2 border-slate-200 hover:border-[#1E4D2B] rounded-2xl p-5 transition-all duration-200 shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    {/* Sponsor Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-slate-200">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${pkg.badgeColor}`}>
                            {pkg.name}
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            {isConfirmed ? <CheckCircle2 className="w-3 h-3 text-emerald-700" /> : <Clock className="w-3 h-3 text-amber-700" />}
                            <span>{isConfirmed ? 'Confirmed & Paid' : 'Pending Pledge'}</span>
                          </span>
                        </div>

                        <h4 className="text-lg font-extrabold text-slate-900 font-serif-heading leading-snug">
                          {sponsor.companyName}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-extrabold font-mono text-[#1E4D2B]">
                          ${pkg.amount.toLocaleString()} CAD
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Pledged: {new Date(sponsor.pledgedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Primary Contact Details */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#1E4D2B] uppercase tracking-wider border-b border-slate-200 pb-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          Corporate Contact
                        </span>
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                          Main Delegate
                        </span>
                      </div>

                      <div className="text-sm font-extrabold text-slate-900">
                        {formatNameTitleCase(sponsor.contactName) || "Contact Name Pending"}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 pt-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <a href={`mailto:${sponsor.email}`} className="hover:text-emerald-800 hover:underline truncate font-medium">
                            {sponsor.email || "No Email"}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <a href={`tel:${sponsor.phone}`} className="hover:text-emerald-800 hover:underline truncate font-mono">
                            {sponsor.phone || "No Phone"}
                          </a>
                        </div>
                      </div>

                      {sponsor.websiteUrl && (
                        <div className="text-xs pt-1 border-t border-slate-200 flex items-center gap-1 text-slate-500">
                          <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <a
                            href={sponsor.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-emerald-800 hover:underline truncate flex items-center gap-1 font-medium text-emerald-900"
                          >
                            <span>{sponsor.websiteUrl}</span>
                            <ExternalLink className="w-3 h-3 text-emerald-600" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Custom Notes / Branding details */}
                    {sponsor.customNote && (
                      <div className="text-xs text-slate-600 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80 mb-3">
                        <strong className="text-amber-950 font-bold not-italic">Branding Note:</strong> {sponsor.customNote}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                    {onSendSolicitation ? (
                      <button
                        type="button"
                        onClick={() => onSendSolicitation(sponsor.email, sponsor.companyName)}
                        className="px-3 py-1.5 bg-[#1E4D2B] hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title="Send customized solicitation or thank you letter to this sponsor"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-300" />
                        <span>Solicitation Letter</span>
                      </button>
                    ) : <div />}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openSponsorModal(sponsor.tier)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer border border-slate-300"
                        title="Edit sponsor details or package tier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSponsor(sponsor.id, sponsor.companyName)}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer border border-rose-200"
                        title="Delete sponsor entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
