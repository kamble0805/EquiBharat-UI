import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AVAILABLE_TOPICS = [
  'Monetary Policy',
  'Fiscal Policy',
  'Trade & Commerce',
  'Banking & Finance',
  'Agriculture',
  'Infrastructure',
  'Technology',
  'Energy & Environment',
  'Healthcare',
  'Education',
  'Defense',
  'Real Estate',
];

const AVAILABLE_SECTORS = [
  'Banking',
  'IT Services',
  'Pharmaceuticals',
  'Automobiles',
  'FMCG',
  'Metals',
  'Oil & Gas',
  'Telecom',
  'Power',
  'Chemicals',
  'Textiles',
  'Aviation',
];

export const ContentPreferencesSection = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    topics: ['Monetary Policy', 'Banking & Finance', 'Technology'],
    sectors: ['Banking', 'IT Services', 'Pharmaceuticals'],
    showBreakingNews: true,
    showAnalysis: true,
    showOpinion: false,
    autoPlayVideos: false,
  });

  const toggleTopic = (topic: string) => {
    setPreferences((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const toggleSector = (sector: string) => {
    setPreferences((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const handleToggle = (field: string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const handleSave = () => {
    toast({
      title: 'Content preferences saved',
      description: 'Your content preferences have been updated.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Topics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Topics of Interest</CardTitle>
          <CardDescription>
            Select topics to personalize your news feed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TOPICS.map((topic) => (
              <Badge
                key={topic}
                variant={preferences.topics.includes(topic) ? 'default' : 'outline'}
                className={`cursor-pointer transition-colors ${
                  preferences.topics.includes(topic)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'hover:bg-accent'
                }`}
                onClick={() => toggleTopic(topic)}
              >
                {topic}
                {preferences.topics.includes(topic) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {preferences.topics.length} topics selected
          </p>
        </CardContent>
      </Card>

      {/* Sectors */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Market Sectors</CardTitle>
          <CardDescription>
            Follow specific market sectors for targeted updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SECTORS.map((sector) => (
              <Badge
                key={sector}
                variant={preferences.sectors.includes(sector) ? 'default' : 'outline'}
                className={`cursor-pointer transition-colors ${
                  preferences.sectors.includes(sector)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'hover:bg-accent'
                }`}
                onClick={() => toggleSector(sector)}
              >
                {sector}
                {preferences.sectors.includes(sector) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {preferences.sectors.length} sectors selected
          </p>
        </CardContent>
      </Card>

      {/* Content Types */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Content Types</CardTitle>
          <CardDescription>
            Choose what types of content to display
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showBreakingNews" className="text-sm font-medium cursor-pointer">
                Breaking News
              </Label>
              <p className="text-xs text-muted-foreground">
                Show breaking news alerts prominently
              </p>
            </div>
            <Switch
              id="showBreakingNews"
              checked={preferences.showBreakingNews}
              onCheckedChange={() => handleToggle('showBreakingNews')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showAnalysis" className="text-sm font-medium cursor-pointer">
                Analysis & Research
              </Label>
              <p className="text-xs text-muted-foreground">
                Include in-depth analysis articles
              </p>
            </div>
            <Switch
              id="showAnalysis"
              checked={preferences.showAnalysis}
              onCheckedChange={() => handleToggle('showAnalysis')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showOpinion" className="text-sm font-medium cursor-pointer">
                Opinion & Commentary
              </Label>
              <p className="text-xs text-muted-foreground">
                Show opinion pieces and editorials
              </p>
            </div>
            <Switch
              id="showOpinion"
              checked={preferences.showOpinion}
              onCheckedChange={() => handleToggle('showOpinion')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Media Preferences</CardTitle>
          <CardDescription>
            Configure how media content is displayed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoPlayVideos" className="text-sm font-medium cursor-pointer">
                Auto-play Videos
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically play video content (muted)
              </p>
            </div>
            <Switch
              id="autoPlayVideos"
              checked={preferences.autoPlayVideos}
              onCheckedChange={() => handleToggle('autoPlayVideos')}
            />
          </div>
          <div className="pt-6 flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
