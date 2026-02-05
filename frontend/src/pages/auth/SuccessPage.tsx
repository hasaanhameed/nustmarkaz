import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModernBackground } from "@/components/ui/modern-background";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <Layout showFooter={false}>
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center p-6 md:p-12">
        <ModernBackground />

        <div className="w-full max-w-lg animate-entrance">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/40 p-10 md:p-16 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative z-10 text-center">
              {/* Success Message */}
              <h1 className="text-5xl font-black text-foreground mb-4 tracking-[-0.04em]">
                Account Created!
              </h1>
              <p className="text-muted-foreground font-bold text-lg mb-2">
                Welcome to NustMarkaz
              </p>
              <p className="text-muted-foreground text-sm mb-10 max-w-md mx-auto">
                Your account has been successfully created. You can now log in to access all the amazing features of our platform.
              </p>

              {/* Continue Button */}
              <Link to="/">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold rounded-2xl group/btn shadow-lg hover:shadow-xl transition-all"
                >
                  Continue to Home
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-border/30">
                <p className="text-sm text-muted-foreground">
                  Ready to get started?{" "}
                  <Link 
                    to="/auth/login" 
                    className="text-primary font-semibold hover:underline"
                  >
                    Log in now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
