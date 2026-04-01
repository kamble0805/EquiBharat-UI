import { CalendarWidget } from '@/components/widgets/CalendarWidget';
import { NewsWidget } from '@/components/widgets/NewsWidget';

const Index = () => {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-2 h-2 rounded-full bg-primary" />
             <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Institutional Intelligence Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-4 tracking-tighter">
            Equi<span className="text-primary italic">Bharat</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium max-w-lg leading-relaxed">
            Advanced economic calendar-driven intelligence for the Indian market. Structured data. Factual analysis. Institutional grade terminal.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-6">
          {/* Row 1: Calendar (Full Width) */}
          <div className="w-full">
            <CalendarWidget />
          </div>

          {/* Row 2: News */}
          <div className="w-full">
            <NewsWidget compact />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
