import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ModernBackground } from "@/components/ui/modern-background";
import { cn } from "@/lib/utils";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { createUser } from "@/api/user";

const departments = [
  "SEECS - School of Electrical Engineering & Computer Science",
  "SMME - School of Mechanical & Manufacturing Engineering",
  "SCME - School of Chemical & Materials Engineering",
  "SNS - School of Natural Sciences",
  "S3H - School of Social Sciences & Humanities",
  "NICE - NUST Institute of Civil Engineering",
  "NBS - NUST Business School",
  "ASAB - Atta-ur-Rahman School of Applied Biosciences",
  "SADA - School of Art, Design & Architecture",
  "Other",
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!formData.department) {
      newErrors.department = "Please select your department";
    }

    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== FORM SUBMITTED ===");
    console.log("Form data:", formData);
    console.log("Agree terms:", agreeTerms);

    const isValid = validateForm();
    console.log("Validation result:", isValid);

    if (isValid) {
      console.log("Validation passed! Calling API...");
      setIsLoading(true);
      try {
        const result = await createUser({
          username: formData.name,
          email: formData.email,
          department: formData.department,
          password: formData.password,
        });
        console.log("API Success:", result);
        navigate("/login");
      } catch (err: any) {
        console.error("API Error:", err);
        console.error("Error response:", err.response?.data);
        const errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Failed to create account. Please try again.";
        setErrors({ api: errorMessage });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Validation FAILED - not calling API");
      console.log("Current errors:", errors);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center p-6 md:p-12">
        <ModernBackground />

        <div className="w-full max-w-xl animate-entrance">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/40 p-10 md:p-16 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-black text-foreground mb-4 tracking-[-0.04em]">Join the Hub.</h1>
                <p className="text-muted-foreground font-bold text-lg opacity-70">Connect with your campus community.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">Full Name</Label>
                    <div className="relative group/input">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-primary" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Muhammad Ali"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={cn(
                          "h-14 pl-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all",
                          errors.name && "border-red-500 bg-red-50/10"
                        )}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && <p className="text-xs font-bold text-red-500 ml-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">NUST Email</Label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-primary" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your NUST Email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={cn(
                          "h-14 pl-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all",
                          errors.email && "border-red-500 bg-red-50/10"
                        )}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="department" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleChange("department", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={cn(
                      "h-14 rounded-2xl bg-white/50 border-white/40 focus:bg-white transition-all",
                      errors.department && "border-red-500"
                    )}>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept} className="rounded-xl my-1 mx-1 hover:bg-secondary">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-xs font-bold text-red-500 ml-1">{errors.department}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">Password</Label>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-primary" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className={cn(
                          "h-14 pl-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all",
                          errors.password && "border-red-500 bg-red-50/10"
                        )}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.password && <p className="text-xs font-bold text-red-500 ml-1">{errors.password}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest pl-1 opacity-50">Confirm</Label>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within/input:text-primary" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        className={cn(
                          "h-14 pl-12 rounded-2xl bg-white/50 border-white/40 focus:bg-white focus:ring-primary/20 transition-all",
                          errors.confirmPassword && "border-red-500 bg-red-50/10"
                        )}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-xs font-bold text-red-500 ml-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-secondary/20 p-6 rounded-3xl border border-border/10">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => {
                      setAgreeTerms(checked as boolean);
                      if (errors.terms && checked) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.terms;
                          return newErrors;
                        });
                      }
                    }}
                    disabled={isLoading}
                    className="mt-1 rounded-md"
                  />
                  <Label htmlFor="terms" className="text-sm font-bold text-muted-foreground cursor-pointer leading-relaxed">
                    I agree to the <Link to="#" className="text-primary hover:underline">Terms</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-xs font-bold text-red-500 ml-1">{errors.terms}</p>
                )}

                {errors.api && <p className="text-sm font-bold text-red-500 text-center">{errors.api}</p>}

                <Button type="submit" className="w-full h-16 text-xl font-black rounded-3xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-base mt-10 font-bold text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}