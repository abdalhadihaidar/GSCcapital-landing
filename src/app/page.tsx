'use client';

import { useState, useEffect } from 'react';
import { Building2, Home, Laptop, TrendingUp, Users, Search, Menu, X, Globe, Phone, Mail, MapPin, ArrowRight, CheckCircle, Star, BarChart3, Lightbulb, Shield, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { GSCLogo } from '@/components/gsc-logo';
import { GSCFullLogo } from '@/components/gsc-full-logo';
import { GSCLogoDark } from '@/components/gsc-logo-dark';
import { GSCFullLogoDark } from '@/components/gsc-full-logo-dark';
import { AnimatedGradientBg } from '@/components/animated-gradient-bg';
import { AnimatedGradientBgDark } from '@/components/animated-gradient-bg-dark';
import { FloatingElements } from '@/components/floating-elements';
import { FloatingElementsDark } from '@/components/floating-elements-dark';
import { EnhancedCard } from '@/components/enhanced-card';
import { EnhancedCardDark } from '@/components/enhanced-card-dark';
import { HeroSection } from '@/components/hero-section';
import { HeroSectionDark } from '@/components/hero-section-dark';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { useTheme } from 'next-themes';

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
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    fetchData();
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
        toast.success('Message sent successfully!');
        setContactForm({ name: '', email: '', company: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const getIconComponent = (iconName?: string) => {
    return iconMap[iconName || 'Home'] || Home;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
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
              <div className="flex items-center space-x-2">
                {isDark ? <GSCLogoDark size="md" variant="gradient" /> : <GSCLogo size="md" variant="gradient" />}
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} hidden sm:block`}>GSC Capital Group</span>
                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} sm:hidden`}>GSC</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {['Home', 'Companies', 'Services', 'About', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveSection(item.toLowerCase())}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      activeSection === item.toLowerCase() ? 'text-blue-600' : isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <DarkModeToggle />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm px-4 py-2">
                  Get Started
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
                {['Home', 'Companies', 'Services', 'About', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveSection(item.toLowerCase());
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left py-2 px-4 text-sm font-medium transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} ${
                      activeSection === item.toLowerCase() ? 'text-blue-600 bg-slate-50' : isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <div className="px-4 py-2">
                  <DarkModeToggle />
                </div>
                <div className="px-4 py-2">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Get Started
                  </Button>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Section */}
        {isDark ? <HeroSectionDark locale="en" /> : <HeroSection locale="en" />}

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
                            src={stat.imageUrl} 
                            alt={stat.label}
                            className="w-full h-full object-cover"
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
          <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
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
                        onLearnMore={() => console.log(`Learn more about ${company.name}`)}
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
                        onLearnMore={() => console.log(`Learn more about ${company.name}`)}
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
          <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                  Comprehensive Services
                </h2>
                <p className="text-lg text-slate-600">
                  From technology to real estate, we provide end-to-end solutions
                </p>
              </div>

              <Tabs defaultValue="all" className="max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
                  <TabsTrigger value="all" className="text-xs lg:text-sm">All</TabsTrigger>
                  <TabsTrigger value="property" className="text-xs lg:text-sm">Property</TabsTrigger>
                  <TabsTrigger value="tech" className="text-xs lg:text-sm">Tech</TabsTrigger>
                  <TabsTrigger value="business" className="text-xs lg:text-sm">Business</TabsTrigger>
                  <TabsTrigger value="finance" className="text-xs lg:text-sm">Finance</TabsTrigger>
                  <TabsTrigger value="consulting" className="text-xs lg:text-sm">Consulting</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service) => {
                      const IconComponent = getIconComponent(service.icon);
                      return (
                        <div key={service.id} className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {service.imageUrl ? (
                              <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                            ) : (
                              <IconComponent className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-2">{service.title}</h3>
                            <p className="text-sm text-slate-600">{service.description}</p>
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
                            <div key={service.id} className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {service.imageUrl ? (
                                  <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                                ) : (
                                  <IconComponent className="w-5 h-5 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">{service.title}</h3>
                                <p className="text-sm text-slate-600">{service.description}</p>
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

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                  Trusted by Industry Leaders
                </h2>
                <p className="text-lg text-slate-600">
                  See what our clients say about working with GSC Capital Group
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{testimonial.name}</div>
                          <div className="text-sm text-slate-600">
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
        <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-slate-600">
                Ready to transform your business? Let's discuss how we can help
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Global Presence</div>
                    <div className="text-sm text-slate-600">New York · Dubai · Worldwide</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Email</div>
                    <div className="text-sm text-slate-600">info@gsccapitalgroup.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Phone</div>
                    <div className="text-sm text-slate-600">+1 (555) 123-4567</div>
                  </div>
                </div>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input 
                      placeholder="Your Name" 
                      className="border-slate-200"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input 
                      type="email" 
                      placeholder="Email Address" 
                      className="border-slate-200"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Input 
                      placeholder="Company" 
                      className="border-slate-200"
                      value={contactForm.company}
                      onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                    />
                    <textarea 
                      placeholder="Tell us about your needs"
                      className="w-full p-3 border border-slate-200 rounded-lg resize-none h-24"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Send Message
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
                  <GSCFullLogo size="md" variant="white" />
                </div>
                <p className="text-slate-400 text-sm">
                  Global Strategy Catalyst Group - Empowering business excellence worldwide.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Companies</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  {companies.map((company) => (
                    <li key={company.id}>
                      <a href="#" className="hover:text-white transition-colors">{company.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Property Management</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">IT Consulting</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Business Strategy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Investment Advisory</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="/admin/auth" className="hover:text-white transition-colors">Admin</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
              <p>© 2024 GSC Capital Group. All rights reserved. | www.gsccapitalgroup.com</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}