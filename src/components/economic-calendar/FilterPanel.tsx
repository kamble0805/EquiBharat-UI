import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSources: string[];
    selectedCategories: string[];
    selectedImpact: string[];
    selectedKeywords: string[];
    availableKeywords: string[];
    availableSectors: string[];
    onSourceToggle: (source: string) => void;
    onCategoryToggle: (category: string) => void;
    onImpactToggle: (impact: string) => void;
    onKeywordToggle: (keyword: string) => void;
    onClearAll: () => void;
}

const SOURCES = [
    "RBI", "RBI Notifications", "SEBI", "BSE", "MOSPI", "MCA",
    "Ministry of Finance", "Ministry of Commerce", "Ministry of Agriculture",
    "Ministry of Petroleum", "Ministry of Health", "Consumer Affairs",
    "PIB", "DIPAM", "DFS", "DGFT", "NITI Aayog",
    "MCX", "NCDEX", "IMD",
    "ET Commodities", "ET Markets", "GoldSilver.com", "OilPrice.com",
    "IMF", "US Federal Reserve"
];

const CATEGORIES = [
    "Monetary Policy", "Banking Regulation", "Regulatory Updates",
    "Corporate Announcements", "Corporate Law", "Market Announcements",
    "Fiscal Policy", "Trade Policy", "Foreign Trade", "Disinvestment",
    "Financial Services", "Economic Planning", "Government Announcements",
    "Economic Data", "GDP", "Inflation", "Industrial Production",
    "Commodity Exchange", "Agri Commodities", "Precious Metals",
    "Oil & Gas", "Energy", "Agriculture", "Food & Distribution", "Weather",
    "Health Policy", "Market News", "Global Economy", "Global Monetary Policy", "Trade"
];

const PRIMARY_MARKETS = ["Stock", "Commodities", "Indices"];

const IMPACT_LEVELS = ["high", "medium", "low"];

export const FilterPanel = ({
    isOpen,
    onClose,
    selectedSources,
    selectedCategories,
    selectedImpact,
    selectedKeywords,
    availableKeywords,
    availableSectors,
    onSourceToggle,
    onCategoryToggle,
    onImpactToggle,
    onKeywordToggle,
    onClearAll,
}: FilterPanelProps) => {
    if (!isOpen) return null;

    const totalFilters = selectedSources.length + selectedCategories.length + selectedImpact.length + selectedKeywords.length;

    return (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-all duration-300" onClick={onClose}>
            <div
                className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-background/90 backdrop-blur-xl border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        {totalFilters > 0 && (
                            <Badge variant="default" className="rounded-full">
                                {totalFilters}
                            </Badge>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-160px)]">
                    <div className="p-4 sm:p-6 space-y-6">
                        {/* Primary Market Selection */}
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                            <h3 className="font-semibold text-sm mb-3 text-primary">Market Type</h3>
                            <div className="flex flex-wrap gap-2">
                                {PRIMARY_MARKETS.map((market) => (
                                    <Badge
                                        key={market}
                                        variant={selectedCategories.includes(market) ? "default" : "outline"}
                                        className="cursor-pointer transition-smooth text-sm py-2 px-4 shadow-sm hover:shadow-md"
                                        onClick={() => onCategoryToggle(market)}
                                    >
                                        {market}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-sm">Source</h3>
                                {selectedSources.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">{selectedSources.length} selected</Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {SOURCES.map((source) => (
                                    <Badge
                                        key={source}
                                        variant={selectedSources.includes(source) ? "default" : "outline"}
                                        className="cursor-pointer transition-smooth text-xs sm:text-sm py-1.5 px-2.5"
                                        onClick={() => onSourceToggle(source)}
                                    >
                                        {source}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-sm">Category</h3>
                                {selectedCategories.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">{selectedCategories.length} selected</Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((category) => (
                                    <Badge
                                        key={category}
                                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                                        className="cursor-pointer transition-smooth text-xs sm:text-sm py-1.5 px-2.5"
                                        onClick={() => onCategoryToggle(category)}
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {availableKeywords.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-sm text-primary">Market Keywords</h3>
                                        <Badge variant="outline" className="text-[10px] bg-primary/5 uppercase tracking-tighter">AI Derived</Badge>
                                    </div>
                                    {selectedKeywords.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">{selectedKeywords.length} selected</Badge>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableKeywords.slice(0, 30).map((kw) => (
                                        <Badge
                                            key={kw}
                                            variant={selectedKeywords.includes(kw) ? "default" : "outline"}
                                            className="cursor-pointer transition-smooth text-[11px] py-1.5 px-2.5 border-primary/20"
                                            onClick={() => onKeywordToggle(kw)}
                                        >
                                            #{kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {availableSectors.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium text-sm text-primary">Affected Sectors</h3>
                                    {selectedCategories.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">Dynamic</Badge>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableSectors.map((sector) => (
                                        <Badge
                                            key={sector}
                                            variant={selectedCategories.includes(sector) ? "default" : "outline"}
                                            className="cursor-pointer transition-smooth text-[11px] py-1.5 px-2.5 border-primary/20"
                                            onClick={() => onCategoryToggle(sector)}
                                        >
                                            {sector}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-sm">Impact Level</h3>
                                {selectedImpact.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">{selectedImpact.length} selected</Badge>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {IMPACT_LEVELS.map((impact) => (
                                    <Badge
                                        key={impact}
                                        variant={selectedImpact.includes(impact) ? "default" : "outline"}
                                        className="cursor-pointer transition-smooth capitalize text-sm py-2 px-4"
                                        onClick={() => onImpactToggle(impact)}
                                    >
                                        {impact}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-border bg-card">
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClearAll} className="flex-1">
                            Clear All
                        </Button>
                        <Button onClick={onClose} className="flex-1">
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
