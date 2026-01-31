import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ModernBackground } from "@/components/ui/modern-background";
import { cn } from "@/lib/utils";
import {
  ShoppingBasket,
  Navigation,
  CalendarDays,
  Search,
  Car,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Globe,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

const features = [
  {
    icon: ShoppingBasket,
    title: "Market",
    description: "Secure campus-wide exchange for students to trade essentials and gadgets.",
    path: "/marketplace"
  },
  {
    icon: Navigation,
    title: "Trips",
    description: "Organize or join exciting student-led adventure trips across the country.",
    path: "/trips"
  },
  {
    icon: CalendarDays,
    title: "Events",
    description: "Stay updated with campus society events and exclusive workshop opportunities.",
    path: "/events"
  },
  {
    icon: Search,
    title: "Lost & Found",
    description: "Dedicated space to help reconnect students with their missing valuables.",
    path: "/lost-found"
  },
  {
    icon: Car,
    title: "Car Pooling",
    description: "Safe and sustainable commute sharing with fellow NUSTians.",
    path: "/carpooling"
  }
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
                <Logo size="lg" />
              </div>

              <h1 className="text-5xl md:text-8xl lg:text-[11rem] font-black text-foreground mb-8 md:mb-16 leading-[0.85] tracking-[-0.06em] text-balance">
                Your Campus. <br />
                <span className="text-primary italic relative inline-block">
                  Redefined.
                  <svg className="absolute -bottom-4 left-0 w-full h-6 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl md:text-3xl text-muted-foreground mb-12 md:mb-20 max-w-3xl mx-auto leading-relaxed font-bold opacity-80 text-balance">
                The heartbeat of NUST life. Everything you need, from market deals to campus trips, in one expressive journey.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-16 md:h-24 px-10 md:px-16 text-xl md:text-3xl font-black rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95 group">
                    Join Today
                    <ArrowRight className="ml-3 md:ml-4 h-6 w-6 md:h-9 md:w-9 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link to="/marketplace" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-16 md:h-24 px-10 md:px-16 border-primary/20 text-xl md:text-3xl font-black rounded-[1.5rem] md:rounded-[2.5rem] bg-white/20 backdrop-blur-2xl transition-all hover:bg-white/40 hover:scale-105 hover:border-primary/40">
                    Explore
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Teaser - The Journey Start */}
            <div className="mt-20 md:mt-40 relative max-w-6xl mx-auto animate-entrance px-4" style={{ animationDelay: '0.4s' }}>
              <div className="relative z-10 rounded-[3rem] md:rounded-[5rem] border border-white/40 bg-white/30 backdrop-blur-3xl p-6 md:p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="min-h-[400px] md:aspect-[21/9] bg-background/40 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/50 flex items-center justify-center relative group p-8 md:p-0">
                  <div className="absolute inset-0 bg-grid-subtle opacity-20" />
                  <div className="text-center relative z-10 w-full">
                    <div className="flex justify-center gap-4 md:gap-12 mb-8 md:mb-16 translate-y-6 group-hover:translate-y-0 transition-transform duration-1000 ease-human">
                      <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-2xl border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-[-12deg] transition-all">
                        <Search className="w-10 h-10 md:w-16 md:h-16" />
                      </div>
                      <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-2xl border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-[12deg] transition-all delay-100">
                        <CalendarDays className="w-10 h-10 md:w-16 md:h-16" />
                      </div>
                      <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-2xl border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-[-12deg] transition-all delay-200">
                        <Car className="w-10 h-10 md:w-16 md:h-16" />
                      </div>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-foreground mb-4 md:mb-6 tracking-[-0.03em]">Start Your Journey.</h3>
                    <p className="text-muted-foreground font-black text-lg md:text-2xl tracking-tight opacity-70">Empowering the NUST community, one connection at a time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars Row - Replacing Stats */}
        <section className="py-20 md:py-32 relative z-10">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
              {pillars.map((pillar, i) => (
                <div key={i} className="flex flex-col items-center group relative p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] transition-all hover:bg-white/40 hover:backdrop-blur-3xl animate-entrance shadow-sm hover:shadow-xl border border-transparent hover:border-white/50" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/10 border border-primary/20 shadow-lg flex items-center justify-center mb-6 md:mb-10 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-4 transition-all duration-700">
                    <pillar.icon className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-xl md:text-3xl font-black text-foreground mb-4 tracking-tighter text-center">
                    {pillar.label}
                  </div>
                  <div className="text-xs md:text-sm font-bold text-muted-foreground text-center px-2 md:px-4">
                    {pillar.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 md:py-48 relative z-10 overflow-hidden">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto mb-20 md:mb-40 animate-entrance">
              <h2 className="text-4xl md:text-7xl lg:text-9xl font-black text-foreground mb-8 md:mb-12 tracking-[-0.05em] leading-[0.85]">Tools for <br /><span className="text-primary underline decoration-primary/10 decoration-[10px] md:decoration-[20px] underline-offset-[8px] md:underline-offset-[16px] italic">Impact.</span></h2>
              <p className="text-lg md:text-3xl text-muted-foreground font-black leading-tight max-w-2xl mx-auto opacity-70">
                Built specifically for student life, with a focus on community and trust.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="card-premium p-10 group animate-entrance bg-white/30 backdrop-blur-2xl hover:bg-white transition-all shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:scale-[1.05] rounded-[3rem] border border-white/40 flex flex-col items-center text-center"
                  style={{ animationDelay: `${0.3 + i * 0.15}s` }}
                >
                  <div className={cn("inline-flex p-6 rounded-[2rem] mb-8 group-hover:scale-110 group-hover:rotate-6 shadow-xl transition-all duration-700 bg-primary/5")}>
                    <feature.icon className={cn("w-10 h-10 text-primary")} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4 tracking-tighter group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground font-bold text-sm leading-snug mb-8 opacity-80 flex-1">
                    {feature.description}
                  </p>
                  <Link to={feature.path} className="inline-flex items-center text-primary font-black text-xs uppercase tracking-[0.2em] hover:gap-4 transition-all group/link mt-auto">
                    Explore <ArrowRight className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Human-Centered CTA */}
        <section className="py-20 md:py-60 relative z-10">
          <div className="container-custom">
            <div className="bg-primary rounded-[3rem] md:rounded-[6rem] p-12 md:p-40 text-center relative overflow-hidden shadow-[0_60px_120px_-30px_rgba(var(--primary),0.4)] group border border-white/20">
              <div className="absolute inset-0 bg-grid-subtle opacity-30" />
              <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-white/15 rounded-full -mr-64 -mt-64 blur-[140px] group-hover:scale-150 transition-transform duration-[3000ms]" />
              <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/25 rounded-full -ml-48 -mb-48 blur-[100px] group-hover:scale-150 transition-transform duration-[3000ms]" />

              <div className="relative z-10 max-w-5xl mx-auto text-primary-foreground">
                <h2 className="text-4xl md:text-7xl lg:text-[10rem] font-black mb-12 md:mb-16 tracking-[-0.06em] leading-none text-balance animate-entrance">Ready To <br /><span className="italic opacity-80">Connect?</span></h2>
                <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-10">
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full h-16 md:h-24 px-12 md:px-20 bg-white text-primary hover:bg-black hover:text-white transition-all duration-700 text-xl md:text-3xl font-black rounded-2xl md:rounded-3xl shadow-2xl hover:scale-110 active:scale-95 border-none">
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

