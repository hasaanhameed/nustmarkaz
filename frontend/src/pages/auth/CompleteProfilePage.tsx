import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { createUser } from '@/api/user';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function CompleteProfilePage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [agreeTerms, setAgreeTerms] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;
                if (!session) {
                    navigate('/auth/google');
                    return;
                }

                setEmail(session.user?.email || '');
                setLoading(false);
            } catch (err: any) {
                console.error('Session check error:', err);
                navigate('/auth/google');
            }
        };

        checkSession();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (!department.trim()) {
            setError('Please select your department/school');
            return;
        }
        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!agreeTerms) {
            setError('You must agree to the Terms and Conditions');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            // Create user in backend
            const response = await createUser({
                username: username.trim(),
                email: email,
                department: department,
                password: password
            });

            // Store token from backend response
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
            }

            // Clear Supabase session as we're using backend auth now
            await supabase.auth.signOut();

            // Redirect to success page
            navigate('/auth/success');
        } catch (err: any) {
            console.error('Profile creation error:', err);
            setError(err.response?.data?.detail || 'Failed to create profile');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <section className="container-custom py-16">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="container-custom py-16">
                <div className="max-w-md mx-auto">
                    <Card className="p-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">
                            Complete Your Profile
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            We need a few details to set up your account
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-destructive text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email (read-only) */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-primary">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-muted text-muted-foreground"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    NUST verified email
                                </p>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-primary">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your full name"
                                    disabled={submitting}
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    required
                                />
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-primary">
                                    School/Department *
                                </label>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    disabled={submitting}
                                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    required
                                >
                                    <option value="">Select your school/department</option>
                                    <option value="SEECS">SEECS (School of Electrical Engineering & Computer Science)</option>
                                    <option value="SMME">SMME (School of Mechanical & Manufacturing Engineering)</option>
                                    <option value="SCME">SCME (School of Civil & Environmental Engineering)</option>
                                    <option value="ASAB">ASAB (School of Aerospace & Aviation)</option>
                                    <option value="NBS">NBS (Nust Business School)</option>
                                    <option value="S3H">S3H (School of Social Sciences & Humanities)</option>
                                    <option value="SNS">SNS (School of Natural Sciences)</option>
                                    <option value="SADA">SADA (School of Architecture & Design)</option>
                                    <option value="SINES">SINES (School of Interdisciplinary Engineering Sciences)</option>
                                    <option value="SCEE">SCEE (School of Chemical & Environmental Engineering)</option>
                                    <option value="IESE">IESE (Institute of Environmental Science & Engineering)</option>
                                    <option value="IGIS">IGIS (Institute of Geographic Information Systems)</option>
                                    <option value="USPCAS-E">USPCAS-E (US-Pakistan Center for Advanced Studies in Energy)</option>
                                </select>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-primary">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password (min. 6 characters)"
                                        disabled={submitting}
                                        className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-primary">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        disabled={submitting}
                                        className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="w-4 h-4 border border-border rounded bg-background text-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <label htmlFor="terms" className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I agree to the <a href="/terms" target="_blank" className="text-primary hover:underline font-medium">Terms and Conditions</a> and <a href="/privacy" target="_blank" className="text-primary hover:underline font-medium">Privacy Policy</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    'Complete Setup'
                                )}
                            </button>
                        </form>
                    </Card>
                </div>
            </section>
        </Layout >
    );
}