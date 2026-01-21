import { cn } from "@/lib/utils";

interface GeometricBackgroundProps {
  className?: string;
  variant?: "hero" | "section";
}

export function GeometricBackground({ className, variant = "hero" }: GeometricBackgroundProps) {
  if (variant === "hero") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        {/* Large geometric shape - right side */}
        <div 
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-[60px] rotate-12 bg-accent/10 animate-pulse-slow"
        />
        <div 
          className="absolute -right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-[50px] rotate-6 bg-accent/20 border border-accent/30"
        />
        <div 
          className="absolute right-20 top-1/3 w-[300px] h-[300px] rounded-[40px] -rotate-12 bg-primary/30"
        />
        
        {/* Small floating shapes */}
        <div 
          className="absolute right-1/3 top-1/4 w-4 h-4 rounded-full bg-accent/40 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div 
          className="absolute right-1/4 bottom-1/3 w-3 h-3 rounded-full bg-geometric-3/60 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div 
          className="absolute right-1/2 top-2/3 w-2 h-2 rounded-full bg-accent/50 animate-float"
          style={{ animationDelay: "2s" }}
        />
        
        {/* Curved line */}
        <svg 
          className="absolute right-0 top-0 w-full h-full" 
          viewBox="0 0 800 600" 
          fill="none"
          style={{ opacity: 0.3 }}
        >
          <path 
            d="M400 100 Q 650 200 600 400 Q 550 550 700 600" 
            stroke="hsl(var(--accent))" 
            strokeWidth="2" 
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-accent/5" />
      <div className="absolute -left-10 bottom-0 w-60 h-60 rounded-full bg-primary/5" />
    </div>
  );
}
