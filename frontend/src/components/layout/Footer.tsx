import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12 md:py-16">
        {/* Centered Brand Section */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-2xl">NustMarkaz</span>
          </Link>
          
          <p className="text-primary-foreground/80 text-base mb-8 max-w-md">
            The exclusive student portal for NUST community. Buy, sell, organize trips, and make a difference.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>NUST, H-12, Islamabad</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span>support@nustmarkaz.pk</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} NustMarkaz v1.0.0. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}