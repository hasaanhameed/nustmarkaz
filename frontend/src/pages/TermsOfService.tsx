import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsOfService() {
    return (
        <Layout>
            <div className="container-custom py-12 max-w-4xl">
                <div className="text-center mb-12 animate-entrance">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Terms of Service</h1>
                    <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <Card className="animate-entrance border-none shadow-xl bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-primary">Rules & Regulations</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-blue max-w-none text-foreground/80 leading-relaxed">
                        <ScrollArea className="h-[600px] pr-4">
                            <div className="space-y-6">
                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">1. Acceptance of Terms</h3>
                                    <p>
                                        By accessing and using Nustmarkaz ("the Platform"), you agree to be bound by these Terms of Service.
                                        If you do not agree to these terms, please do not use our services. This Platform is intended for use by the NUST community.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">2. User Accounts</h3>
                                    <p>
                                        To access certain features of the Platform, you must register for an account using your university credentials.
                                        You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">3. Marketplace & Listings</h3>
                                    <p>
                                        Users can list items for sale, donation, or exchange. You agree that:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 mt-2">
                                        <li>All items listed are legal and abide by university policies.</li>
                                        <li>Descriptions and images accurately represent the item.</li>
                                        <li>You have the right to sell or transfer the items you list.</li>
                                        <li>Nustmarkaz is not a party to transactions between buyers and sellers and is not responsible for the quality, safety, or legality of items listed.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">4. Carpooling & Trips</h3>
                                    <p>
                                        Users may arrange shared rides and trips. You acknowledge that:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 mt-2">
                                        <li>Participation is at your own risk.</li>
                                        <li>Nustmarkaz does not vet drivers or vehicles.</li>
                                        <li>You should exercise caution and common sense when travelling with others.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">5. Prohibited Conduct</h3>
                                    <p>
                                        You agree not to engage in harassing, abusive, or harmful behavior. Spamming, scamming, or posting offensive content will result in immediate account suspension.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">6. Limitation of Liability</h3>
                                    <p>
                                        Nustmarkaz and its administrators shall not be liable for any indirect, incidental, special, consequential or punitive damages,
                                        including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-2">7. Changes to Terms</h3>
                                    <p>
                                        We reserve the right to modify these terms at any time. Your continued use of the Platform after any such change constitutes your acceptance of the new Terms of Service.
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
