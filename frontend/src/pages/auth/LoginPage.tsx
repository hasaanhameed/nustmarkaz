import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null); // 'google' | 'azure' | null
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
      // Otherwise stay on this page to show login button
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (provider: 'google' | 'azure') => {
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
    <Layout>
      <section className="container-custom py-16">
        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-primary">
              Welcome to NustMarkaz
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in with your NUST email
            </p>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Google Login Button */}
              <button
                onClick={() => handleLogin('google')}
                disabled={!!loading}
                className="w-full bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading === 'google' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>

              {/* Outlook Login Button */}
              <button
                onClick={() => handleLogin('azure')}
                disabled={!!loading}
                className="w-full bg-[#0078D4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0078D4]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading === 'azure' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting to Outlook...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M14,1.5C14,1.5 14,10 14,10C14,10 23,11.5 23,11.5C23,11.5 23,0.5 23,0.5C23,0.5 14,1.5 14,1.5ZM13,2C13,2 2,3.5 2,3.5C2,3.5 2,19.5 2,19.5C2,19.5 13,21 13,21C13,21 13,2 13,2ZM14,11C14,11 14,22 14,22C14,22 23,23.5 23,23.5C23,23.5 23,12.5 23,12.5C23,12.5 14,11 14,11ZM7,7.125C7,7.125 9.5,7.125 9.5,7.125C9.5,7.125 9.5,9.625 9.5,9.625C9.5,9.625 7,9.625 7,9.625C7,9.625 7,7.125 7,7.125ZM16.5,5.125C16.5,5.125 19,5.125 19,5.125C19,5.125 19,7.625 19,7.625C19,7.625 16.5,7.625 16.5,7.625C16.5,7.625 16.5,5.125 16.5,5.125ZM16.5,15.125C16.5,15.125 19,15.125 19,15.125C19,15.125 19,17.625 19,17.625C19,17.625 16.5,17.625 16.5,17.625C16.5,17.625 16.5,15.125 16.5,15.125ZM7,13.125C7,13.125 9.5,13.125 9.5,13.125C9.5,13.125 9.5,15.625 9.5,15.625C9.5,15.625 7,15.625 7,15.625C7,15.625 7,13.125 7,13.125Z" />
                    </svg>
                    Sign in with Outlook
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
}