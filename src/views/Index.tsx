import { CalendarWidget } from '@/components/widgets/CalendarWidget';
import { NewsWidget } from '@/components/widgets/NewsWidget';

const Index = () => {
  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            India Economic Intelligence
          </h1>
          <p className="text-muted-foreground">
            Calendar-driven analysis. Factual. Structured.
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
