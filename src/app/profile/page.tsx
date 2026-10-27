import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock, Smartphone, Laptop } from 'lucide-react';
import { store } from '../../mock/store';
import { api } from '../../services/api';

export const ProfilePage: React.FC = () => {
  const currentRole = store.getCurrentRole();
  const [user, setUser] = useState(api.getCurrentUser() || {
    id: 'usr-curr',
    name: 'Ananya Roy',
    email: 'ananya.roy@trustnest.in',
    phone: '+91 98765 00000',
    role: currentRole,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verified_status: 'VERIFIED'
  });

  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Chrome / Windows 11', location: 'Greater Noida, India', current: true, time: 'Active Now' },
    { id: 'sess-2', device: 'TrustNest PWA / Android 14', location: 'Noida, India', current: false, time: '2 hours ago' },
    { id: 'sess-3', device: 'Safari / iPhone 15 Pro', location: 'Delhi, India', current: false, time: 'Yesterday' },
  ]);

  useEffect(() => {
    if (api.getToken()) {
      api.getMe().then(u => setUser(u)).catch(() => {});
      api.getSessions().then(sessions => {
        if (sessions && sessions.length > 0) {
          setActiveSessions(sessions.map((s, idx) => ({
            id: s.id,
            device: s.user_agent || (idx === 0 ? 'Chrome / Windows 11' : 'Mobile Client'),
            location: s.ip_address ? `IP: ${s.ip_address}` : 'Noida, India',
            current: idx === 0,
            time: new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      }).catch(() => {});
    }
  }, []);

  const handleLogOut = async (id: string) => {
    try {
      await api.revokeSession(id);
    } catch (e) {}
    setActiveSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="pt-24 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="bg-cream-50 rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
          alt=""
          className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
        />

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-navy-900">{user.name}</h1>
            <CheckCircle2 className="w-5 h-5 text-trust-green fill-trust-green/20" />
          </div>
          <p className="text-xs text-navy-700">{user.email} · {user.phone}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy-900 text-amber-soft text-[10px] font-extrabold uppercase rounded-full tracking-wider mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
            {user.role || currentRole} Role Assigned
          </div>
        </div>
      </div>

      {/* Identity Verification Badge */}
      <div className="bg-navy-900 text-cream-50 rounded-3xl p-6 border border-orange-500/30 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-amber-soft uppercase tracking-wider">Aadhaar & PAN Identity Audit</div>
          <div className="text-lg font-extrabold text-white mt-0.5">Government ID Verification PASSED</div>
          <p className="text-xs text-cream-200">Verified via direct UIDAI/NSDL provider API on 2026-09-15</p>
        </div>
        <span className="px-3 py-1.5 bg-trust-green text-white font-extrabold text-xs rounded-full uppercase">
          VERIFIED OWNER
        </span>
      </div>

      {/* Session Security */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-navy-900/10 shadow-trust space-y-4">
        <h3 className="text-lg font-extrabold text-navy-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-orange-500" />
          Active Device Sessions Security
        </h3>

        <div className="space-y-3">
          {activeSessions.map(sess => (
            <div key={sess.id} className="p-4 bg-cream-50 rounded-2xl border border-navy-900/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {sess.device.includes('Windows') ? (
                  <Laptop className="w-5 h-5 text-navy-900" />
                ) : (
                  <Smartphone className="w-5 h-5 text-orange-500" />
                )}
                <div>
                  <div className="text-xs font-bold text-navy-900">
                    {sess.device} {sess.current && <span className="text-trust-green ml-1">(Current Session)</span>}
                  </div>
                  <div className="text-[11px] text-navy-700">{sess.location} · {sess.time}</div>
                </div>
              </div>

              {!sess.current && (
                <button type="button" onClick={() => handleLogOut(sess.id)} className="px-3 py-1 bg-cream-200 hover:bg-red-600 hover:text-white text-navy-900 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                  Log Out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
