'use client';

import { useState } from 'react';
import { Check, X, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PricingPage = () => {
    const [isYearly, setIsYearly] = useState(true);

    const plans = [
        {
            name: "Basic",
            description: "Essential market news for individual traders.",
            price: isYearly ? "₹999" : "₹199",
            period: isYearly ? "/year" : "/month",
            features: [
                "Daily Market Pulse",
                "Basic News Feed",
                "End-of-day Summary",
                "Mobile App Access"
            ],
            missing: [
                "Real-time Alerts",
                "Deep-dive Analysis",
                "Institutional Research",
                "API Access"
            ],
            cta: "Get Started",
            popular: false,
            icon: Zap
        },
        {
            name: "Pro",
            description: "Advanced insights for serious investors.",
            price: isYearly ? "₹4,999" : "₹599",
            period: isYearly ? "/year" : "/month",
            features: [
                "Everything in Basic",
                "Real-time Market Alerts",
                "Deep-dive Sector Analysis",
                "Unlimited Article Access",
                "Priority Support",
                "Ad-free Experience"
            ],
            missing: [
                "Institutional Research",
                "API Access"
            ],
            cta: "Upgrade to Pro",
            popular: true,
            icon: Globe
        },
        {
            name: "Institutional",
            description: "Comprehensive data for firms and professionals.",
            price: isYearly ? "₹19,999" : "₹2,499",
            period: isYearly ? "/year" : "/month",
            features: [
                "Everything in Pro",
                "Institutional Research Reports",
                "Direct Analyst Access",
                "Full API Access",
                "Multi-user License (up to 5)",
                "Custom Dashboards"
            ],
            missing: [],
            cta: "Contact Sales",
            popular: false,
            icon: Shield
        }
    ];

    return (
        <div className="min-h-screen pt-28 md:pt-40 pb-20 bg-background animate-fade-in">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Invest in Your <span className="text-primary">Financial Edge</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Choose the plan that fits your trading style. Unlock real-time data, expert analysis, and exclusive reports.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
                        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                        <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                            Yearly <span className="text-primary text-xs ml-1 font-bold">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.name}
                            className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${plan.popular
                                ? "border-primary shadow-lg md:scale-105 z-10 bg-card/50 backdrop-blur-sm"
                                : "border-border bg-card/30"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold shadow-sm">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader>
                                <div className="p-3 bg-primary/10 w-fit rounded-lg mb-4">
                                    <plan.icon className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-muted-foreground mt-2">
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="mb-8">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">{plan.period}</span>
                                </div>

                                <div className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3 text-sm">
                                            <div className="mt-1 bg-green-500/10 p-0.5 rounded-full">
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                    {plan.missing.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/50">
                                            <div className="mt-1">
                                                <X className="w-3.5 h-3.5" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className={`w-full font-bold ${plan.popular
                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                        : "variant-outline"
                                        }`}
                                    variant={plan.popular ? "default" : "outline"}
                                >
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Enterprise / Custom Section */}
                <div className="mt-20 text-center bg-secondary/20 rounded-2xl p-8 md:p-12 border border-border">
                    <h3 className="text-2xl font-bold mb-4">Need a custom solution for your organization?</h3>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        We offer tailored data feeds, white-labeling options, and dedicated support for financial institutions and media houses.
                    </p>
                    <Button variant="outline" size="lg" className="font-semibold">
                        Contact Enterprise Sales
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
