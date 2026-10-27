import React from 'react';
import { ShieldCheck, ArrowRight, Phone, Mail, Globe, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-navy-950 text-cream-50 pt-20 pb-28 md:pb-16 border-t border-navy-800 relative overflow-hidden">
      {/* Background organic curved shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-soft/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Dark Cinematic CTA Section */}
        <div className="bg-navy-900 border border-orange-500/30 rounded-3xl p-8 md:p-14 mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h2 className="display-section text-white mb-5" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 4rem)' }}>
                Buy and sell with people <br />
                whose papers were checked.
              </h2>

              <p className="text-cream-200 text-sm md:text-base max-w-xl leading-relaxed">
                Every listing is verified before it goes live — ownership, documents, location, and identity. Zero fake agents, zero manipulated photos.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={() => onNavigate('search')}
                className="w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-center shadow-orange-glow flex items-center justify-center gap-2 group transition-all cursor-pointer"
              >
                <span>Explore Verified Listings</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('post')}
                className="w-full py-4 px-6 bg-navy-800 hover:bg-navy-700 text-cream-50 border border-cream-50/20 font-bold rounded-2xl text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Post Your Verified Listing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="font-display text-3xl font-semibold text-white">TrustNest</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed max-w-sm">
              The serious, production-grade classified marketplace platform built around multi-dimensional verification scores, verified owner checks, and AI fraud prevention.
            </p>

            <div className="space-y-2 text-xs text-cream-200 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+91-96255-53198</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>hello@trustnest.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-500" />
                <span>www.trustnest.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Sector 62, Noida & BKC, Mumbai</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><a href="#category/property" onClick={(e) => { e.preventDefault(); onNavigate('category-property'); }} className="hover:text-orange-500 cursor-pointer">Real Estate & Villas</a></li>
              <li><a href="#category/vehicles" onClick={(e) => { e.preventDefault(); onNavigate('category-vehicles'); }} className="hover:text-orange-500 cursor-pointer">Vehicles & Luxury Cars</a></li>
              <li><a href="#category/mobiles" onClick={(e) => { e.preventDefault(); onNavigate('category-mobiles'); }} className="hover:text-orange-500 cursor-pointer">Mobiles & Tablets</a></li>
              <li><a href="#category/electronics" onClick={(e) => { e.preventDefault(); onNavigate('category-electronics'); }} className="hover:text-orange-500 cursor-pointer">Electronics & MacBooks</a></li>
              <li><a href="#category/furniture" onClick={(e) => { e.preventDefault(); onNavigate('category-furniture'); }} className="hover:text-orange-500 cursor-pointer">Furniture & Decor</a></li>
              <li><a href="#category/jobs" onClick={(e) => { e.preventDefault(); onNavigate('category-jobs'); }} className="hover:text-orange-500 cursor-pointer">Jobs & Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Verification</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-orange-500 cursor-pointer">Identity Checks (Aadhaar/PAN)</a></li>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-orange-500 cursor-pointer">Title Deed Review</a></li>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-orange-500 cursor-pointer">GPS Location Audit</a></li>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-orange-500 cursor-pointer">AI Media Originality Scan</a></li>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-orange-500 cursor-pointer">Verification Journey</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Portals & Security</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><a href="#vendor-dashboard" onClick={(e) => { e.preventDefault(); onNavigate('vendor-dashboard'); }} className="hover:text-orange-500 cursor-pointer">Vendor Operating System</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} className="hover:text-orange-500 cursor-pointer">Admin Moderation Queue</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} className="hover:text-orange-500 cursor-pointer">Risk Signal Engine</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} className="hover:text-orange-500 cursor-pointer">Audit Trail Logs</a></li>
              <li><a href="#post" onClick={(e) => { e.preventDefault(); onNavigate('post'); }} className="hover:text-orange-500 cursor-pointer">Post Verified Listing</a></li>
            </ul>
          </div>
        </div>

        <div className="font-display font-semibold text-cream-50/[0.06] leading-none select-none text-center pt-10 -mb-4" style={{ fontSize: 'clamp(4rem, 17vw, 15rem)', letterSpacing: '-0.05em' }} aria-hidden>
          TrustNest
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            © 2026 TrustNest Platform Inc. All rights reserved. Beyond Listings. Beyond Doubt.
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-white cursor-pointer">Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-white cursor-pointer">Terms of Verification</a>
            <a href="#security" onClick={(e) => { e.preventDefault(); onNavigate('security'); }} className="hover:text-white cursor-pointer">Security Architecture</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
