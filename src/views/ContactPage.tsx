import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to send message');

            setSubmitted(true);
            toast({
                title: "Message Sent",
                description: "Thank you for contacting us. We will respond shortly.",
            });

            // Success reset or redirect? Let's show success state
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send message. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    return (
        <div className="min-h-screen pt-32 md:pt-40 pb-12 bg-background animate-fade-in font-sans">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight-premium">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                        Have questions about our data or partnership opportunities? We're here to help.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        {/* Office Card */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                Corporate Office
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                EquiBharat Insights Pvt Ltd.<br />
                                14th Floor, Innovation Tower,<br />
                                Bandra Kurla Complex (BKC),<br />
                                Mumbai, Maharashtra 400051
                            </p>
                        </div>

                        {/* Direct Lines Card */}
                        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                Direct Lines
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <Mail className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">General Inquiries</p>
                                        <a href="mailto:info@equibharat.com" className="text-base font-medium hover:text-primary transition-colors">info@equibharat.com</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <Phone className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Support</p>
                                        <a href="tel:+912212345678" className="text-base font-medium hover:text-primary transition-colors">+91 22 1234 5678</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card border border-border p-8 rounded-2xl shadow-sm relative overflow-hidden">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 animate-in zoom-in-95 duration-300">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-bold">Message Received</h2>
                                <p className="text-muted-foreground max-w-[280px]">
                                    Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.
                                </p>
                                <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
                                    Send another message
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1" htmlFor="firstName">First Name</label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="bg-accent/30 border-border focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground ml-1" htmlFor="lastName">Last Name</label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="bg-accent/30 border-border focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1" htmlFor="email">Email Address</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="bg-accent/30 border-border focus:ring-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1" htmlFor="subject">Subject</label>
                                    <Input
                                        id="subject"
                                        placeholder="Partnership Opportunity"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="bg-accent/30 border-border focus:ring-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1" htmlFor="message">How can we help?</label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us a bit about your inquiry..."
                                        className="min-h-[120px] bg-accent/30 border-border focus:ring-primary resize-none"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full h-12 gap-2 text-base font-bold shadow-lg shadow-primary/20" disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                    {loading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
