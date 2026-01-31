import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-white/5">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Minimal Brand Identifier */}
          <Link to="/" className="group flex items-center gap-4 transition-transform hover:scale-105">
            <img
              src="/images/finallogo.jpeg"
              alt="Logo"
              className="h-10 w-10 rounded-xl object-cover shadow-lg border border-white/10"
            />
          </Link>

          {/* Grounded Contact & Meta */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground/40">
            <div className="flex items-center gap-3 transition-colors hover:text-accent">
              <MapPin className="h-4 w-4" />
              <span>H-12 Islamabad</span>
            </div>
            <div className="flex items-center gap-3 transition-colors hover:text-accent">
              <span className="opacity-40">© {new Date().getFullYear()}</span>
              <span className="text-primary-foreground/60 tracking-normal font-bold normal-case text-xs">Built for NUSTians</span>
            </div>
          </div>

          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-primary-foreground/30">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}