import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Phone, Mail, Globe, MapPin, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [appModalOpen, setAppModalOpen] = useState(false);
  return (
    <div>
      {/* ======================================================== */}
      {/* MAGICBRICKS REAL ESTATE NETWORK & CITY DIRECTORY (EXACT MATCH) */}
      {/* ======================================================== */}
      <section className="bg-[#F8F9FA] text-[#333333] py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: About & Apps & Social */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#1A202C] mb-1.5">About Magicbricks & TrustNest</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                TrustNest, India&apos;s leading real estate ecosystem, brings together verified buyers, individual owners, certified dealers, and legal title checks under one secure portal...{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('security')}
                  className="text-gray-900 font-bold underline hover:text-[#D92228] transition-colors cursor-pointer"
                >
                  Read more
                </button>
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs text-[#1A202C] mb-1">More from our Network</h4>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <a href="https://www.timesnownews.com" target="_blank" rel="noreferrer" className="hover:text-[#D92228] transition-colors cursor-pointer">
                  Times Now
                </a>
                <span className="text-gray-300">|</span>
                <a href="https://economictimes.indiatimes.com" target="_blank" rel="noreferrer" className="hover:text-[#D92228] transition-colors cursor-pointer">
                  ET Now
                </a>
                <span className="text-gray-300">|</span>
                <a href="https://navbharattimes.indiatimes.com" target="_blank" rel="noreferrer" className="hover:text-[#D92228] transition-colors cursor-pointer">
                  Navbharat Times
                </a>
              </div>
            </div>

            {/* App Store Download Badges & Social Icons (Exact match to screenshot) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                {/* Google Play */}
                <button
                  type="button"
                  onClick={() => setAppModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-1.442V3.256c0-.57.228-1.092.609-1.442zm11.233 11.234l2.585 2.585-11.89 6.84 9.305-9.425zm0-2.096L5.537 1.527l11.89 6.84-2.585 2.585zm1.485 1.048l3.414 1.964c.732.421.732 1.107 0 1.528l-3.414 1.964-2.37-2.37 2.37-2.37z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="text-[9px] text-gray-300 font-medium uppercase">Get it on</p>
                    <p className="text-xs font-bold font-sans">Google Play</p>
                  </div>
                </button>

                {/* App Store */}
                <button
                  type="button"
                  onClick={() => setAppModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.67-.82 1.12-1.96.99-3.1-.96.04-2.13.64-2.82 1.45-.61.71-1.15 1.87-1.01 2.98 1.07.08 2.16-.54 2.84-1.33z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="text-[9px] text-gray-300 font-medium">Available on the</p>
                    <p className="text-xs font-bold font-sans">App Store</p>
                  </div>
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-black shadow-xs hover:scale-110 transition-transform">
                  f
                </a>
                {/* X */}
                <a href="https://x.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shadow-xs hover:scale-110 transition-transform">
                  𝕏
                </a>
                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-xs font-black shadow-xs hover:scale-110 transition-transform">
                  in
                </a>
                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-[#CD201F] text-white flex items-center justify-center text-xs font-black shadow-xs hover:scale-110 transition-transform">
                  ▶
                </a>
                {/* Instagram */}
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center text-xs font-black shadow-xs hover:scale-110 transition-transform">
                  📷
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Properties in India & New Projects */}
          <div className="lg:col-span-7 space-y-5 text-xs text-gray-600">
            <div>
              <h4 className="font-bold text-xs text-[#1A202C] mb-1.5">Properties in India</h4>
              <p className="leading-relaxed">
                {[
                  'Property in New Delhi', 'Property in Mumbai', 'Property in Chennai', 'Property in Pune',
                  'Property in Noida', 'Property in Gurgaon', 'Property in Bangalore', 'Property in Ahmedabad',
                  'Property in Ghaziabad', 'Property in Kolkata', 'Property in Hyderabad'
                ].map((item, idx, arr) => (
                  <React.Fragment key={item}>
                    <a
                      href={`#search?q=${encodeURIComponent(item)}`}
                      onClick={e => {
                        e.preventDefault();
                        const city = item.replace('Property in ', '');
                        onNavigate(`search?city=${encodeURIComponent(city)}`);
                      }}
                      className="hover:text-[#D92228] transition-colors"
                    >
                      {item}
                    </a>
                    {idx < arr.length - 1 && <span className="text-gray-300 mx-1.5">|</span>}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs text-[#1A202C] mb-1.5">New Projects in India</h4>
              <p className="leading-relaxed">
                {[
                  'New Projects in New Delhi', 'New Projects in Mumbai', 'New Projects in Chennai', 'New Projects in Pune',
                  'New Projects in Noida', 'New Projects in Gurgaon', 'New Projects in Bangalore', 'New Projects in Ahmedabad',
                  'New Projects in Ghaziabad'
                ].map((item, idx, arr) => (
                  <React.Fragment key={item}>
                    <a
                      href={`#search?q=${encodeURIComponent(item)}`}
                      onClick={e => {
                        e.preventDefault();
                        const city = item.replace('New Projects in ', '');
                        onNavigate(`search?city=${encodeURIComponent(city)}&category=property`);
                      }}
                      className="hover:text-[#D92228] transition-colors"
                    >
                      {item}
                    </a>
                    {idx < arr.length - 1 && <span className="text-gray-300 mx-1.5">|</span>}
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs text-[#1A202C] mb-1.5">Property Services</h4>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="#loans"
                  onClick={e => {
                    e.preventDefault();
                    onNavigate('loans');
                  }}
                  className="hover:text-[#D92228] transition-colors cursor-pointer"
                >
                  Home Loan
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="#interiors"
                  onClick={e => {
                    e.preventDefault();
                    onNavigate('interiors');
                  }}
                  className="hover:text-[#D92228] transition-colors cursor-pointer"
                >
                  Home Interior
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="#emi-calculator"
                  onClick={e => {
                    e.preventDefault();
                    onNavigate('emi-calculator');
                  }}
                  className="hover:text-[#D92228] transition-colors cursor-pointer"
                >
                  EMI Calculator
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="#rates-trends"
                  onClick={e => {
                    e.preventDefault();
                    onNavigate('rates-trends');
                  }}
                  className="hover:text-[#D92228] transition-colors cursor-pointer"
                >
                  Rates & Trends
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="#search?category=pg"
                  onClick={e => {
                    e.preventDefault();
                    onNavigate('search?category=pg');
                  }}
                  className="hover:text-[#D92228] transition-colors cursor-pointer"
                >
                  PG / Co-Living
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="#valuation"
                  onClick={e => {
                    e.preventDefault();
                    onNavigate('valuation');
                  }}
                  className="hover:text-[#D92228] transition-colors cursor-pointer"
                >
                  Property Valuation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dark Footer */}
      <footer className="bg-navy-950 text-cream-50 pt-16 pb-28 md:pb-16 border-t border-navy-800 relative overflow-hidden">
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
              <li><a href="#security" onClick={(e) => { e.preventDefault(); onNavigate('security'); }} className="hover:text-orange-500 cursor-pointer">Identity Checks (Aadhaar/PAN)</a></li>
              <li><a href="#security" onClick={(e) => { e.preventDefault(); onNavigate('security'); }} className="hover:text-orange-500 cursor-pointer">Title Deed Review</a></li>
              <li><a href="#security" onClick={(e) => { e.preventDefault(); onNavigate('security'); }} className="hover:text-orange-500 cursor-pointer">GPS Location Audit</a></li>
              <li><a href="#security" onClick={(e) => { e.preventDefault(); onNavigate('security'); }} className="hover:text-orange-500 cursor-pointer">AI Media Originality Scan</a></li>
              <li><a href="#security" onClick={(e) => { e.preventDefault(); onNavigate('security'); }} className="hover:text-orange-500 cursor-pointer">Verification Journey</a></li>
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

    {/* ======================================================== */}
    {/* TRUSTNEST APP DOWNLOAD MODAL */}
    {/* ======================================================== */}
    {appModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative text-navy-950 text-left">
          <button
            type="button"
            onClick={() => setAppModalOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#D92228] text-white flex items-center justify-center mx-auto shadow-lg">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-black">
              Get the TrustNest Mobile App
            </h3>
            <p className="text-xs text-gray-600">
              Scan the QR code with your phone camera to download directly from Google Play or App Store.
            </p>
          </div>

          <div className="my-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center">
            {/* Real Vector QR Code */}
            <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-xs border border-gray-100 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="#111827">
                <rect x="0" y="0" width="30" height="30" fill="#000" />
                <rect x="5" y="5" width="20" height="20" fill="#fff" />
                <rect x="10" y="10" width="10" height="10" fill="#000" />

                <rect x="70" y="0" width="30" height="30" fill="#000" />
                <rect x="75" y="5" width="20" height="20" fill="#fff" />
                <rect x="80" y="10" width="10" height="10" fill="#000" />

                <rect x="0" y="70" width="30" height="30" fill="#000" />
                <rect x="5" y="75" width="20" height="20" fill="#fff" />
                <rect x="10" y="80" width="10" height="10" fill="#000" />

                <rect x="35" y="10" width="10" height="10" fill="#000" />
                <rect x="50" y="20" width="10" height="10" fill="#000" />
                <rect x="35" y="35" width="30" height="10" fill="#000" />
                <rect x="40" y="50" width="20" height="20" fill="#000" />
                <rect x="70" y="45" width="10" height="15" fill="#000" />
                <rect x="85" y="70" width="10" height="20" fill="#000" />
                <rect x="45" y="75" width="15" height="15" fill="#000" />
              </svg>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Real-time instant alerts for verified price drops</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Interactive 360° virtual tours & on-site video calls</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant digital in-principle home loan sanction</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAppModalOpen(false)}
            className="w-full mt-6 py-3 bg-[#D92228] hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    )}
  </div>
  );
};
