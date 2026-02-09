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
import { useUser } from '@/contexts/UserContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { refetchUser } = useUser();
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
      // Refetch user data so navbar updates immediately
      await refetchUser();
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