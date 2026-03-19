import { Building2, Users, Target, Rocket, Heart, Shield } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen pt-32 md:pt-40 pb-12 bg-background animate-fade-in">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight-premium">
                        Advancing India's <span className="text-primary">Economic Narrative</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        EquiBharat is built on a simple belief: every market participant in India deserves clear, timely and reliable financial information.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="widget-card p-8 md:p-12 mb-20 bg-gradient-to-br from-card to-secondary/30 border border-primary/10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed italic">
                            "In a landscape where news moves the markets within seconds, our mission is to bring structure, speed and simplicity to the way India tracks its financial developments."
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Target className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Focus on What Matters</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Created for traders, investors and anyone who wants to stay informed about India’s economic pulse. We cut through noise and deliver the updates that shape sentiment, influence decisions and drive the nation’s financial direction.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Rocket className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Long-Term Vision</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    We aim to build India’s most trusted digital destination for market-moving news. With India’s markets evolving rapidly, our goal is to provide a dependable space that keeps pace with this growth and supports the decision-making of millions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Integrity & Clarity</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Information should not overwhelm; it should guide. Our commitment is to accuracy, transparency and a user experience that respects your time. We offer an honest, fast and intuitive news ecosystem.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Our Promise</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    EquiBharat is not just a website — it is a promise to bring India’s financial heartbeat closer to everyone who depends on it.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closing Statement */}
                <div className="text-center py-12 border-t border-border">
                    <p className="text-2xl font-serif text-foreground font-medium">
                        Equi<span className="text-primary">Bharat</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Clarity over Complexity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
