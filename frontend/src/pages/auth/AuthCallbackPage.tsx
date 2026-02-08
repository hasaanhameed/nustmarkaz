import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';

const VALID_NUST_DOMAINS = [
    'seecs.edu.pk',
    'smme.edu.pk',
    'scme.edu.pk',
    'asab.edu.pk',
    'nbs.edu.pk',
    's3h.edu.pk',
    'sns.edu.pk',
    'sada.edu.pk',
    'sines.edu.pk',
    'scee.edu.pk',
    'iese.edu.pk',
    'igis.edu.pk',
    'uspcase.edu.pk',
    'nust.edu.pk'
];

export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    const addDebugLog = (message: string) => {
        console.log(message);
        setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    };

    useEffect(() => {
        const handleCallback = async () => {
            try {
                addDebugLog('🚀 Starting auth callback handling...');
                addDebugLog(`📍 Current URL: ${window.location.href}`);
                addDebugLog(`📍 Location search: ${location.search}`);
                addDebugLog(`📍 Location hash: ${location.hash}`);

                // Wait a moment for Supabase to process the URL fragments
                await new Promise(resolve => setTimeout(resolve, 500));

                // Get the session from the URL
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                addDebugLog(`🔐 Session retrieved: ${session ? 'Yes' : 'No'}`);

                if (sessionError) {
                    addDebugLog(`❌ Session error: ${sessionError.message}`);
                    throw sessionError;
                }

                if (!session) {
                    addDebugLog('❌ No session found after callback');
                    throw new Error('No session found. Please try signing in again.');
                }

                const userEmail = session.user?.email;
                addDebugLog(`📧 User email: ${userEmail}`);

                if (!userEmail) {
                    throw new Error('No email found in session');
                }

                // Verify NUST email domain
                const domain = userEmail.split('@')[1];
                addDebugLog(`🔍 Email domain: ${domain}`);

                if (!VALID_NUST_DOMAINS.includes(domain)) {
                    addDebugLog(`❌ Invalid domain: ${domain}`);
                    await supabase.auth.signOut();
                    throw new Error(`Only NUST email addresses are allowed. You used: ${userEmail}`);
                }

                addDebugLog('✅ Valid NUST email confirmed');

                // Store session
                localStorage.setItem('supabase_session', JSON.stringify(session));
                localStorage.setItem('pending_email', userEmail);
                addDebugLog('💾 Session stored in localStorage');

                // Check if user already has backend token
                const backendToken = localStorage.getItem('access_token');

                if (backendToken) {
                    addDebugLog('✅ Backend token found, redirecting to dashboard');
                    navigate('/dashboard', { replace: true });
                } else {
                    addDebugLog('📝 No backend token, redirecting to complete profile');
                    navigate('/auth/complete-profile', { replace: true });
                }

            } catch (err: any) {
                addDebugLog(`❌ Error: ${err.message}`);
                console.error('Auth callback error:', err);
                setError(err.message || 'Authentication failed');
                setLoading(false);
            }
        };

        handleCallback();
    }, [navigate, location]);

    if (loading) {
        return (
            <Layout>
                <section className="container-custom py-16">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Signing you in...</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Verifying your NUST account
                            </p>

                            {/* Debug info - remove in production */}
                            {process.env.NODE_ENV === 'development' && debugInfo.length > 0 && (
                                <div className="mt-8 text-left max-w-2xl mx-auto">
                                    <details className="text-xs">
                                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                            Debug Logs ({debugInfo.length})
                                        </summary>
                                        <div className="mt-2 p-4 bg-muted rounded-lg overflow-auto max-h-60">
                                            {debugInfo.map((log, i) => (
                                                <div key={i} className="font-mono text-xs mb-1">
                                                    {log}
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="container-custom py-16">
                <div className="max-w-md mx-auto">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                        <h1 className="text-2xl font-bold text-destructive mb-4">
                            Sign In Failed
                        </h1>
                        <p className="text-muted-foreground mb-6">{error}</p>

                        {/* Debug info - remove in production */}
                        {process.env.NODE_ENV === 'development' && debugInfo.length > 0 && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                    View Debug Logs
                                </summary>
                                <div className="mt-2 p-4 bg-muted rounded-lg overflow-auto max-h-60 text-xs">
                                    {debugInfo.map((log, i) => (
                                        <div key={i} className="font-mono mb-1">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}

                        <button
                            onClick={() => navigate('/auth/google')}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        </Layout>
    );
}