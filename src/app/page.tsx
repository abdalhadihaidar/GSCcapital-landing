'use client';

import { useState, useEffect } from 'react';
import { Building2, Home, Laptop, TrendingUp, Users, Search, Menu, X, Globe, Phone, Mail, MapPin, ArrowRight, CheckCircle, Star, BarChart3, Lightbulb, Shield, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
// Logo components removed - using logo.png from public folder
import { AnimatedGradientBg } from '@/components/animated-gradient-bg';
import { AnimatedGradientBgDark } from '@/components/animated-gradient-bg-dark';
import { FloatingElements } from '@/components/floating-elements';
import { FloatingElementsDark } from '@/components/floating-elements-dark';
import { EnhancedCard } from '@/components/enhanced-card';
import { EnhancedCardDark } from '@/components/enhanced-card-dark';
import { HeroSection } from '@/components/hero-section';
import { HeroSectionDark } from '@/components/hero-section-dark';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTheme } from 'next-themes';
import { optimizeStatisticImage, optimizeServiceImage } from '@/lib/cloudinary';
import { translations, Language } from '@/lib/translations';

// Icon mapping
const iconMap: { [key: string]: any } = {
  Home,
  Building2,
  Laptop,
  TrendingUp,
  Users,
  Settings,
  Search,
  Shield,
  BarChart3,
  Lightbulb,
  Zap,
  Globe,
  Phone,
  Mail,
  MapPin
};

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  color?: string;
  isActive: boolean;
  order: number;
  features: { id: string; title: string; order: number }[];
  services: { id: string; title: string; description?: string; order: number }[];
}

interface Statistic {
  id: string;
  label: string;
  value: string;
  icon?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

interface Testimonial {
  id: string;
  name: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  isActive: boolean;
  order: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

export default function EnhancedHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'ar', 'zh', 'fr', 'es'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const t = translations[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    fetchData();
    
    // Handle scroll to update active section
    const handleScroll = () => {
      const sections = ['home', 'companies', 'services', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const [companiesRes, statisticsRes, testimonialsRes, servicesRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/statistics'),
        fetch('/api/testimonials'),
        fetch('/api/services')
      ]);

      const companiesData = await companiesRes.json();
      const statisticsData = await statisticsRes.json();
      const testimonialsData = await testimonialsRes.json();
      const servicesData = await servicesRes.json();

      setCompanies(companiesData);
      setStatistics(statisticsData);
      setTestimonials(testimonialsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        toast.success(t.contact.success);
        setContactForm({ name: '', email: '', company: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error(t.contact.error);
    }
  };

  const getIconComponent = (iconName?: string) => {
    return iconMap[iconName || 'Home'] || Home;
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{language === 'ar' ? 'جاري التحميل...' : language === 'zh' ? '加载中...' : language === 'fr' ? 'Chargement...' : language === 'es' ? 'Cargando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {isDark ? <AnimatedGradientBgDark /> : <AnimatedGradientBg />}
      {isDark ? <FloatingElementsDark /> : <FloatingElements />}
      
      <div className={`relative z-10 ${isDark ? 'bg-gradient-to-br from-slate-900/90 to-slate-800/90' : 'bg-gradient-to-br from-slate-50/90 to-slate-100/90'} backdrop-blur-sm`}>
        {/* Navigation Header */}
        <header className={`fixed top-0 w-full ${isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-200'} backdrop-blur-sm border-b z-50`}>
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className={`relative ${isDark ? 'drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]' : ''}`}>
                  <img 
                    src="/logo.png" 
                    alt="GSC Capital Group Logo" 
                    className={`h-12 w-12 sm:h-14 sm:w-14 object-contain ${isDark ? 'filter brightness-110 contrast-110' : ''}`}
                  />
                  {isDark && (
                    <div className="absolute inset-0 rounded-lg border-2 border-purple-500/30 blur-sm -z-10" />
                  )}
                </div>
                <span className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} hidden sm:block`}>GSC Capital Group</span>
                <span className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} sm:hidden`}>GSC</span>
              </div>

              {/* Desktop Navigation */}
              <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse' : 'space-x-6'} lg:space-x-8`}>
                {[
                  { key: 'home', label: t.nav.home },
                  { key: 'companies', label: t.nav.companies },
                  { key: 'services', label: t.nav.services },
                  { key: 'about', label: t.nav.about },
                  { key: 'contact', label: t.nav.contact },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.key)}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      activeSection === item.key ? 'text-blue-600' : isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <LanguageSwitcher currentLang={language} onLanguageChange={(lang) => { setLanguage(lang as Language); localStorage.setItem('language', lang); }} />
                <DarkModeToggle />
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm px-4 py-2"
                >
                  {t.hero.getStarted}
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className={`md:hidden py-4 ${isDark ? 'border-slate-700' : 'border-slate-200'} border-t`}>
                {[
                  { key: 'home', label: t.nav.home },
                  { key: 'companies', label: t.nav.companies },
                  { key: 'services', label: t.nav.services },
                  { key: 'about', label: t.nav.about },
                  { key: 'contact', label: t.nav.contact },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      scrollToSection(item.key);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full ${isRTL ? 'text-right' : 'text-left'} py-2 px-4 text-sm font-medium transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} ${
                      activeSection === item.key ? 'text-blue-600 bg-slate-50 dark:bg-slate-700' : isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="px-4 py-2">
                  <LanguageSwitcher currentLang={language} onLanguageChange={(lang) => { setLanguage(lang as Language); localStorage.setItem('language', lang); }} />
                </div>
                <div className="px-4 py-2">
                  <DarkModeToggle />
                </div>
                <div className="px-4 py-2">
                  <Button 
                    onClick={() => {
                      scrollToSection('contact');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {t.hero.getStarted}
                  </Button>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Section */}
        <div id="home">
          {isDark ? <HeroSectionDark locale={language} /> : <HeroSection locale={language} />}
        </div>

        {/* Stats Section */}
        {statistics.length > 0 && (
          <section className={`py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="container mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {statistics.map((stat, index) => {
                  const IconComponent = getIconComponent(stat.icon);
                  return (
                    <div key={stat.id} className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                        {stat.imageUrl ? (
                          <img 
                            src={optimizeStatisticImage(stat.imageUrl)} 
                            alt={stat.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <IconComponent className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className={`text-2xl lg:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Companies Section */}
        {companies.length > 0 && (
          <section id="companies" className={`py-12 lg:py-16 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Our Specialized Companies
                </h2>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Each company brings unique expertise, creating a powerful ecosystem of services
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {companies.map((company) => {
                  const IconComponent = getIconComponent(company.icon);
                  return (
                    isDark ? (
                      <EnhancedCardDark
                        key={company.id}
                        title={company.name}
                        description={company.description}
                        features={company.features.slice(0, 4).map(f => f.title)}
                        icon={!company.imageUrl ? <IconComponent className="w-8 h-8 text-white" /> : undefined}
                        imageUrl={company.imageUrl}
                        color={company.color || 'from-blue-600 to-purple-600'}
                        onLearnMore={() => scrollToSection('contact')}
                      />
                    ) : (
                      <EnhancedCard
                        key={company.id}
                        title={company.name}
                        description={company.description}
                        features={company.features.slice(0, 4).map(f => f.title)}
                        icon={!company.imageUrl ? <IconComponent className="w-8 h-8 text-white" /> : undefined}
                        imageUrl={company.imageUrl}
                        color={company.color || 'from-blue-600 to-purple-600'}
                        onLearnMore={() => scrollToSection('contact')}
                      />
                    )
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Services Overview */}
        {services.length > 0 && (
          <section id="services" className={`py-12 lg:py-16 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.services.title}
                </h2>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t.services.description}
                </p>
              </div>

              <Tabs defaultValue="all" className="max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
                  <TabsTrigger value="all" className="text-xs lg:text-sm">{t.services.all}</TabsTrigger>
                  <TabsTrigger value="property" className="text-xs lg:text-sm">{t.services.property}</TabsTrigger>
                  <TabsTrigger value="tech" className="text-xs lg:text-sm">{t.services.tech}</TabsTrigger>
                  <TabsTrigger value="business" className="text-xs lg:text-sm">{t.services.business}</TabsTrigger>
                  <TabsTrigger value="finance" className="text-xs lg:text-sm">{t.services.finance}</TabsTrigger>
                  <TabsTrigger value="consulting" className="text-xs lg:text-sm">{t.services.consulting}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service) => {
                      const IconComponent = getIconComponent(service.icon);
                      return (
                        <div 
                          key={service.id} 
                          className={`flex items-start space-x-4 p-4 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                          onClick={() => scrollToSection('contact')}
                        >
                          <div className={`w-10 h-10 ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                            {service.imageUrl ? (
                              <img 
                                src={optimizeServiceImage(service.imageUrl)} 
                                alt={service.title} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <IconComponent className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-semibold mb-2 hover:text-blue-600 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
                            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{service.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                {['property', 'tech', 'business', 'finance', 'consulting'].map((category) => (
                  <TabsContent key={category} value={category} className="mt-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      {services
                        .filter((service) => service.category === category)
                        .map((service) => {
                          const IconComponent = getIconComponent(service.icon);
                          return (
                            <div 
                              key={service.id} 
                              className={`flex items-start space-x-4 p-4 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                              onClick={() => scrollToSection('contact')}
                            >
                              <div className={`w-10 h-10 ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                                {service.imageUrl ? (
                                  <img 
                                    src={optimizeServiceImage(service.imageUrl)} 
                                    alt={service.title} 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <IconComponent className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                )}
                              </div>
                              <div>
                                <h3 className={`font-semibold mb-2 hover:text-blue-600 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{service.description}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </section>
        )}

        {/* Testimonials / About */}
        {testimonials.length > 0 && (
          <section id="about" className={`py-12 lg:py-16 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t.about.title}
                </h2>
                <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t.about.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-0'} shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-6 italic`}>"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</div>
                          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {testimonial.role && `${testimonial.role}`}
                            {testimonial.role && testimonial.company && ', '}
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className={`py-12 lg:py-16 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.contact.title}
              </h2>
              <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.contact.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                    <Globe className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.contact.globalPresence}</div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.contact.locations}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${isDark ? 'bg-green-900/30' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                    <Mail className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.contact.email}</div>
                    <a 
                      href="mailto:info@gsccapitalgroup.com" 
                      className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline transition-colors`}
                    >
                      info@gsccapitalgroup.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                    <Phone className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.contact.phone}</div>
                    <a 
                      href="tel:+15551234567" 
                      className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline transition-colors`}
                    >
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>
              </div>

              <Card className={`${isDark ? 'bg-slate-700 border-slate-600' : 'border-0'} shadow-lg`}>
                <CardContent className="p-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input 
                      placeholder={t.contact.name} 
                      className="border-slate-200"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input 
                      type="email" 
                      placeholder={t.contact.email} 
                      className="border-slate-200"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Input 
                      placeholder={t.contact.company} 
                      className="border-slate-200"
                      value={contactForm.company}
                      onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                    />
                    <textarea 
                      placeholder={t.contact.message}
                      className="w-full p-3 border border-slate-200 rounded-lg resize-none h-24"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      {t.contact.send}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <img 
                      src="/logo.png" 
                      alt="GSC Capital Group Logo" 
                      className="h-12 w-12 object-contain filter brightness-110 contrast-110"
                    />
                    <div className="absolute inset-0 rounded-lg border-2 border-purple-500/30 blur-sm -z-10" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm">
                  {t.footer.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t.footer.companies}</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {companies.map((company) => (
                    <li key={company.id}>
                      <button 
                        onClick={() => scrollToSection('companies')}
                        className="hover:text-white transition-colors text-left"
                      >
                        {company.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t.footer.services}</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <button 
                      onClick={() => scrollToSection('services')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Property Management
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('services')}
                      className="hover:text-white transition-colors text-left"
                    >
                      IT Consulting
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('services')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Business Strategy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('services')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Investment Advisory
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">{t.footer.quickLinks}</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <button 
                      onClick={() => scrollToSection('about')}
                      className={`hover:text-white transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {t.nav.about}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => scrollToSection('contact')}
                      className={`hover:text-white transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {t.footer.contact}
                    </button>
                  </li>
                  <li><a href="/admin/auth" className="hover:text-white transition-colors">Admin</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
              <p>© 2024 GSC Capital Group. {t.footer.allRightsReserved} | www.gsccapitalgroup.com</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}