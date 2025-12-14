import React from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CompetitorData } from '@/data/competitors';
import { Globe, MapPin, TrendingUp, Target, BarChart3, Star, ExternalLink, X, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
const chartData = [
  { name: 'Oct', clicks: 2800 },
  { name: 'Nov', clicks: 3100 },
  { name: 'Dec', clicks: 3500 },
  { name: 'Jan', clicks: 3200 },
];
const getAuditScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-100/50';
  if (score >= 60) return 'text-yellow-600 bg-yellow-100/50';
  return 'text-red-600 bg-red-100/50';
};
interface CompetitorDetailSheetProps {
  competitor: CompetitorData | null;
  onClose: () => void;
  onRefreshMetrics?: (competitor: CompetitorData) => void;
}
export function CompetitorDetailSheet({ competitor, onClose, onRefreshMetrics }: CompetitorDetailSheetProps) {
  if (!competitor) return null;
  return (
    <Sheet open={!!competitor} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader className="pr-12">
          <SheetTitle className="text-2xl font-bold">{competitor.businessName}</SheetTitle>
          <SheetDescription className="flex items-center gap-1.5 text-muted-foreground">
            <Globe className="w-4 h-4" />
            <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {competitor.website}
            </a>
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto pr-6 -mr-6 pl-1">
          <div className="space-y-6 py-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Key Metrics</h3>
                {onRefreshMetrics && (
                  <Button variant="outline" size="sm" onClick={() => onRefreshMetrics(competitor)}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><TrendingUp className="w-4 h-4" /> Organic Clicks</div>
                  <p className="text-2xl font-bold">{competitor.seoMetrics.organicClicks.toLocaleString()}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Target className="w-4 h-4" /> Ranking Keywords</div>
                  <p className="text-2xl font-bold">{competitor.seoMetrics.rankingKeywords}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><BarChart3 className="w-4 h-4" /> Domain Authority</div>
                  <p className="text-2xl font-bold">{competitor.seoMetrics.domainAuthority}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Star className="w-4 h-4" /> Audit Score</div>
                  <p className={`text-2xl font-bold ${getAuditScoreColor(competitor.seoMetrics.auditScore).split(' ')[0]}`}>{competitor.seoMetrics.auditScore}/100</p>
                </div>
              </div>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-3">Clicks Trend (3 Months)</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))'
                    }}/>
                    <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
            <Separator />
            <section>
              <h3 className="text-lg font-semibold mb-3">Top Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {competitor.topKeywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
              </div>
            </section>
          </div>
        </div>
        <SheetFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}