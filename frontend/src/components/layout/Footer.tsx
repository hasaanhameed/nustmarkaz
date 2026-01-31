import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-white/5">
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Brand Identifier */}
          <Link to="/" className="group flex items-center gap-4 transition-transform hover:scale-105">
            <Logo size="md" />
          </Link>

          {/* Contact & Meta */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm font-bold tracking-tight text-primary-foreground/60">
            <div className="flex items-center gap-3 transition-colors hover:text-accent">
              <MapPin className="h-5 w-5 opacity-70" />
              <span>H-12 Islamabad</span>
            </div>
            <div className="flex items-center gap-3 transition-colors hover:text-accent">
              <span className="opacity-40 font-medium">© {new Date().getFullYear()}</span>
              <span className="text-primary-foreground font-black tracking-wide text-sm bg-white/10 px-3 py-1 rounded-full border border-white/10">Built for NUSTians</span>
            </div>
          </div>

          <div className="flex gap-10 text-sm font-black uppercase tracking-widest text-primary-foreground/40">
            <a href="#" className="hover:text-accent transition-all hover:scale-110">Privacy</a>
            <a href="#" className="hover:text-accent transition-all hover:scale-110">Terms</a>
            <a href="#" className="hover:text-accent transition-all hover:scale-110">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}