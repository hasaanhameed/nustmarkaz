import { cn } from "@/lib/utils";

interface GeometricBackgroundProps {
  className?: string;
  variant?: "hero" | "section";
}

export function GeometricBackground({ className, variant = "hero" }: GeometricBackgroundProps) {
  if (variant === "hero") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[#0f172a]" />

        {/* Animated Gradients */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#4facfe]/20 blur-[120px] rounded-full animate-float" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#764ba2]/20 blur-[100px] rounded-full animate-float" style={{ animationDuration: '12s', animationDelay: '-2s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-[#00f2fe]/10 blur-[130px] rounded-full animate-float" style={{ animationDuration: '10s', animationDelay: '-4s' }} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(#4facfe 0.5px, transparent 0.5px)`,
            backgroundSize: '30px 30px'
          }}
        />

        {/* Floating Glass Shapes */}
        <div
          className="absolute -right-20 top-1/4 w-[400px] h-[400px] glass rotate-12 rounded-[80px] opacity-40 animate-float"
          style={{ animationDuration: '15s' }}
        />
        <div
          className="absolute right-1/4 top-1/3 w-16 h-16 glass rounded-2xl rotate-45 opacity-60 animate-float"
          style={{ animationDuration: '6s', animationDelay: '-1s' }}
        />
        <div
          className="absolute right-10 bottom-1/4 w-24 h-24 glass rounded-full opacity-50 animate-float"
          style={{ animationDuration: '10s', animationDelay: '-3s' }}
        />

        {/* Decorative Lines */}
        <svg
          className="absolute right-0 top-0 w-full h-full opacity-20"
          viewBox="0 0 800 600"
          fill="none"
        >
          <path
            d="M800 100 C 600 200 400 50 200 300 C 0 550 400 600 800 400"
            stroke="url(#hero-line-gradient)"
            strokeWidth="2"
            fill="none"
          />
          <defs>
            <linearGradient id="hero-line-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4facfe" />
              <stop offset="100%" stopColor="#00f2fe" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none opacity-50", className)}>
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-accent/5 blur-[60px]" />
      <div className="absolute -left-20 bottom-0 w-96 h-96 rounded-full bg-primary/10 blur-[80px]" />
    </div>
  );
}
