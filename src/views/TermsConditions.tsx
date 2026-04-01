import React from 'react';

const TermsConditions = () => {
    return (
        <div className="min-h-screen pt-32 md:pt-40 pb-12 bg-background animate-fade-in">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground tracking-tight-premium">Terms and Conditions</h1>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using EquiBharat, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">2. Financial Disclaimer</h2>
                        <p className="mb-2 font-medium text-warning">
                            EquiBharat is an informational platform. We do not provide financial advice.
                        </p>
                        <p>
                            All content provided is for informational and educational purposes only. You should not construe any such information as legal, tax, investment, or financial advice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">3. Use of Data</h2>
                        <p>
                            The market data and news provided are aggregated from various sources. We do not guarantee the accuracy, completeness, or timeliness of this data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">4. User Conduct</h2>
                        <p>
                            You agree not to misuse our services or help anyone else do so. This includes attempting to access the service using a method other than the interface and instructions that we provide.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
                        <p>
                            The content, features, and functionality are and will remain the exclusive property of EquiBharat and its licensors.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-border mt-8">
                        <p className="text-sm" suppressHydrationWarning>Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
