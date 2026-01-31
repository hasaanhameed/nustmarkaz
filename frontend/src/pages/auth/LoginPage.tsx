import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ModernBackground } from "@/components/ui/modern-background";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { login } from "@/api/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    // Simple but effective regex for valid emails, specifically targeting standard NUST patterns
    // Does not allow starting with numbers if it's a name, etc.
    const re = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g. name@nust.edu.pk). Numbers-only or random strings are not allowed.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(email, password);
      localStorage.setItem("access_token", data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center p-6 md:p-12">
        <ModernBackground />

        <div className="w-full max-w-md animate-entrance">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/40 p-10 md:p-16 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative z-10">
              <div className="flex justify-center mb-10">
                <Link to="/" className="transition-transform hover:scale-110 duration-500">
                  <Logo size="lg" />
                </Link>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-5xl font-black text-foreground mb-4 tracking-[-0.04em]">Welcome Back.</h1>
                <p className="text-muted-foreground font-bold text-lg opacity-70">Sign in to your campus account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">Email</Label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.id@nust.edu.pk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 pl-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">Password</Label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-primary" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pl-12 pr-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm font-bold text-red-500 text-center">{error}</p>}

                <Button type="submit" className="w-full h-16 text-xl font-black rounded-3xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : "Sign In"}
                </Button>
              </form>

              <p className="text-center text-base mt-10 font-bold text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}