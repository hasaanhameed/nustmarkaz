import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModernBackground } from "@/components/ui/modern-background";
import { LogIn, UserPlus, ArrowRight, Loader2 } from "lucide-react";

export default function JoinPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'azure') => {
    try {
      setLoading(provider);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'azure' ? 'email openid profile' : undefined
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center p-6 md:p-12">
        <ModernBackground />

        <div className="w-full max-w-2xl animate-entrance">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/40 p-10 md:p-16 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-black text-foreground mb-4 tracking-[-0.04em]">
                  Join Community
                </h1>
                <p className="text-muted-foreground font-bold text-lg opacity-70">
                  Choose how you'd like to get started
                </p>
              </div>

              <div className="space-y-6">
                {/* Sign Up with Student Email */}
                <Card className="p-6 md:p-8 hover:shadow-xl transition-all border-2 hover:border-primary/20 bg-white/60">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <UserPlus className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      <h3 className="text-2xl font-black text-foreground mb-2">
                        Sign Up with Student Email
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        New to NustMarkaz? Create an account using your NUST email address
                      </p>

                      <Button
                        onClick={() => handleSocialLogin('google')}
                        disabled={!!loading}
                        className="w-full h-12 md:h-14 text-base md:text-lg font-bold rounded-2xl group/btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      >
                        {loading === 'google' ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign Up with Google
                          </>
                        )}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        onClick={() => handleSocialLogin('azure')}
                        disabled={!!loading}
                        className="w-full h-12 md:h-14 text-base md:text-lg font-bold rounded-2xl group/btn bg-[#0078D4] text-white hover:bg-[#0078D4]/90"
                      >
                        {loading === 'azure' ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M14,1.5C14,1.5 14,10 14,10C14,10 23,11.5 23,11.5C23,11.5 23,0.5 23,0.5C23,0.5 14,1.5 14,1.5ZM13,2C13,2 2,3.5 2,3.5C2,3.5 2,19.5 2,19.5C2,19.5 13,21 13,21C13,21 13,2 13,2ZM14,11C14,11 14,22 14,22C14,22 23,23.5 23,23.5C23,23.5 23,12.5 23,12.5C23,12.5 14,11 14,11ZM7,7.125C7,7.125 9.5,7.125 9.5,7.125C9.5,7.125 9.5,9.625 9.5,9.625C9.5,9.625 7,9.625 7,9.625C7,7.125 7,7.125ZM16.5,5.125C16.5,5.125 19,5.125 19,5.125C19,7.625 19,7.625C19,7.625 16.5,7.625 16.5,7.625C16.5,7.625 16.5,5.125 16.5,5.125ZM16.5,15.125C16.5,15.125 19,15.125 19,15.125C19,15.125 19,17.625 19,17.625C19,17.625 16.5,17.625 16.5,17.625C16.5,17.625 16.5,15.125 16.5,15.125ZM7,13.125C7,13.125 9.5,13.125 9.5,13.125C9.5,13.125 9.5,15.625 9.5,15.625C9.5,15.625 7,15.625 7,15.625C7,15.625 7,13.125 7,13.125Z" />
                            </svg>
                            Sign Up with Outlook
                          </>
                        )}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Login */}
                <Card className="p-6 md:p-8 hover:shadow-xl transition-all border-2 hover:border-primary/20 bg-white/60">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 w-full">
                      <h3 className="text-2xl font-black text-foreground mb-2">
                        Already Have an Account?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Sign in with your email and password to access your account
                      </p>
                      <Link to="/auth/login">
                        <Button
                          variant="outline"
                          className="w-full h-12 md:h-14 text-base md:text-lg font-bold rounded-2xl border-2 group/btn"
                        >
                          <LogIn className="w-5 h-5 mr-2" />
                          Log In
                          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors font-semibold inline-flex items-center gap-2"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
