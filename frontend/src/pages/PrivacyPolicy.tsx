import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicy() {
    return (
        <Layout>
            <div className="container-custom py-12 max-w-4xl">
                <div className="text-center mb-12 animate-entrance">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Privacy Policy</h1>
                    <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <Card className="animate-entrance border-none shadow-xl bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-primary">Your Privacy Matters</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-blue max-w-none text-foreground/80 leading-relaxed">
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">1. Introduction</h3>
                                    <p>
                                        Welcome to Nustmarkaz. We respect your privacy and are committed to protecting your personal data.
                                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                                        (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">2. Information We Collect</h3>
                                    <p>
                                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 mt-2">
                                        <li><strong>Identity Data:</strong> includes username or similar identifier, and department.</li>
                                        <li><strong>Contact Data:</strong> includes email address and telephone numbers provided for listings.</li>
                                        <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products or services you have purchased from us.</li>
                                        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">3. How We Use Your Data</h3>
                                    <p>
                                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 mt-2">
                                        <li>To register you as a new user.</li>
                                        <li>To facilitate the marketplace, carpooling, trips, and donation features.</li>
                                        <li>To manage our relationship with you.</li>
                                        <li>To improve our website, products/services, marketing and customer relationships.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">4. Data Security</h3>
                                    <p>
                                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                        In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">5. Your Legal Rights</h3>
                                    <p>
                                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">6. Contact Us</h3>
                                    <p>
                                        If you have any questions about this privacy policy or our privacy practices, please contact the Nustmarkaz administration team.
                                    </p>
                                </section>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
