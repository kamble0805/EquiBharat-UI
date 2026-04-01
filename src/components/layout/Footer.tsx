import Link from 'next/link';
import { TrendingUp, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="space-y-4 col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xl font-serif font-black tracking-tighter text-foreground">
                                Equi<span className="text-primary italic">Bharat</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Decoding India's economic landscape with data-driven insights and AI-powered analysis.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/market-pulse" className="text-muted-foreground hover:text-primary transition-colors">
                                    Market Pulse
                                </Link>
                            </li>
                            <li>
                                <Link href="/calendar" className="text-muted-foreground hover:text-primary transition-colors">
                                    Economic Calendar
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                                    News Feed
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 mt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} EquiBharat. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <span className="text-destructive">❤</span> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
