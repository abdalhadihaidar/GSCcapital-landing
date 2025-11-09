'use client';

import { useEffect, useState } from 'react';
import { Building2, BarChart3, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  companies: number;
  statistics: number;
  testimonials: number;
  messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    companies: 0,
    statistics: 0,
    testimonials: 0,
    messages: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [companiesRes, statisticsRes, testimonialsRes, messagesRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/statistics'),
        fetch('/api/testimonials'),
        fetch('/api/contact')
      ]);

      const companies = await companiesRes.json();
      const statistics = await statisticsRes.json();
      const testimonials = await testimonialsRes.json();
      const messages = await messagesRes.json();

      setStats({
        companies: companies.length || 0,
        statistics: statistics.length || 0,
        testimonials: testimonials.length || 0,
        messages: messages.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Companies',
      value: stats.companies,
      description: 'Active companies',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Statistics',
      value: stats.statistics,
      description: 'Website statistics',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Testimonials',
      value: stats.testimonials,
      description: 'Client testimonials',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Messages',
      value: stats.messages,
      description: 'Contact messages',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your website content and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} dark:bg-slate-700`}>
                <stat.icon className={`w-4 h-4 ${stat.color} dark:text-blue-400`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Recent Activity</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Latest updates to your website content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Website loaded</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Just now</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Database initialized</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Few minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Admin panel created</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Recently</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Quick Actions</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Common tasks to manage your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Add New Company</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Create a new company profile</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Add Testimonial</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Add client feedback</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Update Statistics</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Modify website metrics</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}