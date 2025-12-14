import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CompetitorFormData } from '@/data/competitors';
const competitorFormSchema = z.object({
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  website: z.string().url({ message: "Please enter a valid URL." }).startsWith("https://", { message: "URL must start with https://" }),
  industry: z.string(),
  location: z.object({
    city: z.string().min(1, { message: "City is required." }),
    state: z.string().min(1, { message: "State is required." }),
  }),
  seoMetrics: z.object({
    organicClicks: z.coerce.number().min(0, "Cannot be negative.").max(1_000_000, "Value too high."),
    rankingKeywords: z.coerce.number().min(0, "Cannot be negative.").max(100_000, "Value too high."),
    domainAuthority: z.coerce.number().min(0, "Must be between 0-100.").max(100, "Must be between 0-100."),
    auditScore: z.coerce.number().min(0, "Must be between 0-100.").max(100, "Must be between 0-100."),
  }),
  topKeywords: z.string(),
});
interface AddCompetitorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CompetitorFormData) => void;
}
export function AddCompetitor({ open, onOpenChange, onSubmit }: AddCompetitorProps) {
  const form = useForm<CompetitorFormData>({
    resolver: zodResolver(competitorFormSchema),
    defaultValues: {
      businessName: '',
      website: 'https://',
      industry: '',
      location: { city: '', state: '' },
      seoMetrics: {
        organicClicks: 0,
        rankingKeywords: 0,
        domainAuthority: 0,
        auditScore: 0,
      },
      topKeywords: '',
    },
  });
  const handleFormSubmit = (data: CompetitorFormData) => {
    onSubmit(data);
    form.reset();
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Add New Competitor</SheetTitle>
          <SheetDescription>Enter the details of the competitor you want to track.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-6 -mr-6">
              <div className="space-y-6 py-6">
                <FormField control={form.control} name="businessName" render={({ field }) => (
                  <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="e.g., Elite Fitness Studio" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="website" render={({ field }) => (
                  <FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="industry" render={({ field }) => (
                  <FormItem><FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an industry" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Fitness">Fitness</SelectItem>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="location.city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Portland" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="location.state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="OR" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">SEO Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="seoMetrics.organicClicks" render={({ field }) => (
                      <FormItem><FormLabel>Clicks</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seoMetrics.rankingKeywords" render={({ field }) => (
                      <FormItem><FormLabel>Keywords</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seoMetrics.domainAuthority" render={({ field }) => (
                      <FormItem><FormLabel>DA (0-100)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="seoMetrics.auditScore" render={({ field }) => (
                      <FormItem><FormLabel>Audit (0-100)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
                <FormField control={form.control} name="topKeywords" render={({ field }) => (
                  <FormItem><FormLabel>Top Keywords</FormLabel><FormControl><Textarea placeholder="Enter keywords, separated by commas" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t">
              <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
              <Button type="submit">Add Competitor</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}