"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Pages that have their own full-screen navigation (no global Navbar/Footer)
const STANDALONE_PAGES = ['/profile'];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isStandalone = STANDALONE_PAGES.some((p) => pathname.startsWith(p));

    return (
        <>
            <ScrollToTop />
            <div className="min-h-screen bg-background overflow-x-hidden w-full relative">
                {!isStandalone && <Navbar />}
                <main>{children}</main>
                {!isStandalone && <Footer />}
            </div>
        </>
    );
}
