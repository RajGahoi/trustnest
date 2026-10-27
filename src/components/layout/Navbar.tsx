import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Heart, PlusCircle, UserCheck, Menu, X, MessageSquare, Briefcase, Settings, CheckCircle2, UserPlus, KeyRound } from 'lucide-react';
import { store } from '../../mock/store';
import { api } from '../../services/api';
import type { UserRole } from '../../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onNavigate,
  currentRoute
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'personas' | 'login' | 'register'>('personas');
  const [currentRole, setCurrentRole] = useState<UserRole>(store.getCurrentRole());
  const [authUser, setAuthUser] = useState(api.getCurrentUser());
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('USER');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const favCount = store.getFavoritesList().length;

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY && y > 240);
      lastY = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // If we have a token, sync profile with backend
    if (api.getToken()) {
      api.getMe().then(user => {
        setAuthUser(user);
        setCurrentRole(user.role as UserRole);
        store.setRole(user.role as UserRole);
      }).catch(() => {
        // Fallback gracefully
      });
    }
  }, []);

  const handleRoleChange = async (newRole: UserRole) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const roleEmailMap: Record<string, string> = {
        ADMIN: 'admin@trustnest.in',
        MODERATOR: 'moderator@trustnest.in',
        SELLER: 'seller@trustnest.in',
        VENDOR_ADMIN: 'vendor@trustnest.in',
        USER: 'buyer@trustnest.in'
      };

      const targetEmail = roleEmailMap[newRole] || 'buyer@trustnest.in';
      const result = await api.login(targetEmail, 'TrustNest@2026');
      setAuthUser(result.user);
      store.setRole(newRole);
      setCurrentRole(newRole);
      setRoleModalOpen(false);
    } catch (err: any) {
      // If server unreachable, fallback to local store change
      store.setRole(newRole);
      setCurrentRole(newRole);
      setRoleModalOpen(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const result = await api.login(loginEmail, loginPassword);
      setAuthUser(result.user);
      setCurrentRole(result.user.role as UserRole);
      store.setRole(result.user.role as UserRole);
      setRoleModalOpen(false);
    } catch (err: any) {
      // Fallback for custom or real emails in demo/offline mode
      const roleMap: Record<string, UserRole> = {
        'admin@trustnest.in': 'ADMIN',
        'moderator@trustnest.in': 'MODERATOR',
        'seller@trustnest.in': 'SELLER',
        'vendor@trustnest.in': 'VENDOR_ADMIN',
        'buyer@trustnest.in': 'USER'
      };
      const assignedRole = roleMap[loginEmail.toLowerCase()] || currentRole || 'USER';
      const customUser = {
        id: `usr-${Date.now()}`,
        name: loginEmail.split('@')[0].replace(/[._]/g, ' '),
        email: loginEmail,
        phone: '+91 98765 43210',
        role: assignedRole,
        verified_status: 'VERIFIED'
      };
      api.setSession(`demo_jwt_${Date.now()}`, customUser);
      setAuthUser(customUser);
      setCurrentRole(assignedRole);
      store.setRole(assignedRole);
      setRoleModalOpen(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const result = await api.register({
        name: registerName || registerEmail.split('@')[0],
        email: registerEmail,
        phone: registerPhone || '+91 98765 43210',
        password: registerPassword,
        role: registerRole
      });
      setAuthUser(result.user);
      setCurrentRole(result.user.role as UserRole);
      store.setRole(result.user.role as UserRole);
      setRoleModalOpen(false);
    } catch (err: any) {
      // Offline / demo fallback for registering real email
      const customUser = {
        id: `usr-${Date.now()}`,
        name: registerName || registerEmail.split('@')[0],
        email: registerEmail,
        phone: registerPhone || '+91 98765 43210',
        role: registerRole,
        verified_status: 'VERIFIED'
      };
      api.setSession(`demo_jwt_${Date.now()}`, customUser);
      setAuthUser(customUser);
      setCurrentRole(registerRole);
      store.setRole(registerRole);
      setRoleModalOpen(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setAuthUser(null);
    store.setRole('USER');
    setCurrentRole('USER');
    setRoleModalOpen(false);
  };

  const navLinks = [
    { label: 'Explore', route: 'search', href: '#search', category: 'all' },
    { label: 'Real Estate', route: 'category-property', href: '#category/property', category: 'property' },
    { label: 'Vehicles', route: 'category-vehicles', href: '#category/vehicles', category: 'vehicles' },
    { label: 'Mobiles', route: 'category-mobiles', href: '#category/mobiles', category: 'mobiles' },
    { label: 'Jobs', route: 'category-jobs', href: '#category/jobs', category: 'jobs' },
  ];

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.category === 'all') {
      return currentRoute === 'search' || currentRoute === 'search?category=all' || currentRoute === '#search';
    }
    return (
      currentRoute === link.route ||
      currentRoute === `category/${link.category}` ||
      currentRoute.includes(`category=${link.category}`)
    );
  };

  const handleLinkClick = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(route);
    }
  };

  return (
    <>
      <header
        style={{ transform: hidden ? 'translateY(-110%)' : 'translateY(0)', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), padding 0.3s, background 0.3s' }}
        className={`fixed top-0 left-0 right-0 z-40 ${
          scrolled ? 'glass-nav py-3 border-b border-navy-900/10 shadow-sm' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, 'home')}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-navy-900 flex items-center justify-center text-orange-500 shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display text-2xl font-semibold text-navy-900 flex items-center gap-1 leading-none">
                TrustNest
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block animate-pulse" />
              </span>
              <span className="text-xs text-navy-700 block mt-1">
                Verified before promoted
              </span>
            </div>
          </a>

          {/* Desktop Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/80 border border-navy-900/15 rounded-full shadow-sm text-navy-700 hover:border-orange-500 hover:bg-white transition-all w-72 text-sm cursor-pointer"
          >
            <Search className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-navy-700/70 truncate">Search verified properties, cars, items...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-cream-200 text-navy-900 rounded border border-navy-900/10 ml-auto">
              ⌘K
            </kbd>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-navy-900">
            {navLinks.map(link => {
              const active = isLinkActive(link);
              return (
                <a
                  key={link.route}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.route)}
                  className={`relative px-3.5 py-1.5 rounded-full cursor-pointer transition-colors ${
                    active ? 'text-navy-950 font-bold' : 'hover:text-orange-600'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-amber-soft/80 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Messages Icon */}
            <a
              href="#messages"
              onClick={(e) => handleLinkClick(e, 'messages')}
              className={`relative p-2.5 rounded-full hover:bg-cream-200 text-navy-900 transition-colors cursor-pointer ${
                currentRoute === 'messages' ? 'bg-orange-500/15 text-orange-500 ring-2 ring-orange-500/30' : ''
              }`}
              aria-label="Messages"
              title="Messages"
            >
              <MessageSquare className={`w-5 h-5 ${currentRoute === 'messages' ? 'text-orange-500' : 'text-navy-900'}`} />
            </a>

            {/* Profile Icon */}
            <a
              href="#profile"
              onClick={(e) => handleLinkClick(e, 'profile')}
              className={`hidden sm:flex relative p-2.5 rounded-full hover:bg-cream-200 text-navy-900 transition-colors cursor-pointer ${
                currentRoute === 'profile' ? 'bg-orange-500/15 text-orange-500 ring-2 ring-orange-500/30' : ''
              }`}
              aria-label="Profile"
              title="User Profile"
            >
              <UserCheck className={`w-5 h-5 ${currentRoute === 'profile' ? 'text-orange-500' : 'text-navy-900'}`} />
            </a>

            {/* Favorites Icon */}
            <a
              href="#favorites"
              onClick={(e) => handleLinkClick(e, 'favorites')}
              className={`relative p-2.5 rounded-full hover:bg-cream-200 text-navy-900 transition-colors cursor-pointer ${
                currentRoute === 'favorites' ? 'bg-orange-500/15 text-orange-500 ring-2 ring-orange-500/30' : ''
              }`}
              aria-label="Favorites"
              title="View Saved Favorites"
            >
              <Heart className={`w-5 h-5 ${currentRoute === 'favorites' ? 'fill-orange-500 text-orange-500' : 'text-navy-900'}`} />
              {favCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {favCount}
                </span>
              )}
            </a>

            {/* Role Switcher Pills */}
            <button
              type="button"
              onClick={() => setRoleModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cream-200 text-navy-900 border border-navy-900/15 rounded-full text-xs font-bold hover:bg-cream-300 transition-colors cursor-pointer"
              title="Switch demo authorization role"
            >
              <UserCheck className="w-3.5 h-3.5 text-orange-500" />
              <span className="capitalize">{currentRole.toLowerCase().replace(/_/g, ' ')}</span>
            </button>

            {/* Post Listing CTA */}
            <a
              href="#post"
              onClick={(e) => handleLinkClick(e, 'post')}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white font-bold rounded-full text-sm shadow-orange-glow hover:bg-orange-600 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Post Listing</span>
              <span className="sm:hidden">Sell</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-navy-900 hover:bg-cream-200"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-cream-50 border-b border-navy-900/10 p-4 space-y-3 animate-fadeIn shadow-lg absolute top-0 left-0 right-0 z-50">
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-navy-900 hover:bg-cream-200 cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-navy-900/15 rounded-2xl text-navy-700 text-sm cursor-pointer"
            >
              <Search className="w-4 h-4 text-orange-500" />
              <span>Search listings, categories, locations...</span>
            </button>

            {/* Category Nav Links for Mobile Drawer */}
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-navy-900 pt-1">
              {navLinks.map(link => (
                <a
                  key={link.route}
                  href={link.href}
                  onClick={(e) => { handleLinkClick(e, link.route); setMobileMenuOpen(false); }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                    isLinkActive(link)
                      ? 'bg-navy-900 text-white border-orange-500 font-bold'
                      : 'bg-white border-navy-900/10 hover:border-orange-500'
                  }`}
                >
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-navy-900 pt-2 border-t border-navy-900/10">
              <a
                href="#vendor-dashboard"
                onClick={(e) => { handleLinkClick(e, 'vendor-dashboard'); setMobileMenuOpen(false); }}
                className="p-3 bg-white rounded-xl border border-navy-900/10 text-left flex items-center justify-between cursor-pointer hover:border-orange-500"
              >
                <span>Vendor OS</span>
                <Briefcase className="w-4 h-4 text-orange-500" />
              </a>
              <a
                href="#admin"
                onClick={(e) => { handleLinkClick(e, 'admin'); setMobileMenuOpen(false); }}
                className="p-3 bg-white rounded-xl border border-navy-900/10 text-left flex items-center justify-between cursor-pointer hover:border-orange-500"
              >
                <span>Admin Portal</span>
                <Settings className="w-4 h-4 text-orange-500" />
              </a>
              <a
                href="#messages"
                onClick={(e) => { handleLinkClick(e, 'messages'); setMobileMenuOpen(false); }}
                className="p-3 bg-white rounded-xl border border-navy-900/10 text-left flex items-center justify-between cursor-pointer hover:border-orange-500"
              >
                <span>Messages</span>
                <MessageSquare className="w-4 h-4 text-orange-500" />
              </a>
              <a
                href="#profile"
                onClick={(e) => { handleLinkClick(e, 'profile'); setMobileMenuOpen(false); }}
                className="p-3 bg-white rounded-xl border border-navy-900/10 text-left flex items-center justify-between cursor-pointer hover:border-orange-500"
              >
                <span>Profile</span>
                <UserCheck className="w-4 h-4 text-orange-500" />
              </a>
              <a
                href="#favorites"
                onClick={(e) => { handleLinkClick(e, 'favorites'); setMobileMenuOpen(false); }}
                className="p-3 bg-white rounded-xl border border-navy-900/10 text-left flex items-center justify-between cursor-pointer hover:border-orange-500"
              >
                <span>Favorites ({favCount})</span>
                <Heart className="w-4 h-4 text-orange-500 fill-orange-500" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Authentication & Role Switcher Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md">
          <div className="bg-cream-50 w-full max-w-lg rounded-3xl p-6 border border-navy-900/10 shadow-trust relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setRoleModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 text-navy-900 cursor-pointer"
              aria-label="Close Authentication Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              Verified Access & Authentication
            </div>

            <h3 className="text-xl font-extrabold text-navy-900 mb-2">
              Account & Role Session
            </h3>

            {authUser ? (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-navy-900/10 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-500">Currently Logged In As:</div>
                  <div className="font-extrabold text-navy-900 text-base">{authUser.name}</div>
                  <div className="text-xs text-navy-700">{authUser.email} · <span className="font-bold text-orange-500 uppercase">{authUser.role}</span></div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 bg-cream-200 hover:bg-red-600 hover:text-white text-navy-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="mb-6 p-3 bg-amber-soft/30 rounded-2xl border border-orange-500/20 text-xs text-navy-800">
                You are currently browsing as a guest session. Sign in below or switch to an authenticated test persona.
              </div>
            )}

            {/* Tab Selection */}
            <div className="flex items-center gap-1.5 p-1 bg-cream-200 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => { setAuthTab('personas'); setAuthError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authTab === 'personas'
                    ? 'bg-navy-900 text-white shadow'
                    : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Demo Personas</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authTab === 'login'
                    ? 'bg-navy-900 text-white shadow'
                    : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setAuthError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authTab === 'register'
                    ? 'bg-navy-900 text-white shadow'
                    : 'text-navy-700 hover:text-navy-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Free</span>
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl font-medium">
                {authError}
              </div>
            )}

            {/* Tab 1: 1-Click Personas */}
            {authTab === 'personas' && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  Select a Pre-Seeded Authenticated Role:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { role: 'USER', label: 'Verified Buyer', email: 'buyer@trustnest.in', desc: 'Browse, save, contact sellers & chat' },
                    { role: 'SELLER', label: 'Individual Seller', email: 'seller@trustnest.in', desc: 'Post listings & manage enquiries' },
                    { role: 'VENDOR_ADMIN', label: 'Vendor Admin', email: 'vendor@trustnest.in', desc: 'Manage team, subscriptions & leads' },
                    { role: 'MODERATOR', label: 'Trust Moderator', email: 'moderator@trustnest.in', desc: 'Approve listings & inspect fraud signals' },
                    { role: 'ADMIN', label: 'Platform Admin', email: 'admin@trustnest.in', desc: 'System health, schema & audit logs' },
                  ].map(item => (
                    <button
                      key={item.role}
                      type="button"
                      disabled={authLoading}
                      onClick={() => handleRoleChange(item.role as UserRole)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        currentRole === item.role
                          ? 'bg-navy-900 text-cream-50 border-orange-500 shadow-md ring-2 ring-orange-500/30'
                          : 'bg-white border-navy-900/10 hover:border-navy-900/30 text-navy-900'
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center justify-between">
                        <span>{item.label}</span>
                        {currentRole === item.role && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5">{item.email}</div>
                      <div className={`text-xs mt-1 ${currentRole === item.role ? 'text-gray-300' : 'text-navy-700'}`}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Sign In (Any Email) */}
            {authTab === 'login' && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  Log in with your email & password:
                </div>

                <form onSubmit={handleManualLogin} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-navy-800 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com or admin@trustnest.in"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-navy-800 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Your password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-orange-glow transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {authLoading ? 'Signing In...' : 'Sign In with Email'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: Register Free (Real Email) */}
            {authTab === 'register' && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  Create a new account with your real email:
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-navy-800 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Raj Gahoi"
                        value={registerName}
                        onChange={e => setRegisterName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-navy-800 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={registerPhone}
                        onChange={e => setRegisterPhone(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-navy-800 mb-1">Real Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. raj@gmail.com"
                      value={registerEmail}
                      onChange={e => setRegisterEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-navy-800 mb-1">Account Role</label>
                      <select
                        value={registerRole}
                        onChange={e => setRegisterRole(e.target.value as UserRole)}
                        className="w-full px-3.5 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="USER">Verified Buyer</option>
                        <option value="SELLER">Verified Seller</option>
                        <option value="VENDOR_ADMIN">Vendor Agency / Dealership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-navy-800 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Choose a password"
                        value={registerPassword}
                        onChange={e => setRegisterPassword(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-navy-900/15 rounded-xl text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-orange-glow transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{authLoading ? 'Creating Account...' : 'Register & Start Browsing'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
