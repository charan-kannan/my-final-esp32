"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { UserProfile } from './user-profile';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

export function SettingsPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-primary hover:text-primary hover:bg-primary/10">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Toggle settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-primary flex items-center gap-2"><Settings/> Settings</SheetTitle>
          <SheetDescription>Manage your profile and application settings.</SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-8">
            <UserProfile />
            <Separator />
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Enable Push Alerts</Label>
                    <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Enable Email Alerts</Label>
                    <Switch id="email-notifications" />
                </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Customization</h3>
                <div className="space-y-2">
                    <Label htmlFor="alert-volume">Alert Volume</Label>
                    <Slider id="alert-volume" defaultValue={[75]} max={100} step={1} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Force Dark Mode</Label>
                    <Switch id="dark-mode" defaultChecked disabled />
                </div>
            </div>
            <Separator />
             <div className="space-y-4">
                <h3 className="text-lg font-medium">Sensor Calibration</h3>
                 <p className="text-sm text-muted-foreground">Adjust sensor sensitivity. (Simulated)</p>
                <div className="space-y-2">
                    <Label htmlFor="noise-sensitivity">Noise Sensor Sensitivity</Label>
                    <Slider id="noise-sensitivity" defaultValue={[50]} max={100} step={1} />
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
