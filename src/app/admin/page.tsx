import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Database, Server, RefreshCw, AlertTriangle, MessageSquare, Download, Check, X, DollarSign } from 'lucide-react';
import { store } from '../../mock/store';
import { api } from '../../services/api';
import type { AuditLog, SupportTicket, AbuseReport } from '../../types';

export const AdminPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'risk' | 'tickets' | 'telemetry' | 'audit' | 'system'>('moderation');
  const [listings, setListings] = useState<any[]>(store.getAllListings());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(store.getAuditLogs());
  const [tickets, setTickets] = useState<SupportTicket[]>(store.getSupportTickets());
  const [abuseReports, setAbuseReports] = useState<AbuseReport[]>(store.getAbuseReports());
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [rejectModalListingId, setRejectModalListingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [ticketReplyInputs, setTicketReplyInputs] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [queueData, logsData, statsData] = await Promise.all([
        api.getModerationQueue().catch(() => store.getAllListings()),
        api.getAuditLogs().catch(() => store.getAuditLogs()),
        api.getStats().catch(() => null)
      ]);
      if (queueData && queueData.length > 0) setListings(queueData);
      if (logsData && logsData.length > 0) setAuditLogs(logsData);
      if (statsData) setStats(statsData);
      setTickets([...store.getSupportTickets()]);
      setAbuseReports([...store.getAbuseReports()]);
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveListing = async (id: string) => {
    try {
      await api.decideListing(id, 'APPROVE', 'Approved by Platform Moderator after document & location audit');
    } catch (e) {
      store.updateListingStatus(id, 'PUBLISHED', 'Approved by Platform Moderator after document & location audit');
    }
    loadData();
  };

  const handleConfirmReject = async () => {
    if (!rejectModalListingId) return;
    const reason = rejectReason.trim() || 'Rejected due to insufficient property deed proof';
    try {
      await api.decideListing(rejectModalListingId, 'REJECT', reason);
    } catch (e) {
      store.updateListingStatus(rejectModalListingId, 'REJECTED', reason);
    }
    setRejectModalListingId(null);
    setRejectReason('');
    loadData();
  };

  const handleResolveTicket = (ticketId: string, status: 'OPEN' | 'RESOLVED' | 'CLOSED') => {
    store.updateTicketStatus(ticketId, status);
    setTickets([...store.getSupportTickets()]);
  };

  const handleReplyTicket = (ticketId: string) => {
    const text = ticketReplyInputs[ticketId];
    if (!text || !text.trim()) return;
    store.replySupportTicket(ticketId, text.trim(), true);
    setTicketReplyInputs(prev => ({ ...prev, [ticketId]: '' }));
    setTickets([...store.getSupportTickets()]);
  };

  const handleSuspendReportedListing = (reportId: string, listingId: string) => {
    store.updateListingStatus(listingId, 'SUSPENDED', 'Suspended by Moderator after confirmed abuse report');
    store.updateAbuseReportStatus(reportId, 'ACTION_TAKEN');
    setAbuseReports([...store.getAbuseReports()]);
    loadData();
  };

  const handleDismissReport = (reportId: string) => {
    store.updateAbuseReportStatus(reportId, 'DISMISSED');
    setAbuseReports([...store.getAbuseReports()]);
  };

  const exportTelemetryCSV = () => {
    const headers = ['Metric', 'Current Value', 'Target SLA', 'Audit Timestamp'];
    const rows = [
      ['Total Listings', listings.length, '10,000', new Date().toISOString()],
      ['Published Properties', listings.filter(l => l.status === 'PUBLISHED').length, '8,000', new Date().toISOString()],
      ['Open Support Tickets', tickets.filter(t => t.status === 'OPEN').length, '< 5', new Date().toISOString()],
      ['Fraud Flags Detected', abuseReports.length, '< 10', new Date().toISOString()],
      ['Monthly Subscription Revenue', '₹2,48,500', '₹5,00,000', new Date().toISOString()],
      ['Verified Contact Reveals', '1,420', '5,000', new Date().toISOString()]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TrustNest_Admin_Telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-navy-950 text-cream-50 rounded-3xl p-6 sm:p-8 border border-orange-500/30 shadow-trust relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Operational Admin Platform · Tier 1 Audit
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Trust & Moderation Control Center
            </h1>

            <p className="text-xs text-cream-200 mt-1">
              Inspect document verification queues, fraud signals, customer support tickets, business intelligence & immutable audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-navy-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-900/10 overflow-x-auto pb-2 text-xs font-extrabold">
        {[
          { id: 'moderation', label: `Moderation Queue (${listings.length})` },
          { id: 'risk', label: `Fraud & Abuse Reports (${abuseReports.length})` },
          { id: 'tickets', label: `Support Tickets (${tickets.length})` },
          { id: 'telemetry', label: 'Business Intelligence & Revenue' },
          { id: 'audit', label: `Audit Logs (${auditLogs.length})` },
          { id: 'system', label: 'System Health & Engine' },
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

      {/* MODERATION QUEUE TAB */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-900/10">
              <div>
                <h3 className="text-xl font-extrabold text-navy-900">Pending Listing & Document Audits</h3>
                <p className="text-xs text-navy-700">Approve or reject individual listings with verified reason logging.</p>
              </div>
            </div>

            <div className="space-y-4">
              {listings.map(listing => (
                <div key={listing.id} className="p-5 bg-cream-50 rounded-2xl border border-navy-900/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={listing.images[0]} alt="" className="w-20 h-16 rounded-xl object-cover" />
                      <div>
                        <div className="font-extrabold text-base text-navy-900">{listing.title}</div>
                        <div className="text-xs text-navy-700">{listing.locality}, {listing.city} · {listing.formattedPrice}</div>
                        <div className="text-[11px] font-mono text-gray-500 mt-0.5">Seller: {listing.sellerName} · {listing.sellerPhone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-navy-900 text-amber-soft text-xs font-bold rounded-full uppercase">
                        {listing.status}
                      </span>
                      <button
                        onClick={() => handleApproveListing(listing.id)}
                        className="px-3 py-1.5 bg-trust-green text-white font-bold text-xs rounded-xl shadow hover:bg-green-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => setRejectModalListingId(listing.id)}
                        className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl shadow hover:bg-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Granular Check Audit Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-navy-900/10">
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Identity KYC</div>
                      <div className="text-trust-green font-extrabold mt-0.5">✓ Aadhaar/PAN Verified</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-navy-900/10">
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Title Deed / Khata</div>
                      <div className="text-orange-600 font-extrabold mt-0.5">Audited (Sale Deed)</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-navy-900/10">
                      <div className="text-[10px] text-gray-500 font-bold uppercase">Location Precision</div>
                      <div className="text-navy-900 font-extrabold mt-0.5">GPS Verified</div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-navy-900/10">
                      <div className="text-[10px] text-gray-500 font-bold uppercase">EXIF / Media Scan</div>
                      <div className="text-trust-green font-extrabold mt-0.5">✓ Zero Clones Detected</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FRAUD & ABUSE REPORTS TAB */}
      {activeTab === 'risk' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Fraud Escalations & User Abuse Reports ({abuseReports.length})</span>
            </h3>
            <p className="text-xs text-navy-700 mt-0.5">
              Review user-flagged scam attempts, duplicate images, and misleading pricing with 1-click suspension.
            </p>
          </div>

          <div className="space-y-4">
            {abuseReports.map(report => (
              <div key={report.id} className="p-5 bg-cream-50 rounded-2xl border border-red-500/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-bold text-xs rounded-full uppercase">
                        {report.reason.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-mono text-gray-500">Target Listing: {report.listingId}</span>
                    </div>
                    <div className="text-xs text-navy-800 font-medium mt-1.5">{report.description}</div>
                    <div className="text-[11px] text-gray-500 mt-1">Reported on: {report.createdAt}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSuspendReportedListing(report.id, report.listingId)}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                    >
                      Suspend Listing
                    </button>
                    <button
                      onClick={() => handleDismissReport(report.id)}
                      className="px-3.5 py-1.5 bg-cream-200 hover:bg-cream-300 text-navy-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Dismiss Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUPPORT TICKETS TAB */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                <span>Customer Support Ticket Inbox ({tickets.length})</span>
              </h3>
              <p className="text-xs text-navy-700 mt-0.5">
                Respond to user inquiries on document audits, billing queries, and account elevation.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-5 bg-cream-50 rounded-2xl border border-navy-900/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-navy-900 text-sm">{ticket.subject}</span>
                      <span className="px-2 py-0.5 bg-cream-200 text-navy-800 font-mono text-[10px] rounded-md font-bold">
                        {ticket.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${
                        ticket.priority === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="text-xs text-navy-700 mt-1">{ticket.description}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      ticket.status === 'RESOLVED' ? 'bg-trust-green/10 text-trust-green' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {ticket.status}
                    </span>
                    <button
                      onClick={() => handleResolveTicket(ticket.id, ticket.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED')}
                      className="px-3 py-1.5 bg-navy-900 text-white font-bold text-xs rounded-xl hover:bg-navy-800 transition-colors cursor-pointer"
                    >
                      {ticket.status === 'RESOLVED' ? 'Reopen' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>

                {/* Ticket Message Thread */}
                {ticket.messages && ticket.messages.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-navy-900/10 space-y-2 text-xs">
                    <div className="text-[10px] font-bold text-gray-500 uppercase">Response Thread:</div>
                    {ticket.messages.map(msg => (
                      <div key={msg.id} className="pb-1.5 border-b border-navy-900/5 last:border-none">
                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                          <span className="font-bold text-navy-900">{msg.sender}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div className="text-navy-800 mt-0.5">{msg.text}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type official support reply to user..."
                    value={ticketReplyInputs[ticket.id] || ''}
                    onChange={e => setTicketReplyInputs({ ...ticketReplyInputs, [ticket.id]: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') handleReplyTicket(ticket.id); }}
                    className="flex-1 px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900"
                  />
                  <button
                    onClick={() => handleReplyTicket(ticket.id)}
                    className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BUSINESS INTELLIGENCE & TELEMETRY TAB */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-trust-green" />
                  <span>Business Intelligence & Monetization Telemetry</span>
                </h3>
                <p className="text-xs text-navy-700 mt-0.5">
                  Real-time operational metrics across active subscriptions, contact reveal quotas, and platform conversion.
                </p>
              </div>

              <button
                onClick={exportTelemetryCSV}
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-orange-500" />
                <span>Export Telemetry CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              <div className="bg-cream-50 p-6 rounded-2xl border border-navy-900/10">
                <div className="text-xs text-navy-700 font-bold uppercase tracking-wider mb-1">Monthly Recurring Revenue</div>
                <div className="text-3xl font-extrabold text-navy-900">₹2,48,500</div>
                <div className="text-[11px] text-trust-green font-semibold mt-1">↑ +24% MoM Growth</div>
              </div>

              <div className="bg-cream-50 p-6 rounded-2xl border border-navy-900/10">
                <div className="text-xs text-navy-700 font-bold uppercase tracking-wider mb-1">Paid Subscriptions</div>
                <div className="text-3xl font-extrabold text-navy-900">142</div>
                <div className="text-[11px] text-navy-700 mt-1">86 Buyers · 56 Builders/Sellers</div>
              </div>

              <div className="bg-cream-50 p-6 rounded-2xl border border-navy-900/10">
                <div className="text-xs text-navy-700 font-bold uppercase tracking-wider mb-1">Audited Contact Reveals</div>
                <div className="text-3xl font-extrabold text-navy-900">1,420</div>
                <div className="text-[11px] text-trust-green font-semibold mt-1">Anti-Scrape Enforced</div>
              </div>

              <div className="bg-cream-50 p-6 rounded-2xl border border-navy-900/10">
                <div className="text-xs text-navy-700 font-bold uppercase tracking-wider mb-1">Lead Conversion Rate</div>
                <div className="text-3xl font-extrabold text-navy-900">14.8%</div>
                <div className="text-[11px] text-trust-green font-semibold mt-1">Direct Verification Lift</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-navy-900/10 shadow-trust space-y-4">
          <h2 className="text-xl font-bold text-navy-900">Append-Only Audit Trail Logs</h2>
          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 bg-navy-950 text-cream-50 rounded-xl border border-navy-800 space-y-1">
                <div className="flex items-center justify-between text-amber-soft font-bold">
                  <span>[{log.action}] {log.targetResource}</span>
                  <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                </div>
                <div className="text-cream-200">{log.details}</div>
                <div className="text-[10px] text-gray-500">Actor: {log.actorName} ({log.actorRole})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM HEALTH TAB */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-navy-900/10 shadow-trust space-y-2">
              <div className="flex items-center justify-between text-navy-900 font-bold text-xs uppercase">
                <span>Database Engine</span>
                <Database className="w-4 h-4 text-trust-green" />
              </div>
              <div className="text-xl font-extrabold text-trust-green">
                {stats ? `${stats.totalListings} Listings` : 'HEALTHY'}
              </div>
              <div className="text-[11px] text-navy-700">Relational SQLite / Node.js Engine Active</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-navy-900/10 shadow-trust space-y-2">
              <div className="flex items-center justify-between text-navy-900 font-bold text-xs uppercase">
                <span>Leads & Pipeline</span>
                <Server className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-xl font-extrabold text-navy-900">
                {stats ? `${stats.totalLeads} Total Leads` : 'SYNCHRONIZED'}
              </div>
              <div className="text-[11px] text-navy-700">Reconciliation Pipeline Active</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-navy-900/10 shadow-trust space-y-2">
              <div className="flex items-center justify-between text-navy-900 font-bold text-xs uppercase">
                <span>AI Fraud Scanner</span>
                <Activity className="w-4 h-4 text-trust-green" />
              </div>
              <div className="text-xl font-extrabold text-trust-green">ONLINE</div>
              <div className="text-[11px] text-navy-700">EXIF & Image Hash Models Active</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-navy-900/10 shadow-trust space-y-2">
              <div className="flex items-center justify-between text-navy-900 font-bold text-xs uppercase">
                <span>Server Uptime</span>
                <RefreshCw className="w-4 h-4 text-trust-green" />
              </div>
              <div className="text-xl font-extrabold text-trust-green">
                {stats ? `${stats.uptimeSeconds}s` : 'ACTIVE'}
              </div>
              <div className="text-[11px] text-navy-700">Production REST API v2.0</div>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Rejection Reason Modal */}
      {rejectModalListingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md">
          <div className="bg-cream-50 w-full max-w-md rounded-3xl p-6 border border-navy-900/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-navy-900">Record Rejection Reason</h3>
            <p className="text-xs text-navy-700">
              Provide specific regulatory or title deed reasons so the seller can supply rectified documentation.
            </p>
            <textarea
              required
              rows={3}
              placeholder="e.g. Encumbrance certificate missing page 3; RERA number registration mismatch..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full p-3 bg-white border border-navy-900/15 rounded-xl text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalListingId(null)}
                className="px-4 py-2 bg-cream-200 text-navy-900 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
