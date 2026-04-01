import * as React from "react";
import {
    CalendarIcon,
    Newspaper,
    TrendingUp,
    LayoutDashboard,
    FileText,
    User,
    Sun,
    Moon,
    Laptop,
    Search,
    Building2,
    PieChart
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "@/components/theme-provider";

interface SearchCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
    const router = useRouter();
    const { setTheme } = useTheme();

    const runCommand = React.useCallback((command: () => unknown) => {
        onOpenChange(false);
        command();
    }, [onOpenChange]);

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search EquiBharat Intelligence, stocks, news..." />
            <CommandList className="pb-2">
                <CommandEmpty>
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm">
                        <Search className="w-8 h-8 mb-2 opacity-50" />
                        <p>No results found.</p>
                        <p className="text-xs">Try searching for 'Nifty', 'Bank', or 'News'</p>
                    </div>
                </CommandEmpty>

                <CommandGroup heading="Stocks & Indices">
                    <CommandItem value="Reliance Industries RIL" onSelect={() => runCommand(() => router.push("/market-pulse"))}>
                        <Building2 className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Reliance Industries (RIL)</span>
                        <span className="ml-auto text-xs text-green-500 font-mono">+1.2%</span>
                    </CommandItem>
                    <CommandItem value="HDFC Bank" onSelect={() => runCommand(() => router.push("/market-pulse"))}>
                        <Building2 className="mr-2 h-4 w-4 text-blue-800" />
                        <span>HDFC Bank</span>
                        <span className="ml-auto text-xs text-red-500 font-mono">-0.4%</span>
                    </CommandItem>
                    <CommandItem value="Tata Consultancy Services TCS" onSelect={() => runCommand(() => router.push("/market-pulse"))}>
                        <Building2 className="mr-2 h-4 w-4 text-blue-400" />
                        <span>TCS</span>
                        <span className="ml-auto text-xs text-green-500 font-mono">+0.8%</span>
                    </CommandItem>
                    <CommandItem value="Nifty 50 Index" onSelect={() => runCommand(() => router.push("/market-pulse"))}>
                        <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                        <span>Nifty 50</span>
                        <span className="ml-auto text-xs text-green-500 font-mono">+120.50</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Sectors & Topics">
                    <CommandItem value="Bank Nifty Banking Finance" onSelect={() => runCommand(() => router.push("/news"))}>
                        <PieChart className="mr-2 h-4 w-4 text-orange-500" />
                        <span>Banking & Finance</span>
                    </CommandItem>
                    <CommandItem value="IT Technology" onSelect={() => runCommand(() => router.push("/news"))}>
                        <PieChart className="mr-2 h-4 w-4 text-purple-500" />
                        <span>IT Services</span>
                    </CommandItem>
                    <CommandItem value="Auto Sector" onSelect={() => runCommand(() => router.push("/news"))}>
                        <PieChart className="mr-2 h-4 w-4 text-red-500" />
                        <span>Automotive</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Navigation">
                    <CommandItem value="Market Pulse Dashboard" onSelect={() => runCommand(() => router.push("/market-pulse"))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Market Pulse</span>
                    </CommandItem>
                    <CommandItem value="News Feed Latest" onSelect={() => runCommand(() => router.push("/news"))}>
                        <Newspaper className="mr-2 h-4 w-4" />
                        <span>Latest News</span>
                    </CommandItem>
                    <CommandItem value="Economic Calendar Events" onSelect={() => runCommand(() => router.push("/calendar"))}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Economic Calendar</span>
                    </CommandItem>
                    <CommandItem value="Articles Analysis" onSelect={() => runCommand(() => router.push("/articles"))}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Research Articles</span>
                    </CommandItem>
                    <CommandItem value="User Profile Settings" onSelect={() => runCommand(() => router.push("/profile"))}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile & Settings</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Theme">
                    <CommandItem value="Light Mode" onSelect={() => runCommand(() => setTheme("light"))}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light Mode</span>
                    </CommandItem>
                    <CommandItem value="Dark Mode" onSelect={() => runCommand(() => setTheme("dark"))}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark Mode</span>
                    </CommandItem>
                    <CommandItem value="System Theme" onSelect={() => runCommand(() => setTheme("system"))}>
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>System Default</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>

            <div className="border-t px-4 py-2 text-[10px] text-muted-foreground flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="font-serif font-black uppercase tracking-widest text-[9px]">Equi<span className="italic">Bharat</span> Intelligence Hub</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="bg-background border rounded px-1">↵</span>
                    <span>to select</span>
                </div>
            </div>
        </CommandDialog>
    );
}
