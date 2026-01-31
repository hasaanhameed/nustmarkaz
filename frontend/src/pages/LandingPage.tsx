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
} from "lucide-react";

const features = [
  {
    icon: ShoppingBasket,
    title: "Market",
    description: "A secure space for students to exchange essentials, books, and gadgets.",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Navigation,
    title: "Trips",
    description: "Organize and join campus-wide travel and carpooling initiatives.",
    color: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: HandHeart,
    title: "Causes",
    description: "Support community donation drives and social impact projects.",
    color: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: TicketPercent,
    title: "Access",
    description: "Exclusive campus event opportunities and society engagement.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const stats = [
  { label: "Students", value: "5k+", icon: Users },
  { label: "Trending", value: "200+", icon: TrendingUp },
  { label: "Verified", value: "1.2k+", icon: CheckCircle },
  { label: "Impact", value: "300k+", icon: HandHeart },
];

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Layout>
      <div className="relative min-h-screen">
        <ModernBackground />

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32">
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-entrance">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-border/50 text-foreground/80 text-sm font-bold mb-10 shadow-sm hover:shadow-md transition-shadow cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                The Campus Hub
              </div>

              <h1 className="text-7xl md:text-9xl font-black text-foreground mb-12 leading-[0.95] tracking-[-0.05em] text-balance">
                Your Campus. <br />
                <span className="text-primary italic relative">
                  Connected.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-14 max-w-2xl mx-auto leading-relaxed font-bold opacity-80">
                The heartbeat of student life. One place for everything that matters on campus.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/signup">
                  <Button size="lg" className="h-20 px-14 text-2xl font-black rounded-3xl shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    Start Now
                    <ArrowRight className="ml-3 h-7 w-7" />
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="outline" className="h-20 px-14 border-border/80 text-2xl font-black rounded-3xl bg-white/20 backdrop-blur-xl transition-all hover:bg-white/40 hover:scale-105">
                    Explore
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Teaser */}
            <div className="mt-32 relative max-w-5xl mx-auto animate-entrance" style={{ animationDelay: '0.4s' }}>
              <div className="relative z-10 rounded-[4rem] border border-border/40 bg-white/20 backdrop-blur-3xl p-6 shadow-2xl">
                <div className="aspect-[21/9] bg-secondary/10 rounded-[3.5rem] overflow-hidden border border-border/20 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="text-center p-12">
                    <div className="flex justify-center gap-10 mb-12 translate-y-6 group-hover:translate-y-0 transition-transform duration-1000 ease-human">
                      <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-xl border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-[-8deg] transition-all">
                        <ShoppingBasket className="w-14 h-14" />
                      </div>
                      <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-xl border border-border/50 flex items-center justify-center text-accent group-hover:scale-110 group-hover:rotate-[8deg] transition-all delay-100">
                        <Navigation className="w-14 h-14" />
                      </div>
                      <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-xl border border-border/50 flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:rotate-[-8deg] transition-all delay-200">
                        <HandHeart className="w-14 h-14" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-black text-foreground mb-4 tracking-tight">Pure Student Power.</h3>
                    <p className="text-muted-foreground font-black text-xl tracking-tight opacity-60">No noise. All value.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="py-20 relative z-10">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center group relative p-8 rounded-[3rem] transition-all hover:bg-white/20 hover:backdrop-blur-xl animate-entrance" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="h-16 w-16 rounded-[1.5rem] bg-white border border-border/50 shadow-md flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2 transition-all duration-500">
                    <stat.icon className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-6xl font-black text-foreground mb-3 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                    {stat.value}
                  </div>
                  <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] leading-none opacity-40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-40 relative z-10 overflow-hidden">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-32 animate-entrance">
              <h2 className="text-6xl md:text-8xl font-black text-foreground mb-10 tracking-[-0.04em] leading-[0.95]">Impact, <br /><span className="text-primary underline decoration-primary/10 decoration-[16px] underline-offset-[12px]">Every</span> Day.</h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-black leading-tight max-w-xl mx-auto opacity-70">
                Grounded tools for your campus life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="card-premium p-12 group animate-entrance bg-white/20 backdrop-blur-lg hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                  style={{ animationDelay: `${0.3 + i * 0.2}s` }}
                >
                  <div className={cn("inline-flex p-6 rounded-[2rem] mb-12 group-hover:scale-110 group-hover:rotate-12 shadow-inner transition-all duration-700", feature.color)}>
                    <feature.icon className={cn("w-12 h-12", feature.iconColor)} />
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-6 tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground font-bold text-lg leading-snug mb-12 opacity-80">
                    {feature.description}
                  </p>
                  <Link to="/marketplace" className="inline-flex items-center text-primary font-black text-sm uppercase tracking-[0.25em] hover:gap-4 transition-all group/link">
                    Explore <ArrowRight className="ml-3 w-5 h-5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Human-Centered CTA */}
        <section className="py-24 md:py-48 relative z-10">
          <div className="container-custom">
            <div className="bg-primary rounded-[5rem] p-16 md:p-32 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(var(--primary),0.3)] group">
              <div className="absolute inset-0 bg-grid-subtle opacity-20" />
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full -mr-48 -mt-48 blur-[120px] group-hover:scale-125 transition-transform duration-[2000ms]" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full -ml-32 -mb-32 blur-[90px] group-hover:scale-125 transition-transform duration-[2000ms]" />

              <div className="relative z-10 max-w-4xl mx-auto text-primary-foreground">
                <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-[-0.05em] leading-none text-balance animate-entrance">Ready to lead.</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-8">
                  <Link to="/signup">
                    <Button size="lg" className="h-20 px-16 bg-white text-primary hover:bg-accent hover:text-white transition-all duration-500 text-2xl font-black rounded-3xl shadow-2xl hover:scale-110 active:scale-95">
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

