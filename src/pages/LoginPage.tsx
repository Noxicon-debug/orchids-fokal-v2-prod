import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TribalSidePanel, TribalCorner, TribalZigzag } from '../components/common/TribalDecor';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Enter your admin email first, then use Forgot password.');
      return;
    }

    setError('');
    setResetLoading(true);
    try {
      await resetPassword(email.trim(), `${window.location.origin}/reset-password`);
      toast.success('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Unable to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Tribal dot pattern background */}
      <div className="tribal-bg-dots" />

      {/* Tribal side panels */}
      <TribalSidePanel className="tribal-side-left" />
      <TribalSidePanel className="tribal-side-right" />

      {/* Corner decorations */}
      <TribalCorner className="tribal-corner-deco tribal-corner-tl" color="#0864ed" />
      <TribalCorner className="tribal-corner-deco tribal-corner-br" color="#0864ed" />
      <TribalCorner className="tribal-corner-deco tribal-corner-tr" color="#0864ed" />
      <TribalCorner className="tribal-corner-deco tribal-corner-bl" color="#0864ed" />

      {/* Zigzag accents */}
      <TribalZigzag className="absolute top-[5%] left-1/2 -translate-x-1/2 w-80 h-6 opacity-15" color="#0864ed" />
      <TribalZigzag className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-80 h-6 opacity-15" color="#0864ed" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo / brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 mb-6">
            <Lock className="w-7 h-7 text-accent-400" />
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight">Admin Access</h1>
          <p className="text-dark-400 mt-2 text-sm">Sign in to manage your FOKAL CMS</p>
        </div>

        {/* Card */}
        <div className="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-dark-200 text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@fokal.com"
                  required
                  autoComplete="email"
                  className="bg-dark-800 border-dark-700 text-white placeholder:text-dark-600 pl-10 focus:border-accent-500 focus:ring-accent-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-dark-200 text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="bg-dark-800 border-dark-700 text-white placeholder:text-dark-600 pl-10 pr-10 focus:border-accent-500 focus:ring-accent-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading || resetLoading}
              className="w-full bg-accent-500 hover:bg-accent-600 text-dark-900 font-bold h-11 text-sm tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading || resetLoading}
              className="w-full text-sm font-medium text-accent-400 transition-colors hover:text-accent-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resetLoading ? 'Sending reset email...' : 'Forgot password?'}
            </button>
          </form>
        </div>

        <p className="text-center text-dark-600 text-xs mt-6">
          Access restricted to authorised personnel only.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
