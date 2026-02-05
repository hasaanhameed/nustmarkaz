import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import api from '@/api/api';

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
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Give Supabase a moment to process the callback
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) throw sessionError;
                
                if (!session) {
                    throw new Error('No session found. Please try signing in again.');
                }

                const userEmail = session.user?.email;
                
                if (!userEmail) {
                    throw new Error('No email found in session');
                }

                // Verify NUST email domain
                const domain = userEmail.split('@')[1];
                if (!VALID_NUST_DOMAINS.includes(domain)) {
                    await supabase.auth.signOut();
                    throw new Error(`Only NUST email addresses are allowed. You used: ${userEmail}`);
                }

                // Check if user exists in backend by trying to login
                try {
                    // Try to get user info from backend using email
                    // Since we don't have a check endpoint, we'll use a different approach
                    // Store session and navigate to complete profile
                    // The complete profile page will handle user creation
                    localStorage.setItem('supabase_session', JSON.stringify(session));
                    navigate('/auth/complete-profile');
                } catch (err) {
                    // If user doesn't exist, go to complete profile
                    localStorage.setItem('supabase_session', JSON.stringify(session));
                    navigate('/auth/complete-profile');
                }
            } catch (err: any) {
                console.error('Auth callback error:', err);
                setError(err.message || 'Authentication failed');
                setLoading(false);
            }
        };

        handleCallback();
    }, [navigate]);

    if (loading) {
        return (
            <Layout>
                <section className="container-custom py-16">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Signing you in...</p>
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