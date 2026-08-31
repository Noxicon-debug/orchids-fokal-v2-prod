import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { TribalSidePanel, TribalCorner, TribalZigzag, TribalDiamond } from '../components/common/TribalDecor';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { session, loading, updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Use at least 8 characters for the new password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await updatePassword(password);
      toast.success('Password updated. You can continue to the CMS.');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Unable to update password. Please request a new reset link.');
    } finally {
      setSaving(false);
    }
  };

  const tribalBg = (
    <>
      <div className="tribal-bg-dots" />
      <TribalSidePanel className="tribal-side-left" />
      <TribalSidePanel className="tribal-side-right" />
      <TribalCorner className="tribal-corner-deco tribal-corner-tl" color="#0864ed" />
      <TribalCorner className="tribal-corner-deco tribal-corner-br" color="#0864ed" />
      <TribalCorner className="tribal-corner-deco tribal-corner-tr" color="#0864ed" />
      <TribalCorner className="tribal-corner-deco tribal-corner-bl" color="#0864ed" />
      <TribalZigzag className="absolute top-[5%] left-1/2 -translate-x-1/2 w-80 h-6 opacity-15" color="#0864ed" />
      <TribalZigzag className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-80 h-6 opacity-15" color="#0864ed" />
      <TribalDiamond className="absolute top-[15%] right-[15%] w-16 h-16 opacity-25" color="#0864ed" />
      <TribalDiamond className="absolute bottom-[18%] left-[12%] w-20 h-20 opacity-20" color="#0864ed" />
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden">
        {tribalBg}
        <div className="text-center relative z-10">
          <Loader2 className="w-10 h-10 text-accent-500 animate-spin mx-auto mb-4" />
          <p className="text-dark-400 text-sm">Preparing password reset...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
        {tribalBg}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md rounded-2xl border border-dark-800 bg-dark-900/80 p-8 text-center shadow-2xl backdrop-blur-xl z-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 mb-6">
            <Lock className="w-7 h-7 text-accent-400" />
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight">Reset Your Password</h1>
          <p className="text-dark-400 mt-3 text-sm leading-relaxed">
            Open the recovery link from your email to continue. If the link expired, request a new one from the login page.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      {tribalBg}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 mb-6">
            <Lock className="w-7 h-7 text-accent-400" />
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight">Set New Password</h1>
          <p className="text-dark-400 mt-2 text-sm">Choose a new password for your FOKAL CMS account</p>
        </div>

        <div className="bg-dark-900/80 backdrop-blur-xl border border-dark-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-dark-200 text-sm font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
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

            <div className="space-y-2">
              <Label className="text-dark-200 text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className="bg-dark-800 border-dark-700 text-white placeholder:text-dark-600 pl-10 focus:border-accent-500 focus:ring-accent-500/20"
                />
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
              disabled={saving}
              className="w-full bg-accent-500 hover:bg-accent-600 text-dark-900 font-bold h-11 text-sm tracking-wide"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Save New Password'
              )}
            </Button>
          </form>
        </div>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-dark-400 transition-colors hover:text-dark-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
