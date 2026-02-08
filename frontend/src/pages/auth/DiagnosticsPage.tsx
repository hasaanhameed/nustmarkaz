import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';

export default function DiagnosticsPage() {
    const [info, setInfo] = useState<any>(null);
    const [testResult, setTestResult] = useState<string>('');

    useEffect(() => {
        const gatherInfo = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            setInfo({
                // URL Information
                currentUrl: window.location.href,
                origin: window.location.origin,
                hostname: window.location.hostname,
                protocol: window.location.protocol,

                // Calculated URLs
                callbackUrl: `${window.location.origin}/auth/callback`,

                // Session Info
                hasSession: !!session,
                userEmail: session?.user?.email || 'No session',

                // Storage
                localStorage: {
                    access_token: localStorage.getItem('access_token') ? 'Present' : 'Missing',
                    supabase_session: localStorage.getItem('supabase_session') ? 'Present' : 'Missing',
                    pending_email: localStorage.getItem('pending_email') || 'Not set',
                },

                // Browser info
                userAgent: navigator.userAgent,
            });
        };

        gatherInfo();
    }, []);

    const testGoogleAuth = async () => {
        setTestResult('Testing...');
        try {
            const redirectUrl = `${window.location.origin}/auth/callback`;
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                }
            });

            if (error) throw error;
            setTestResult(`✅ OAuth initiated. Redirect URL: ${redirectUrl}`);
        } catch (err: any) {
            setTestResult(`❌ Error: ${err.message}`);
        }
    };

    const clearStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <Layout>
            <section className="container-custom py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Auth Diagnostics</h1>

                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">System Information</h2>
                        {info ? (
                            <pre className="bg-muted p-4 rounded overflow-auto text-xs">
                                {JSON.stringify(info, null, 2)}
                            </pre>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </Card>

                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={testGoogleAuth}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Test Google OAuth
                            </button>

                            <button
                                onClick={() => window.location.href = '/auth/google'}
                                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Go to Google Login Page
                            </button>

                            <button
                                onClick={() => window.location.href = '/auth/callback'}
                                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                            >
                                Go to Callback Page
                            </button>

                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    alert('Signed out from Supabase');
                                }}
                                className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            >
                                Sign Out (Supabase Only)
                            </button>

                            <button
                                onClick={clearStorage}
                                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Clear All Storage & Reload
                            </button>
                        </div>

                        {testResult && (
                            <div className="mt-4 p-3 bg-muted rounded">
                                <p className="text-sm font-mono">{testResult}</p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Expected Configuration</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <strong>Supabase Site URL should be:</strong>
                                <code className="block bg-muted p-2 rounded mt-1">
                                    {window.location.origin}
                                </code>
                            </div>

                            <div>
                                <strong>Supabase Redirect URLs should include:</strong>
                                <ul className="list-disc list-inside bg-muted p-2 rounded mt-1">
                                    <li><code>https://www.nustmarkaz.com/auth/callback</code></li>
                                    <li><code>https://nustmarkaz.com/auth/callback</code></li>
                                    <li><code>http://localhost:5173/auth/callback</code></li>
                                    <li><code>http://localhost:3000/auth/callback</code></li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>
        </Layout>
    );
}