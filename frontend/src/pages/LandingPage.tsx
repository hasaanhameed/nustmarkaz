import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ModernBackground } from "@/components/ui/modern-background";
import { cn } from "@/lib/utils";
import {
  ShoppingBasket,
  Navigation,
  HandHeart,
  TicketPercent,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  ShieldCheck,
  Globe,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

const features = [
  {
    icon: ShoppingBasket,
    title: "Market",
    description: "A secure space for students to exchange essentials, books, and gadgets.",
  },
  {
    icon: Navigation,
    title: "Trips",
    description: "Organize and join campus-wide travel and carpooling initiatives.",
  },
  {
    icon: HandHeart,
    title: "Causes",
    description: "Support community donation drives and social impact projects.",
  },
  {
    icon: TicketPercent,
    title: "Access",
    description: "Exclusive campus event opportunities and society engagement.",
  },
];

const pillars = [
  {
    label: "NUST Verified",
    description: "Exclusive access for verified H-12 students.",
    icon: CheckCircle,
  },
  {
    label: "Safe & Secure",
    description: "Built-in trust for peer-to-peer exchanges.",
    icon: ShieldCheck,
  },
  {
    label: "Campus Wide",
    description: "One hub for every society and department.",
    icon: Globe,
  },
  {
    label: "Student Driven",
    description: "Designed by NUSTians, for NUSTians.",
    icon: Zap,
  },
];

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Layout>
      <div className="relative min-h-screen">
        <ModernBackground variant="combined" />

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-36">
          <div className="container-custom relative z-10">
            <div className="max-w-5xl mx-auto text-center animate-entrance">
              {/* Cleanly Cut Logo Badge */}
              <div className="inline-flex items-center mb-12 cursor-default group hover:scale-105 transition-transform duration-500">
                <Logo size="sm" />
              </div>

              <h1 className="text-8xl md:text-[11rem] font-black text-foreground mb-16 leading-[0.85] tracking-[-0.06em] text-balance">
                Your Campus. <br />
                <span className="text-primary italic relative inline-block">
                  Redefined.
                  <svg className="absolute -bottom-4 left-0 w-full h-6 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-muted-foreground mb-20 max-w-3xl mx-auto leading-relaxed font-bold opacity-80 text-balance">
                The heartbeat of NUST life. Everything you need, from market deals to campus trips, in one expressive journey.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-24 px-16 text-3xl font-black rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95 group">
                    Join Today
                    <ArrowRight className="ml-4 h-9 w-9 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/marketplace" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-24 px-16 border-primary/20 text-3xl font-black rounded-[2.5rem] bg-white/20 backdrop-blur-2xl transition-all hover:bg-white/40 hover:scale-105 hover:border-primary/40">
                    Explore
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Teaser - The Journey Start */}
            <div className="mt-40 relative max-w-6xl mx-auto animate-entrance" style={{ animationDelay: '0.4s' }}>
              <div className="relative z-10 rounded-[5rem] border border-white/40 bg-white/30 backdrop-blur-3xl p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="aspect-[21/9] bg-background/40 rounded-[4rem] overflow-hidden border border-white/50 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-grid-subtle opacity-20" />
                  <div className="text-center p-12 relative z-10">
                    <div className="flex justify-center gap-12 mb-16 translate-y-6 group-hover:translate-y-0 transition-transform duration-1000 ease-human">
                      <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-[-12deg] transition-all">
                        <ShoppingBasket className="w-16 h-16" />
                      </div>
                      <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-[12deg] transition-all delay-100">
                        <Navigation className="w-16 h-16" />
                      </div>
                      <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-[-12deg] transition-all delay-200">
                        <HandHeart className="w-16 h-16" />
                      </div>
                    </div>
                    <h3 className="text-5xl font-black text-foreground mb-6 tracking-[-0.03em]">Start Your Journey.</h3>
                    <p className="text-muted-foreground font-black text-2xl tracking-tight opacity-70">Empowering the NUST community, one connection at a time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Row - Replacing Stats */}
        <section className="py-32 relative z-10">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {pillars.map((pillar, i) => (
                <div key={i} className="flex flex-col items-center group relative p-12 rounded-[4rem] transition-all hover:bg-white/40 hover:backdrop-blur-3xl animate-entrance shadow-sm hover:shadow-xl border border-transparent hover:border-white/50" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 shadow-lg flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-4 transition-all duration-700">
                    <pillar.icon className="w-10 h-10 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-3xl font-black text-foreground mb-4 tracking-tighter text-center">
                    {pillar.label}
                  </div>
                  <div className="text-sm font-bold text-muted-foreground text-center px-4">
                    {pillar.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-48 relative z-10 overflow-hidden">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto mb-40 animate-entrance">
              <h2 className="text-7xl md:text-9xl font-black text-foreground mb-12 tracking-[-0.05em] leading-[0.85]">Tools for <br /><span className="text-primary underline decoration-primary/10 decoration-[20px] underline-offset-[16px] italic">Impact.</span></h2>
              <p className="text-2xl md:text-3xl text-muted-foreground font-black leading-tight max-w-2xl mx-auto opacity-70">
                Built specifically for student life, with a focus on community and trust.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="card-premium p-16 group animate-entrance bg-white/30 backdrop-blur-2xl hover:bg-white transition-all shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:scale-[1.05] rounded-[4rem] border border-white/40"
                  style={{ animationDelay: `${0.3 + i * 0.2}s` }}
                >
                  <div className={cn("inline-flex p-8 rounded-[2.5rem] mb-14 group-hover:scale-125 group-hover:rotate-12 shadow-2xl transition-all duration-700 bg-primary/5")}>
                    <feature.icon className={cn("w-14 h-14 text-primary")} />
                  </div>
                  <h3 className="text-4xl font-black text-foreground mb-8 tracking-tighter group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground font-bold text-xl leading-snug mb-16 opacity-80">
                    {feature.description}
                  </p>
                  <Link to="/marketplace" className="inline-flex items-center text-primary font-black text-base uppercase tracking-[0.3em] hover:gap-6 transition-all group/link">
                    Explore <ArrowRight className="ml-4 w-7 h-7" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Human-Centered CTA */}
        <section className="py-32 md:py-60 relative z-10">
          <div className="container-custom">
            <div className="bg-primary rounded-[6rem] p-20 md:p-40 text-center relative overflow-hidden shadow-[0_60px_120px_-30px_rgba(var(--primary),0.4)] group border border-white/20">
              <div className="absolute inset-0 bg-grid-subtle opacity-30" />
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/15 rounded-full -mr-64 -mt-64 blur-[140px] group-hover:scale-150 transition-transform duration-[3000ms]" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/25 rounded-full -ml-48 -mb-48 blur-[100px] group-hover:scale-150 transition-transform duration-[3000ms]" />

              <div className="relative z-10 max-w-5xl mx-auto text-primary-foreground">
                <h2 className="text-7xl md:text-[10rem] font-black mb-16 tracking-[-0.06em] leading-none text-balance animate-entrance">Ready To <br /><span className="italic opacity-80">Connect?</span></h2>
                <div className="flex flex-col sm:flex-row justify-center gap-10">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full h-24 px-20 bg-white text-primary hover:bg-black hover:text-white transition-all duration-700 text-3xl font-black rounded-3xl shadow-2xl hover:scale-110 active:scale-95 border-none">
                      Join Today
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

