import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
    selectedRange: string;
    onRangeChange: (range: string) => void;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
}

const ranges = ["Last 30 Days", "Last Month", "Last Week", "Yesterday", "Today", "This Week"];

export const DateRangeFilter = ({ selectedRange, onRangeChange, date, setDate }: DateRangeFilterProps) => {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Desktop: Show all buttons */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
                {ranges.map((range) => (
                    <Button
                        key={range}
                        variant={selectedRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => onRangeChange(range)}
                        className="rounded-full text-xs lg:text-sm"
                    >
                        {range}
                    </Button>
                ))}
            </div>

            {/* Custom Date Picker */}
            <div className={cn("grid gap-2", selectedRange === "Custom" && "border-primary border rounded-md")}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            size="sm"
                            className={cn(
                                "w-[240px] justify-start text-left font-normal rounded-full",
                                !date && "text-muted-foreground",
                                selectedRange === "Custom" && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                            )}
                            onClick={() => onRangeChange("Custom")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(newDate) => {
                                setDate(newDate);
                                if (newDate) onRangeChange("Custom");
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Mobile/Tablet: Dropdown (Hidden if custom is selected to avoid clutter, or kept simple) */}
            <div className="md:hidden w-full">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{selectedRange}</span>
                            </div>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-sm">
                        {ranges.map((range) => (
                            <DropdownMenuItem
                                key={range}
                                onClick={() => onRangeChange(range)}
                                className={selectedRange === range ? "bg-primary/10 text-primary font-medium" : ""}
                            >
                                {range}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                            onClick={() => onRangeChange("Custom")}
                            className={selectedRange === "Custom" ? "bg-primary/10 text-primary font-medium" : ""}
                        >
                            Custom Range
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
