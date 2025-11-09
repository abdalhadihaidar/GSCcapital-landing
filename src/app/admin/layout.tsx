'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Users, 
  Menu, 
  X,
  LogOut,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTheme } from 'next-themes';
import { translations, Language } from '@/lib/translations';

const getNavigation = (t: typeof translations.en.admin) => [
  { name: t.dashboard, href: '/admin', icon: LayoutDashboard },
  { name: t.companies, href: '/admin/companies', icon: Building2 },
  { name: t.statistics, href: '/admin/statistics', icon: BarChart3 },
  { name: t.testimonials, href: '/admin/testimonials', icon: MessageSquare },
  { name: t.services, href: '/admin/services', icon: Settings },
  { name: t.messages, href: '/admin/messages', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'ar', 'zh', 'fr', 'es'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const t = translations[language].admin;
  const navigation = getNavigation(t);
  const isRTL = language === 'ar';

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated && pathname !== '/admin/auth') {
      router.push('/admin/auth');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin/auth');
  };

  // Don't render layout for auth page
  if (pathname === '/admin/auth') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="relative dark:drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] dark:drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <img 
                  src="/logo.png" 
                  alt="GSC Capital Group Logo" 
                  className="h-12 w-12 object-contain dark:filter dark:brightness-110 dark:contrast-110"
                />
                <div className="absolute inset-0 rounded-lg border-2 border-purple-500/30 blur-sm -z-10 dark:block hidden" />
              </div>
              <h2 className="text-lg font-semibold dark:text-slate-100">{t.panel}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <nav className="p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:bg-white dark:lg:bg-slate-800 lg:border-r dark:lg:border-slate-700">
        <div className="flex h-16 shrink-0 items-center px-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="relative dark:drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] dark:drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <img 
                src="/logo.png" 
                alt="GSC Capital Group Logo" 
                className="h-12 w-12 object-contain dark:filter dark:brightness-110 dark:contrast-110"
              />
              <div className="absolute inset-0 rounded-lg border-2 border-purple-500/30 blur-sm -z-10 dark:block hidden" />
            </div>
            <h2 className="text-lg font-semibold dark:text-slate-100">Admin Panel</h2>
          </div>
        </div>
        <nav className="mt-6 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white dark:bg-slate-800 dark:border-slate-700 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {t.panel}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <LanguageSwitcher currentLang={language} onLanguageChange={(lang) => { setLanguage(lang as Language); localStorage.setItem('language', lang); }} />
              <DarkModeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout} title={t.logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}