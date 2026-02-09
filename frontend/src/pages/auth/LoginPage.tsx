import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModernBackground } from '@/components/ui/modern-background';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '@/api/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<string | null>(null); // 'email' | 'google' | 'azure' | null
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const backendToken = localStorage.getItem('access_token');

      if (data.session && backendToken) {
        // Both Supabase AND backend auth exist - go to dashboard
        navigate('/dashboard');
      } else if (data.session && !backendToken) {
        // Has Supabase session but no backend token - complete profile
        navigate('/auth/complete-profile');
      }
    };
    checkUser();
  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading('email');
      setError(null);
      const response = await login(formData.email, formData.password);
      localStorage.setItem('access_token', response.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(null);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'azure') => {
    try {
      setLoading(provider);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'azure' ? 'email openid profile' : undefined
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(null);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center p-6 md:p-12">
        <ModernBackground />

        <div className="w-full max-w-md animate-entrance">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/40 p-8 md:p-12 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-foreground mb-3 tracking-[-0.04em]">Welcome Back.</h1>
                <p className="text-muted-foreground font-bold text-lg opacity-70">Sign in to your account.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-center backdrop-blur-sm">
                  <p className="text-destructive text-sm font-bold">{error}</p>
                </div>
              )}

              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">Email</Label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="h-14 pl-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all"
                      disabled={!!loading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">Password</Label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-primary" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="h-14 pl-12 pr-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all"
                      disabled={!!loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  disabled={!!loading}
                >
                  {loading === 'email' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                </Button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Or continue with</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={!!loading}
                  className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-white/50 border border-white/40 hover:bg-white transition-all disabled:opacity-50 font-bold text-gray-700"
                >
                  {loading === 'google' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Google
                </button>

                <button
                  onClick={() => handleSocialLogin('azure')}
                  disabled={!!loading}
                  className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#0078D4]/10 border border-[#0078D4]/20 hover:bg-[#0078D4]/20 transition-all disabled:opacity-50 font-bold text-[#0078D4]"
                >
                  {loading === 'azure' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M14,1.5C14,1.5 14,10 14,10C14,10 23,11.5 23,11.5C23,11.5 23,0.5 23,0.5C23,0.5 14,1.5 14,1.5ZM13,2C13,2 2,3.5 2,3.5C2,3.5 2,19.5 2,19.5C2,19.5 13,21 13,21C13,21 13,2 13,2ZM14,11C14,11 14,22 14,22C14,22 23,23.5 23,23.5C23,23.5 23,12.5 23,12.5C23,12.5 14,11 14,11ZM7,7.125C7,7.125 9.5,7.125 9.5,7.125C9.5,7.125 9.5,9.625 9.5,9.625C9.5,9.625 7,9.625 7,9.625C7,7.125 7,7.125ZM16.5,5.125C16.5,5.125 19,5.125 19,5.125C19,7.625 19,7.625C19,7.625 16.5,7.625 16.5,7.625C16.5,7.625 16.5,5.125 16.5,5.125ZM16.5,15.125C16.5,15.125 19,15.125 19,15.125C19,15.125 19,17.625 19,17.625C19,17.625 16.5,17.625 16.5,17.625C16.5,17.625 16.5,15.125 16.5,15.125ZM7,13.125C7,13.125 9.5,13.125 9.5,13.125C9.5,13.125 9.5,15.625 9.5,15.625C9.5,15.625 7,15.625 7,15.625C7,15.625 7,13.125 7,13.125Z" />
                    </svg>
                  )}
                  Outlook
                </button>
              </div>

              <p className="text-center text-base mt-8 font-bold text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/join" className="text-primary hover:underline">Join Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}