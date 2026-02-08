import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModernBackground } from "@/components/ui/modern-background";
import { LogIn, UserPlus, ArrowRight, Mail } from "lucide-react";

export default function JoinPage() {
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
                    <div className="flex-1 w-full">
                      <h3 className="text-2xl font-black text-foreground mb-2">
                        Sign Up with Student Email
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        New to NustMarkaz? Create an account using your NUST email address
                      </p>
                      <Link to="/auth/google">
                        <Button className="w-full h-12 md:h-14 text-base md:text-lg font-bold rounded-2xl group/btn">
                          <Mail className="w-5 h-5 mr-2" />
                          Sign Up with Google
                          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
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
