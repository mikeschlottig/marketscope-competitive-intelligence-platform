import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function ScheduleModal({ open, onOpenChange }: ScheduleModalProps) {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSchedule = async () => {
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/schedule-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency, includeCharts }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Report scheduled successfully!');
        onOpenChange(false);
      } else {
        toast.error('Failed to schedule report.');
      }
    } catch (e) {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Schedule Report</SheetTitle>
          <SheetDescription>Set up automated email reports for your competitors.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 py-6 space-y-6">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeCharts" 
              checked={includeCharts}
              onCheckedChange={(c) => setIncludeCharts(c as boolean)}
            />
            <Label htmlFor="includeCharts">Include charts and graphs</Label>
          </div>
        </div>
        <SheetFooter className="mt-auto pt-4 border-t">
          <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
          <Button onClick={handleSchedule} disabled={loading}>
            {loading ? 'Scheduling...' : 'Schedule'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}