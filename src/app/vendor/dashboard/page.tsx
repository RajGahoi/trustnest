import React, { useState } from 'react';
import { Briefcase, Eye, PhoneCall, Plus, ShieldCheck, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { store } from '../../../mock/store';
import type { VendorTeamMember } from '../../../types';

interface VendorDashboardPageProps {
  onNavigate?: (route: string) => void;
}

export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'leads' | 'team' | 'billing'>('overview');
  const org = store.getVendorOrganizations()[0];
  const listings = store.getAllListings();
  const leads = store.getLeads();
  const [teamNotice, setTeamNotice] = useState('');

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.hash = `#${route}`;
    }
  };

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-navy-900 text-cream-50 rounded-3xl p-6 sm:p-8 border border-orange-500/30 shadow-trust relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-800 text-amber-soft rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-navy-700">
              <Briefcase className="w-3.5 h-3.5 text-orange-500" />
              Vendor Operating System v2.4
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
          { id: 'leads', label: `Lead Pipeline (${leads.length})` },
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
              <div className="text-3xl font-extrabold text-navy-900">{org.monthlyLeadsCount}</div>
              <div className="text-[11px] text-orange-500 font-semibold mt-1">+24% vs last month</div>
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-navy-900/10 shadow-trust">
              <div className="flex items-center justify-between text-navy-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Verified Impression Views</span>
                <Eye className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-extrabold text-navy-900">14,820</div>
              <div className="text-[11px] text-navy-700 font-semibold mt-1">Across 8 Categories</div>
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-navy-900/10 shadow-trust">
              <div className="flex items-center justify-between text-navy-700 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Avg Organization Trust</span>
                <ShieldCheck className="w-4 h-4 text-trust-green" />
              </div>
              <div className="text-3xl font-extrabold text-navy-900">96 / 100</div>
              <div className="text-[11px] text-amber-soft bg-navy-900 px-2 py-0.5 rounded-full inline-block mt-1 font-bold">PLATINUM TIER</div>
            </div>
          </div>

          {/* Lead Pipeline Overview */}
          <div className="bg-white rounded-3xl p-6 border border-navy-900/10 shadow-trust space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-navy-900">Recent Lead Enquiries</h3>
              <button
                onClick={() => setActiveTab('leads')}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {leads.slice(0, 4).map(lead => (
                <div key={lead.id} className="p-4 bg-cream-50 rounded-2xl border border-navy-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-navy-900">{lead.buyerName} ({lead.channel})</div>
                    <div className="text-xs text-navy-700">{lead.listingTitle}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{lead.buyerPhone} · {lead.buyerEmail}</div>
                  </div>
                  <span className="px-3 py-1 bg-trust-green/10 text-trust-green font-bold text-xs rounded-full self-start sm:self-center uppercase tracking-wider">
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
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

      {/* LEADS TAB */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-3xl p-6 border border-navy-900/10 shadow-trust space-y-4">
          <h3 className="text-xl font-bold text-navy-900">Full Lead Pipeline ({leads.length})</h3>
          <div className="space-y-3">
            {leads.length > 0 ? leads.map(lead => (
              <div key={lead.id} className="p-4 bg-cream-50 rounded-2xl border border-navy-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-navy-900">{lead.buyerName}</div>
                  <div className="text-xs text-navy-700 mt-0.5">{lead.listingTitle}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{lead.buyerPhone} · {lead.channel}</div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="px-3 py-1 bg-trust-green/10 text-trust-green font-bold text-xs rounded-full uppercase tracking-wider">
                    {lead.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center p-8 text-navy-700 text-sm">
                No leads yet. Post a listing to start receiving verified enquiries.
              </div>
            )}
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
              <button className="px-5 py-3 bg-orange-500 text-white font-extrabold rounded-2xl text-sm shadow-orange-glow hover:bg-orange-600 transition-colors flex items-center gap-2 cursor-pointer">
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
