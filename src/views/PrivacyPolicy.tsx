import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen pt-32 md:pt-40 pb-12 bg-background animate-fade-in">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground tracking-tight-premium">Privacy Policy</h1>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                        <p className="mb-2">
                            We collect information you provide directly to us when you create an account, subscribe to our newsletter, or communicate with us.
                        </p>
                        <p>
                            Usage data is collected automatically when you use our service, including your IP address, browser type, and interaction with our content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use the collected data to provide, maintain, and improve our services, including personalization of market insights and delivering relevant economic news.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Security</h2>
                        <p>
                            We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
                        <p>
                            Our service may contain links to third-party websites or services (like RSS feeds) that are not owned or controlled by EquiBharat. We are not responsible for their privacy practices.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at support@equibharat.com.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-border mt-8">
                        <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
