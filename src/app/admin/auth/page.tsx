'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple authentication (in production, use proper auth)
    if (email === 'admin@gsccapitalgroup.com' && password === 'admin123') {
      // Set a simple session flag
      localStorage.setItem('adminAuthenticated', 'true');
      router.push('/admin');
    } else {
      alert('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-md dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="text-center">
          <div className="relative drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] mx-auto mb-4">
            <img 
              src="/logo.png" 
              alt="GSC Capital Group Logo" 
              className="h-16 w-16 object-contain filter brightness-110 contrast-110 mx-auto"
            />
            <div className="absolute inset-0 rounded-lg border-2 border-purple-500/30 blur-sm -z-10" />
          </div>
          <CardTitle className="text-2xl font-bold dark:text-slate-100">Admin Login</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Sign in to manage GSC Capital Group website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="dark:text-slate-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="dark:text-slate-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}