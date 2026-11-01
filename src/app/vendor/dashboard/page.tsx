import React, { useState } from 'react';
import { Briefcase, Eye, PhoneCall, Plus, ShieldCheck, CheckCircle2, Zap, Download, Search, Calendar, StickyNote, Building2 } from 'lucide-react';
import { store } from '../../../mock/store';
import type { VendorTeamMember, LeadStatus, Lead } from '../../../types';

interface VendorDashboardPageProps {
  onNavigate?: (route: string) => void;
}

export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'leads' | 'builder' | 'team' | 'billing'>('overview');
  const org = store.getVendorOrganizations()[0];
  const listings = store.getAllListings();
  const [leadsList, setLeadsList] = useState<Lead[]>(store.getLeads());
  const [teamNotice, setTeamNotice] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'ALL' | LeadStatus>('ALL');
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.hash = `#${route}`;
    }
  };

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    store.updateLeadStatus(leadId, status);
    setLeadsList([...store.getLeads()]);
  };

  const handleAddNote = (leadId: string) => {
    const text = noteInputs[leadId];
    if (!text || !text.trim()) return;
    store.addLeadNote(leadId, text.trim(), org.name || 'Vendor Admin');
    setNoteInputs(prev => ({ ...prev, [leadId]: '' }));
    setLeadsList([...store.getLeads()]);
  };

  const handleSetFollowUp = (leadId: string, date: string) => {
    store.setLeadFollowUp(leadId, date);
    setLeadsList([...store.getLeads()]);
  };

  const exportLeadsToCSV = () => {
    const headers = ['Lead ID', 'Buyer Name', 'Phone', 'Listing', 'Status', 'Channel', 'Follow-up Date', 'Notes Count'];
    const rows = leadsList.map(l => [
      l.id,
      `"${l.buyerName.replace(/"/g, '""')}"`,
      `"${l.buyerPhone}"`,
      `"${l.listingTitle.replace(/"/g, '""')}"`,
      l.status,
      l.channel,
      l.followUpDate || 'None',
      (l.notes || []).length
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TrustNest_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leadsList.filter(l => {
    const matchesFilter = leadStatusFilter === 'ALL' || l.status === leadStatusFilter;
    const matchesSearch = !leadSearch ||
      l.buyerName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.buyerPhone.includes(leadSearch) ||
      l.listingTitle.toLowerCase().includes(leadSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const BUILDER_PROJECTS = [
    {
      id: 'proj-1',
      name: 'Prestige Lakeside Sanctuary',
      city: 'Bengaluru',
      locality: 'Whitefield',
      reraId: 'PRM/KA/RERA/1251/446/PR/220115/004652',
      status: 'UNDER_CONSTRUCTION',
      completionDate: 'December 2026',
      totalUnits: 420,
      availableUnits: 86,
      priceRange: '₹1.45 Cr - ₹3.80 Cr',
      configurations: ['2 BHK (1,150 sq.ft)', '3 BHK (1,680 sq.ft)', '4 BHK Sky Villa (2,900 sq.ft)'],
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'proj-2',
      name: 'DLF Cyber Enclave Phase 2',
      city: 'Gurugram',
      locality: 'Golf Course Extension Rd',
      reraId: 'HRERA-PKL-GGM-1422-2023',
      status: 'READY_TO_MOVE',
      completionDate: 'Ready for Possession',
      totalUnits: 280,
      availableUnits: 14,
      priceRange: '₹3.20 Cr - ₹7.50 Cr',
      configurations: ['3 BHK Luxury (2,250 sq.ft)', '4 BHK Penthouse (4,100 sq.ft)'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-navy-900 text-cream-50 rounded-3xl p-6 sm:p-8 border border-orange-500/30 shadow-trust relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-800 text-amber-soft rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-navy-700">
              <Briefcase className="w-3.5 h-3.5 text-orange-500" />
              Vendor Operating System v2.4 · Multi-Seat CRM
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {org.name}
              <CheckCircle2 className="w-6 h-6 text-trust-green fill-trust-green/20" />
            </h1>

            <p className="text-xs text-cream-200 mt-1">
              GSTIN: {org.gstNumber} · {org.businessType} · Plan: <span className="text-amber-soft font-bold">{org.subscriptionPlan}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate('post')}
              className="px-4 py-2.5 bg-orange-500 text-white font-extrabold rounded-2xl text-xs shadow-orange-glow flex items-center gap-2 hover:bg-orange-600 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post Vendor Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-900/10 overflow-x-auto pb-2 text-xs font-extrabold">
        {[
          { id: 'overview', label: 'Overview Metrics' },
          { id: 'listings', label: `My Listings (${listings.length})` },
          { id: 'leads', label: `Lead Pipeline (${leadsList.length})` },
          { id: 'builder', label: `Builder Projects (${BUILDER_PROJECTS.length})` },
          { id: 'team', label: `Team Members (${org.members.length})` },
          { id: 'billing', label: 'Subscription & Promos' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-navy-900 text-cream-50 shadow-sm'
                : 'bg-white text-navy-900 hover:bg-cream-200 border border-navy-900/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-cream-50 p-6 rounded-3xl border border-navy-900/10 shadow-trust">
              <div className="flex items-center justify-between text-navy-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Active Listings</span>
                <Briefcase className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-extrabold text-navy-900">{org.activeListingsCount}</div>
              <div className="text-[11px] text-trust-green font-semibold mt-1">✓ 100% Passed Verification</div>
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-navy-900/10 shadow-trust">
              <div className="flex items-center justify-between text-navy-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Monthly Enquiries</span>
                <PhoneCall className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-extrabold text-navy-900">{leadsList.length * 8 + 42}</div>
              <div className="text-[11px] text-orange-600 font-semibold mt-1">↑ +18% vs Last Month</div>
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-navy-900/10 shadow-trust">
              <div className="flex items-center justify-between text-navy-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Verified Leads In CRM</span>
                <Eye className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-extrabold text-navy-900">{leadsList.length}</div>
              <div className="text-[11px] text-trust-green font-semibold mt-1">Direct Buyer Connects</div>
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-navy-900/10 shadow-trust">
              <div className="flex items-center justify-between text-navy-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Org Trust Index</span>
                <ShieldCheck className="w-4 h-4 text-trust-green" />
              </div>
              <div className="text-3xl font-extrabold text-navy-900">96.8<span className="text-sm font-normal text-navy-700">/100</span></div>
              <div className="text-[11px] text-trust-green font-semibold mt-1">Tier 1 Verified Developer</div>
            </div>
          </div>
        </div>
      )}

      {/* LEADS PIPELINE CRM TAB */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
                <span>Lead Pipeline & Follow-up CRM</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cream-200 text-navy-900">
                  {filteredLeads.length} Total
                </span>
              </h3>
              <p className="text-xs text-navy-700 mt-0.5">
                8-stage verified lead management, private follow-up notes, and instant CSV export.
              </p>
            </div>

            <button
              type="button"
              onClick={exportLeadsToCSV}
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-center"
            >
              <Download className="w-3.5 h-3.5 text-orange-500" />
              <span>Export Leads to CSV</span>
            </button>
          </div>

          {/* Filter and Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by buyer name, phone, or property..."
                value={leadSearch}
                onChange={e => setLeadSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-cream-50 border border-navy-900/10 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <select
                value={leadStatusFilter}
                onChange={e => setLeadStatusFilter(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-navy-900/10 rounded-xl text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="ALL">All Stages (8 Stages)</option>
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="FOLLOW_UP">FOLLOW_UP</option>
                <option value="NEGOTIATION">NEGOTIATION</option>
                <option value="CONVERTED">CONVERTED (Won)</option>
                <option value="NOT_INTERESTED">NOT_INTERESTED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          {/* Lead Cards List */}
          <div className="space-y-4 pt-2">
            {filteredLeads.length > 0 ? (
              filteredLeads.map(lead => (
                <div
                  key={lead.id}
                  className="p-5 bg-cream-50 rounded-2xl border border-navy-900/10 space-y-4 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-navy-900/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-navy-900 text-sm">{lead.buyerName}</span>
                        <span className="px-2 py-0.5 bg-white border border-navy-900/10 rounded-full text-[10px] font-mono font-bold text-navy-700">
                          {lead.channel}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-orange-600 mt-0.5">{lead.listingTitle}</div>
                      <div className="text-xs text-navy-700 mt-0.5 font-mono">
                        Phone: <span className="font-bold text-navy-900">{lead.buyerPhone}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-xs font-bold text-navy-700">Stage:</div>
                      <select
                        value={lead.status}
                        onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className="px-3 py-1.5 bg-white border border-navy-900/15 rounded-xl text-xs font-extrabold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="INTERESTED">INTERESTED</option>
                        <option value="FOLLOW_UP">FOLLOW_UP</option>
                        <option value="NEGOTIATION">NEGOTIATION</option>
                        <option value="CONVERTED">CONVERTED (Won)</option>
                        <option value="NOT_INTERESTED">NOT_INTERESTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  {/* Follow-up reminder & Private Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-navy-900 mb-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        <span>Follow-up Reminder Date:</span>
                      </div>
                      <input
                        type="date"
                        value={lead.followUpDate || ''}
                        onChange={e => handleSetFollowUp(lead.id, e.target.value)}
                        className="px-3 py-1.5 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-navy-900 mb-1.5">
                        <StickyNote className="w-3.5 h-3.5 text-orange-500" />
                        <span>Add Private Lead Note:</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Buyer offered 1.8 Cr, requested second site visit Saturday..."
                          value={noteInputs[lead.id] || ''}
                          onChange={e => setNoteInputs({ ...noteInputs, [lead.id]: e.target.value })}
                          onKeyDown={e => { if (e.key === 'Enter') handleAddNote(lead.id); }}
                          className="flex-1 px-3 py-1.5 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddNote(lead.id)}
                          className="px-3 py-1.5 bg-navy-900 text-white font-bold rounded-xl text-xs hover:bg-navy-800 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Existing Notes History */}
                  {lead.notes && lead.notes.length > 0 && (
                    <div className="pt-2 border-t border-navy-900/10 space-y-1.5">
                      <div className="text-[11px] font-bold text-navy-700 uppercase tracking-wider">Internal Notes:</div>
                      {lead.notes.map(note => (
                        <div key={note.id} className="p-2.5 bg-white rounded-xl border border-navy-900/10 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5">
                            <span className="font-bold text-navy-900">{note.author}</span>
                            <span>{note.createdAt}</span>
                          </div>
                          <div className="text-navy-800">{note.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-cream-50 rounded-2xl border border-dashed border-navy-900/20 text-navy-700 text-xs">
                No leads match your current search and filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* BUILDER PROJECTS SHOWCASE TAB */}
      {activeTab === 'builder' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                <span>Developer Project Showcase</span>
              </h3>
              <p className="text-xs text-navy-700 mt-0.5">
                Manage registered residential and commercial towers, unit inventory, and RERA compliance documents.
              </p>
            </div>
            <button
              onClick={() => handleNavigate('post')}
              className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-orange-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUILDER_PROJECTS.map(proj => (
              <div key={proj.id} className="bg-cream-50 rounded-2xl border border-navy-900/10 overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <img src={proj.image} alt={proj.name} className="w-full h-48 object-cover" />
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-trust-green/10 text-trust-green font-bold text-[10px] rounded-full uppercase tracking-wider">
                        {proj.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-navy-700">{proj.locality}, {proj.city}</span>
                    </div>

                    <h4 className="text-lg font-extrabold text-navy-900">{proj.name}</h4>

                    <div className="p-3 bg-white rounded-xl border border-navy-900/10 text-xs space-y-1">
                      <div className="font-mono text-[11px] text-navy-700">RERA: <span className="font-bold text-navy-900">{proj.reraId}</span></div>
                      <div className="text-orange-600 font-extrabold text-sm">{proj.priceRange}</div>
                      <div className="text-[11px] text-gray-500">Possession: {proj.completionDate}</div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-bold text-navy-800">Unit Configurations:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.configurations.map(c => (
                          <span key={c} className="px-2 py-0.5 bg-cream-200 text-navy-900 text-[10px] font-semibold rounded-md">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-navy-900/10 mt-3 pt-3">
                  <div className="text-xs">
                    <span className="font-extrabold text-trust-green">{proj.availableUnits}</span> of {proj.totalUnits} Units Available
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading verified RERA brochure for ${proj.name}...`)}
                    className="px-3.5 py-1.5 bg-navy-900 text-white font-bold text-xs rounded-xl hover:bg-navy-800 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-500" />
                    <span>Brochure</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAM MEMBERS TAB */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-6">
          {teamNotice && (
            <div className="px-4 py-3 bg-trust-green/10 text-trust-green border border-trust-green/30 rounded-2xl text-xs font-bold animate-fadeIn">
              {teamNotice}
            </div>
          )}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-navy-900">Team Roster & Agent Allocation</h3>
            <button
              onClick={() => {
                setTeamNotice('✓ Invitation sent! The new team member will receive an onboarding email within 24 hours.');
                setTimeout(() => setTeamNotice(''), 4000);
              }}
              className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-orange-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Invite Team Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {org.members.map((member: VendorTeamMember) => (
              <div key={member.id} className="p-5 bg-cream-50 rounded-2xl border border-navy-900/10 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-sm text-navy-900">{member.name}</div>
                    <span className="px-2 py-0.5 bg-navy-900 text-cream-50 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-navy-700 space-y-1 pt-2 border-t border-navy-900/10">
                  <div>{member.email}</div>
                  <div>{member.phone}</div>
                  <div className="font-semibold text-orange-600">{member.assignedLeads} Assigned Leads</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LISTINGS TAB */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl p-6 border border-navy-900/10 shadow-trust space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-navy-900">Organization Active Listings</h3>
            <button
              onClick={() => handleNavigate('post')}
              className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-orange-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Listing
            </button>
          </div>
          <div className="space-y-3">
            {listings.map(l => (
              <div
                key={l.id}
                className="p-4 bg-cream-50 rounded-2xl border border-navy-900/10 flex items-center justify-between hover:border-orange-500/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={l.images[0]} alt="" className="w-16 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="text-sm font-bold text-navy-900">{l.title}</div>
                    <div className="text-xs text-navy-700">{l.formattedPrice} · Trust Score {l.trustScore.overallScore}/100</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-navy-900 text-amber-soft font-bold text-xs rounded-full uppercase">
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BILLING TAB */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-navy-900 text-cream-50 rounded-3xl p-6 sm:p-8 border border-orange-500/30 shadow-trust">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="text-xs font-bold text-amber-soft uppercase tracking-wider mb-1">Current Plan</div>
                <div className="text-3xl font-extrabold text-white">{org.subscriptionPlan}</div>
                <p className="text-xs text-cream-200 mt-1">Renewal: December 31, 2026 · Annual Billing</p>
              </div>
              <button
                onClick={() => alert('Opening subscription upgrades...')}
                className="px-5 py-3 bg-orange-500 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow hover:bg-orange-600 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Upgrade to Enterprise
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { name: 'Starter', price: '₹4,999/mo', features: ['Basic Trust Verification', '50 Leads/Month', '1 Team Member'] },
              { name: 'Professional', price: '₹14,999/mo', features: ['Advanced Verification', '500 Leads/Month', '10 Team Members', 'Priority Support'] },
              { name: 'Platinum', price: '₹39,999/mo', features: ['Full Trust Engine', 'Unlimited Leads', 'Full Team Roster', 'Dedicated CSM', 'API Access'] },
            ].map(plan => (
              <div
                key={plan.name}
                className={`bg-white rounded-3xl p-6 border shadow-trust space-y-4 ${
                  org.subscriptionPlan === plan.name ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-navy-900/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-navy-900">{plan.name}</h4>
                  {org.subscriptionPlan === plan.name && (
                    <span className="text-[10px] font-extrabold uppercase bg-orange-500 text-white px-2 py-0.5 rounded-full">Current</span>
                  )}
                </div>
                <div className="text-2xl font-extrabold text-navy-900">{plan.price}</div>
                <ul className="text-xs text-navy-700 space-y-1.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-trust-green shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={org.subscriptionPlan === plan.name}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    org.subscriptionPlan === plan.name
                      ? 'bg-cream-200 text-navy-700 cursor-default'
                      : 'bg-navy-900 text-white hover:bg-navy-800 cursor-pointer'
                  }`}
                >
                  {org.subscriptionPlan === plan.name ? 'Active Plan' : 'Switch to ' + plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
