import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CompetitorData } from '@/data/competitors';
interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: CompetitorData[]) => void;
}
export function ImportModal({ open, onOpenChange, onImport }: ImportModalProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const handleImport = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to import.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/ai-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const parsed = data.data.map((item: any) => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          lastUpdated: item.lastUpdated || new Date().toISOString(),
          status: item.status || 'active',
          topKeywords: Array.isArray(item.topKeywords) ? item.topKeywords : [],
          seoMetrics: {
            organicClicks: item.seoMetrics?.organicClicks || 0,
            rankingKeywords: item.seoMetrics?.rankingKeywords || 0,
            domainAuthority: item.seoMetrics?.domainAuthority || 0,
            auditScore: item.seoMetrics?.auditScore || 0,
          },
          location: {
            city: item.location?.city || '',
            state: item.location?.state || '',
          }
        })) as CompetitorData[];
        onImport(parsed);
        toast.success(`Successfully imported ${parsed.length} competitors.`);
        onOpenChange(false);
        setText('');
      } else {
        toast.error('Failed to parse data.');
      }
    } catch (e) {
      toast.error('An error occurred during import.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Import Competitors</SheetTitle>
          <SheetDescription>Paste CSV or Markdown text to import competitors via AI.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 py-6">
          <Textarea
            className="h-full min-h-[300px]"
            placeholder="Paste your CSV or Markdown data here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <SheetFooter className="mt-auto pt-4 border-t">
          <SheetClose asChild><Button type="button" variant="outline">Cancel</Button></SheetClose>
          <Button onClick={handleImport} disabled={loading}>
            {loading ? 'Importing...' : 'Import via AI'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}