import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBasket,
  MapPin,
  Heart,
  CalendarDays,
  User,
  LogIn,
  LogOut,
  Loader2,
  Search,
  Car,
  Home,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getCurrentUser, User as UserType } from "@/api/user";

const navLinks = [
  { name: "Home", href: "/", icon: Home, loggedOutOnly: true },
  { name: "Dashboard", href: "/dashboard", icon: User, loggedInOnly: true },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBasket },
  { name: "Trips", href: "/trips", icon: MapPin },
  { name: "Donations", href: "/donations", icon: Heart },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Lost & Found", href: "/lost-found", icon: Search },
  { name: "Car Pooling", href: "/carpooling", icon: Car },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, [location]);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("access_token");
      setCurrentUser(null);
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
      navigate("/");
    }, 800);
  };

  const filteredNavLinks = navLinks.filter((link) => {
    if (link.loggedOutOnly && currentUser) return false;
    if (link.loggedInOnly && !currentUser) return false;
    return true;
  });

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container-custom">
          <div className="flex h-20 items-center justify-between">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-6">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-secondary transition-colors">
                    <Menu className="h-7 w-7 text-foreground/70" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r-border/30 shadow-2xl">
                  <div className="flex flex-col h-full bg-background">
                    <SheetHeader className="p-10 border-b border-border/50 text-left">
                      <SheetTitle className="flex justify-center">
                        <img
                          src="/images/finallogo.jpeg"
                          alt="Logo"
                          className="h-20 w-20 rounded-2xl object-cover shadow-lg border border-border/50"
                        />
                      </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto py-8 px-6">
                      <div className="space-y-2">
                        {filteredNavLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all duration-300",
                              location.pathname === link.href
                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 translate-x-2"
                                : "text-foreground/60 hover:text-primary hover:bg-primary/5 hover:translate-x-2",
                            )}
                          >
                            {link.icon && <link.icon className="h-6 w-6 opacity-80" />}
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 border-t border-border/50 bg-secondary/30">
                      {currentUser ? (
                        <div className="space-y-4">
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-background transition-colors border border-transparent hover:border-border/50">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <User className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-base font-bold truncate">{currentUser.username}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">View Profile</p>
                              </div>
                            </div>
                          </Link>
                          <Button
                            variant="outline"
                            className="w-full h-12 justify-start gap-4 rounded-2xl border-border/50 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 font-bold"
                            onClick={() => {
                              handleLogoutClick();
                              setIsOpen(false);
                            }}
                          >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full h-12 rounded-2xl font-bold">Log in</Button>
                          </Link>
                          <Link to="/signup" onClick={() => setIsOpen(false)}>
                            <Button className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/10">Sign up</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img
                    src="/images/finallogo.jpeg"
                    alt="Logo"
                    className="h-12 w-12 rounded-2xl object-cover transition-all duration-700 group-hover:rotate-[12deg] group-hover:scale-110 shadow-md group-hover:shadow-primary/30"
                  />
                  <div className="absolute inset-0 rounded-2xl border border-primary/10 group-hover:border-primary/40 transition-colors" />
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/60 hover:text-primary hover:bg-primary/5 transition-all">
                <Search className="h-5 w-5" />
              </Button>
              {currentUser ? (
                <Link to="/profile">
                  <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-sm">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button size="sm" className="h-10 px-6 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 btn-hover-effect">
                    Join Community
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-[1.5rem] border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to log out? You'll need to sign in again to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
