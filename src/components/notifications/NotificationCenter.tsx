import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Settings, MessageSquare, ShieldCheck, Tag, Info, X } from 'lucide-react';
import type { NotificationItem } from '../../types';
import { store } from '../../mock/store';

interface NotificationCenterProps {
  onNavigate?: (route: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(store.getNotifications());
  const [activeTab, setActiveTab] = useState<'ALL' | 'ENQUIRY' | 'VERIFICATION' | 'PRICE_ALERT'>('ALL');
  const containerRef = useRef<HTMLDivElement>(null);

  const [preferences, setPreferences] = useState({
    enquiriesWhatsApp: true,
    enquiriesEmail: true,
    verificationInApp: true,
    priceAlertsEmail: false,
    savedSearchAlerts: true
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(store.getNotifications());
    };
    window.addEventListener('trustnest_notifications_updated', handleUpdate);
    return () => window.removeEventListener('trustnest_notifications_updated', handleUpdate);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string) => {
    store.markNotificationRead(id);
    setNotifications(store.getNotifications());
  };

  const handleMarkAllRead = () => {
    store.markAllNotificationsRead();
    setNotifications(store.getNotifications());
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'ALL') return true;
    return n.type === activeTab;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ENQUIRY': return <MessageSquare className="w-4 h-4 text-orange-500" />;
      case 'VERIFICATION': return <ShieldCheck className="w-4 h-4 text-trust-green" />;
      case 'PRICE_ALERT': return <Tag className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2.5 rounded-full hover:bg-cream-200 text-navy-900 transition-colors cursor-pointer"
        aria-label="Notifications"
        title="Notifications Center"
      >
        <Bell className="w-5 h-5 text-navy-900" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-cream-50 rounded-3xl border border-navy-900/15 shadow-2xl z-50 text-navy-900 overflow-hidden animate-in fade-in duration-150">
          {/* Header */}
          <div className="p-4 bg-white border-b border-navy-900/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-navy-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 rounded-full text-[10px] font-extrabold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="p-1.5 hover:bg-cream-200 rounded-lg text-navy-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-orange-500" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="p-1.5 hover:bg-cream-200 rounded-lg text-navy-700 cursor-pointer"
                title="Notification Preferences"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-navy-900/10 bg-cream-100/60 px-2 text-[11px] font-bold overflow-x-auto">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'ENQUIRY', label: 'Enquiries' },
              { id: 'VERIFICATION', label: 'Verification' },
              { id: 'PRICE_ALERT', label: 'Alerts' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 font-extrabold'
                    : 'border-transparent text-navy-700 hover:text-navy-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-navy-900/5">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleMarkAsRead(item.id);
                    if (item.linkRoute && onNavigate) onNavigate(item.linkRoute);
                  }}
                  className={`p-3.5 flex items-start gap-3 hover:bg-cream-200/80 transition-colors cursor-pointer ${
                    !item.isRead ? 'bg-orange-500/5' : ''
                  }`}
                >
                  <div className="p-2 bg-white rounded-xl border border-navy-900/10 shadow-sm flex-shrink-0">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-navy-900 truncate">{item.title}</h4>
                      <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-navy-700 line-clamp-2 mt-0.5">{item.message}</p>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">
                No notifications in this category.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md">
          <div className="bg-cream-50 w-full max-w-md rounded-3xl p-6 border border-navy-900/15 shadow-2xl relative text-navy-900">
            <button
              type="button"
              onClick={() => setShowPreferences(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold text-navy-900 mb-1">
              Notification Preferences
            </h3>
            <p className="text-xs text-navy-700 mb-4">
              Configure which verified channels receive alerts for your account.
            </p>

            <div className="space-y-3 text-xs font-semibold">
              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy-900/10">
                <span>Buyer Enquiries via WhatsApp Business</span>
                <input
                  type="checkbox"
                  checked={preferences.enquiriesWhatsApp}
                  onChange={e => setPreferences(p => ({ ...p, enquiriesWhatsApp: e.target.checked }))}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy-900/10">
                <span>Instant Email Alerts for New Leads</span>
                <input
                  type="checkbox"
                  checked={preferences.enquiriesEmail}
                  onChange={e => setPreferences(p => ({ ...p, enquiriesEmail: e.target.checked }))}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy-900/10">
                <span>Property Document Verification Updates</span>
                <input
                  type="checkbox"
                  checked={preferences.verificationInApp}
                  onChange={e => setPreferences(p => ({ ...p, verificationInApp: e.target.checked }))}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy-900/10">
                <span>Saved Search New Property Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.savedSearchAlerts}
                  onChange={e => setPreferences(p => ({ ...p, savedSearchAlerts: e.target.checked }))}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => setShowPreferences(false)}
              className="mt-5 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-orange-glow transition-all cursor-pointer"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
