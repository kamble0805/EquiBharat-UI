import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NotificationsSection = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    emailNews: true,
    emailMarket: true,
    emailEvents: false,
    emailDigest: true,
    pushNews: false,
    pushMarket: true,
    pushEvents: true,
    digestFrequency: 'daily',
  });

  const handleToggle = (field: string) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleFrequencyChange = (value: string) => {
    setNotifications((prev) => ({ ...prev, digestFrequency: value }));
  };

  const handleSave = () => {
    toast({
      title: 'Notification preferences saved',
      description: 'Your notification settings have been updated.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Email Notifications</CardTitle>
          <CardDescription>
            Manage email alerts and digests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <NotificationToggle
            id="emailNews"
            label="News Updates"
            description="Receive important news and policy updates"
            checked={notifications.emailNews}
            onCheckedChange={() => handleToggle('emailNews')}
          />
          <NotificationToggle
            id="emailMarket"
            label="Market Alerts"
            description="Get notified about significant market movements"
            checked={notifications.emailMarket}
            onCheckedChange={() => handleToggle('emailMarket')}
          />
          <NotificationToggle
            id="emailEvents"
            label="Event Reminders"
            description="Receive reminders for upcoming economic events"
            checked={notifications.emailEvents}
            onCheckedChange={() => handleToggle('emailEvents')}
          />
          <NotificationToggle
            id="emailDigest"
            label="Daily Digest"
            description="Receive a summary of daily activity"
            checked={notifications.emailDigest}
            onCheckedChange={() => handleToggle('emailDigest')}
          />
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Push Notifications</CardTitle>
          <CardDescription>
            Configure browser push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <NotificationToggle
            id="pushNews"
            label="Breaking News"
            description="Instant alerts for major news events"
            checked={notifications.pushNews}
            onCheckedChange={() => handleToggle('pushNews')}
          />
          <NotificationToggle
            id="pushMarket"
            label="Market Movements"
            description="Real-time alerts for significant market changes"
            checked={notifications.pushMarket}
            onCheckedChange={() => handleToggle('pushMarket')}
          />
          <NotificationToggle
            id="pushEvents"
            label="Event Start"
            description="Get notified when followed events begin"
            checked={notifications.pushEvents}
            onCheckedChange={() => handleToggle('pushEvents')}
          />
        </CardContent>
      </Card>

      {/* Digest Frequency */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Digest Frequency</CardTitle>
          <CardDescription>
            Choose how often to receive email digests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={notifications.digestFrequency}
            onValueChange={handleFrequencyChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="realtime" id="realtime" />
              <Label htmlFor="realtime" className="text-sm font-normal cursor-pointer">
                Real-time (As events happen)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="text-sm font-normal cursor-pointer">
                Daily (Once per day)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="text-sm font-normal cursor-pointer">
                Weekly (Once per week)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="never" id="never" />
              <Label htmlFor="never" className="text-sm font-normal cursor-pointer">
                Never (Disable digests)
              </Label>
            </div>
          </RadioGroup>
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

interface NotificationToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}

const NotificationToggle = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: NotificationToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};
