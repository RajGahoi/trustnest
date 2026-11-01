import React, { useState } from 'react';
import { X, Send, CheckCircle2, LifeBuoy } from 'lucide-react';
import { store } from '../../mock/store';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<'LOGIN' | 'PAYMENT' | 'LISTING' | 'VERIFICATION' | 'FRAUD_REPORT' | 'SUBSCRIPTION' | 'GENERAL'>('VERIFICATION');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    store.createSupportTicket({
      userId: 'usr-current',
      userName: userEmail.split('@')[0] || 'Verified Member',
      userEmail: userEmail || 'member@trustnest.in',
      category,
      priority,
      subject,
      description
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-md">
      <div className="bg-cream-50 w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-navy-900/15 shadow-2xl relative text-navy-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-orange-500 uppercase tracking-wider mb-1">
          <LifeBuoy className="w-4 h-4" />
          TrustNest Customer Support
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 mb-2">
          Raise a Verified Support Ticket
        </h3>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-trust-green mx-auto" />
            <h4 className="font-extrabold text-lg text-navy-900">Ticket Submitted Successfully</h4>
            <p className="text-xs text-navy-700">
              Our operations team has received your ticket. You will receive email responses and can track status in your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-navy-800 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="VERIFICATION">Property Verification & Documents</option>
                  <option value="LISTING">Listing Submission & Expiry</option>
                  <option value="PAYMENT">Payments & GST Invoices</option>
                  <option value="SUBSCRIPTION">Contact Passes & Subscriptions</option>
                  <option value="FRAUD_REPORT">Fraud / Suspicious Activity</option>
                  <option value="LOGIN">Account & Login Access</option>
                  <option value="GENERAL">General Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-navy-800 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl font-bold text-navy-900 focus:outline-none"
                >
                  <option value="LOW">Low - General query</option>
                  <option value="MEDIUM">Medium - Normal workflow</option>
                  <option value="HIGH">High - Urgent transaction</option>
                  <option value="URGENT">Urgent - Security or Fraud flag</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-navy-800 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Issue uploading title deed for Sector 62 listing"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-navy-800 mb-1">Detailed Description</label>
              <textarea
                required
                rows={4}
                placeholder="Please describe your issue in detail, including listing ID or transaction reference if applicable..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-normal"
              />
            </div>

            <div>
              <label className="block text-navy-800 mb-1">Your Registered Email</label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-navy-900/15 rounded-xl text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-cream-200 hover:bg-cream-300 text-navy-900 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-extrabold shadow-orange-glow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
