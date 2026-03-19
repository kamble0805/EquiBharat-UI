import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Download, Zap } from "lucide-react";
import Link from "next/link";

export const SubscriptionSection = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Current Plan */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Current Subscription</CardTitle>
                            <CardDescription>You are currently on the Free Basic Plan</CardDescription>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">Active</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Daily Market Pulse</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary" />
                            <span>Basic News Feed</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 opacity-50" />
                            <span>Limited Article Access</span>
                        </li>
                    </ul>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-primary/10 pt-6">
                    <p className="text-sm text-muted-foreground">Free Plan — full access during beta</p>
                </CardFooter>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment cards</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-muted p-2 rounded">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Visa ending in 4242</p>
                                <p className="text-xs text-muted-foreground">Expires 04/2028</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">+ Add New Method</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                            <span>Date</span>
                            <span>Description</span>
                            <span>Amount</span>
                            <span className="text-right">Invoice</span>
                        </div>
                        {/* Mock Data */}
                        <div className="grid grid-cols-4 text-sm py-3 border-b border-border/50 items-center">
                            <span>Dec 01, 2025</span>
                            <span>Pro Plan - Monthly</span>
                            <span>₹599.00</span>
                            <div className="text-right">
                                <Button variant="ghost" size="sm" className="h-8">
                                    <Download className="h-4 w-4 mr-2" /> PDF
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 text-sm py-3 border-b border-border/50 items-center">
                            <span>Nov 01, 2025</span>
                            <span>Pro Plan - Monthly</span>
                            <span>₹599.00</span>
                            <div className="text-right">
                                <Button variant="ghost" size="sm" className="h-8">
                                    <Download className="h-4 w-4 mr-2" /> PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
