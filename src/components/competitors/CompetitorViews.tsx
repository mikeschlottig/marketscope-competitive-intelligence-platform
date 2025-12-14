import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Globe, MapPin, Target, Eye, Edit2, Trash2, ExternalLink,
  ArrowUpDown, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';
import { CompetitorData, SortConfig } from '@/data/competitors';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// ============================================
// 🎨 HELPER COMPONENTS & FUNCTIONS
// ============================================
const getAuditScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};
const getStatusBadgeVariant = (status: CompetitorData['status']) => {
  switch (status) {
    case 'active': return 'default';
    case 'monitoring': return 'secondary';
    case 'archived': return 'outline';
  }
};
const MetricDisplay = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <span className="text-sm text-muted-foreground">{label}</span>
    <p className="font-semibold text-foreground">{value}</p>
  </div>
);
// ============================================
// 📊 VIEW COMPONENTS
// ============================================
interface ViewProps {
  competitors: CompetitorData[];
  onSelect: (competitor: CompetitorData) => void;
  sortConfig: SortConfig | null;
  handleSort: (key: SortConfig['key']) => void;
  onRefreshMetrics?: (competitor: CompetitorData) => void;
}
export const CompetitorList = ({ competitors, onSelect, onRefreshMetrics }: ViewProps) => (
  <div className="space-y-3">
    {competitors.map((comp, index) => (
      <motion.div
        key={comp.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(comp)}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{comp.businessName}</h3>
                  <Badge variant={getStatusBadgeVariant(comp.status)}>{comp.status}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {comp.website.replace('https://', '')}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {comp.location.city}, {comp.location.state} {comp.location.distance && `(${comp.location.distance} mi)`}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <MetricDisplay label="Clicks" value={comp.seoMetrics.organicClicks.toLocaleString()} />
                  <MetricDisplay label="Keywords" value={comp.seoMetrics.rankingKeywords} />
                  <MetricDisplay label="DA" value={comp.seoMetrics.domainAuthority} />
                  <MetricDisplay label="Audit" value={<span className={getAuditScoreColor(comp.seoMetrics.auditScore)}>{comp.seoMetrics.auditScore}/100</span>} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild><a href={comp.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}><ExternalLink className="w-4 h-4" /></a></Button>
                {onRefreshMetrics && (
                  <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); onRefreshMetrics(comp); }}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-1.5">Top Keywords:</p>
              <div className="flex flex-wrap gap-1.5">
                {comp.topKeywords.map((kw, idx) => <Badge key={idx} variant="secondary">{kw}</Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);
export const CompetitorTable = ({ competitors, onSelect, sortConfig, handleSort, onRefreshMetrics }: ViewProps) => {
  const getSortIcon = (key: SortConfig['key']) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };
  const SortableHeader = ({ sortKey, children }: { sortKey: SortConfig['key']; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort(sortKey)}>
      <div className="flex items-center gap-2">{children} {getSortIcon(sortKey)}</div>
    </TableHead>
  );
  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader sortKey="businessName">Business</SortableHeader>
              <TableHead>Location</TableHead>
              <SortableHeader sortKey="seoMetrics.organicClicks">Clicks</SortableHeader>
              <SortableHeader sortKey="seoMetrics.rankingKeywords">Keywords</SortableHeader>
              <SortableHeader sortKey="seoMetrics.auditScore">Audit Score</SortableHeader>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map(comp => (
              <TableRow key={comp.id} className="cursor-pointer" onClick={() => onSelect(comp)}>
                <TableCell>
                  <div className="font-medium text-foreground">{comp.businessName}</div>
                  <a href={comp.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
                    {comp.website.replace('https://', '')} <ExternalLink className="w-3 h-3" />
                  </a>
                </TableCell>
                <TableCell>
                  <div>{comp.location.city}, {comp.location.state}</div>
                  {comp.location.distance && <div className="text-xs text-muted-foreground">{comp.location.distance} mi away</div>}
                </TableCell>
                <TableCell>{comp.seoMetrics.organicClicks.toLocaleString()}</TableCell>
                <TableCell>{comp.seoMetrics.rankingKeywords}</TableCell>
                <TableCell>
                  <Badge variant={comp.seoMetrics.auditScore >= 80 ? 'default' : comp.seoMetrics.auditScore >= 60 ? 'secondary' : 'destructive'}>
                    {comp.seoMetrics.auditScore}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onSelect(comp); }}><Eye className="w-4 h-4" /></Button></TooltipTrigger>
                        <TooltipContent><p>View Details</p></TooltipContent>
                      </Tooltip>
                      {onRefreshMetrics && (
                        <Tooltip>
                          <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); onRefreshMetrics(comp); }}><RefreshCw className="w-4 h-4" /></Button></TooltipTrigger>
                          <TooltipContent><p>Refresh Metrics</p></TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}><Edit2 className="w-4 h-4" /></Button></TooltipTrigger>
                        <TooltipContent><p>Edit</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}><Trash2 className="w-4 h-4 text-destructive" /></Button></TooltipTrigger>
                        <TooltipContent><p>Delete</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
export const CompetitorBoard = ({ competitors, onSelect }: ViewProps) => {
  const columns: { status: CompetitorData['status']; title: string }[] = [
    { status: 'active', title: 'Active' },
    { status: 'monitoring', title: 'Monitoring' },
    { status: 'archived', title: 'Archived' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map(col => {
        const compsInCol = competitors.filter(c => c.status === col.status);
        return (
          <div key={col.status} className="bg-muted/50 rounded-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-foreground flex items-center justify-between">
                {col.title}
                <span className="text-sm font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-md">{compsInCol.length}</span>
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {compsInCol.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(comp)}>
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-foreground mb-2">{comp.businessName}</h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Clicks:</span> <span className="font-medium">{comp.seoMetrics.organicClicks.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Audit:</span> <span className={`font-medium ${getAuditScoreColor(comp.seoMetrics.auditScore)}`}>{comp.seoMetrics.auditScore}/100</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Distance:</span> <span className="font-medium">{comp.location.distance || 'N/A'} mi</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export const CompetitorGallery = ({ competitors, onSelect }: ViewProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {competitors.map((comp, index) => (
      <motion.div
        key={comp.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onSelect(comp)}>
          <div className="aspect-video bg-muted relative">
            {comp.thumbnailUrl ? (
              <img src={comp.thumbnailUrl} alt={comp.businessName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Globe className="w-12 h-12 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-bold text-foreground truncate">{comp.businessName}</h4>
            <p className="text-xs text-muted-foreground mb-3 truncate">{comp.website.replace('https://', '')}</p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-muted/50 rounded p-2">
                <div className="text-lg font-bold text-primary">{comp.seoMetrics.organicClicks.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Clicks</div>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <div className={`text-lg font-bold ${getAuditScoreColor(comp.seoMetrics.auditScore)}`}>{comp.seoMetrics.auditScore}</div>
                <div className="text-xs text-muted-foreground">Audit</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
);