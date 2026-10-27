import React from 'react';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate
}) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home, route: 'home', href: '#home' },
    { id: 'search', label: 'Explore', icon: Compass, route: 'search', href: '#search' },
    { id: 'post', label: 'Sell', icon: Plus, route: 'post', href: '#post', isSell: true },
    { id: 'messages', label: 'Messages', icon: MessageSquare, route: 'messages', href: '#messages' },
    { id: 'profile', label: 'Profile', icon: User, route: 'profile', href: '#profile' },
  ];

  const handleLinkClick = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onNavigate(route);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur-md border-t border-navy-900/10 px-4 py-2 flex items-center justify-around shadow-lg">
      {items.map(item => {
        const Icon = item.icon;
        const isActive =
          currentRoute === item.route ||
          (item.route === 'search' && currentRoute.startsWith('search')) ||
          (item.route === 'home' && currentRoute === 'home');

        if (item.isSell) {
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.route)}
              className="relative -top-5 flex flex-col items-center justify-center group cursor-pointer"
              aria-label={item.label}
            >
              <div className="w-13 h-13 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-orange-glow border-4 border-cream-100 transform group-active:scale-95 transition-transform">
                <Plus className="w-7 h-7 stroke-[3]" />
              </div>
              <span className="text-[10px] font-bold text-navy-900 mt-1 uppercase tracking-wider">
                Post Listing
              </span>
            </a>
          );
        }

        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => handleLinkClick(e, item.route)}
            className={`flex flex-col items-center justify-center py-1 px-3 text-xs transition-colors cursor-pointer ${
              isActive ? 'text-orange-500 font-bold' : 'text-navy-700 hover:text-navy-900 font-medium'
            }`}
            aria-label={item.label}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] mt-1">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

