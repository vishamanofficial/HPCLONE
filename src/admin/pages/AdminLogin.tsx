import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@hangingpanda.com');
  const [password, setPassword] = useState('Admin@HangingPanda2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-b from-surface to-bg relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.06),transparent_50%)] pointer-events-none" />

      <div className="max-w-md w-full bg-card border border-border p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 flex flex-col gap-6 text-left">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/25">
            HP
          </span>
          <div>
            <h1 className="text-xl font-black text-text-primary tracking-tight leading-tight">
              HangingPanda CMS
            </h1>
            <span className="text-xs font-semibold text-text-muted">
              Secure Administration Portal
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tight">Welcome Back</h2>
          <p className="text-xs text-text-secondary mt-1">
            Sign in to manage website pages, CMS content, leads, and SEO configurations.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hangingpanda.com"
              leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full justify-center"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to CMS
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> JWT Encrypted Session
          </span>
          <span>v2.0 MERN CMS</span>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
