import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-blue-400 text-primary-foreground border-t border-white/10">
      <div className="container-custom py-2 md:py-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">

          {/* Brand - Hidden on mobile */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-4"
            aria-label="Nustmarkaz Home"
          >
            <div className="h-24 flex items-center">
              <Logo className="h-full w-auto" />
            </div>

          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-2 text-xs md:text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 opacity-80" />
              <span>H-12, Islamabad</span>
            </div>

            <span className="hidden md:inline text-white/30">|</span>

            <span className="text-primary-foreground/70">
              © {new Date().getFullYear()} Nustmarkaz
            </span>
          </div>

          {/* Links */}
          <nav className="flex gap-4 md:gap-8 text-sm md:text-base font-medium text-primary-foreground/90">
            <Link
              to="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>
          </nav>

        </div>
      </div>
    </footer>
  );
}