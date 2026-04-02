import React from 'react';
import { Filter, Search, Plus, Download, LayoutList, Columns, LayoutGrid, Eye, Upload, Calendar, FileText, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FilterState } from '@/data/competitors';
type ActiveView = 'list' | 'table' | 'board' | 'gallery';
interface CompetitorControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  competitorCount: number;
  totalCount: number;
  onOpenAdd?: () => void;
  onOpenImport?: () => void;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  onOpenSchedule?: () => void;
}
export function CompetitorControls({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  activeView,
  setActiveView,
  competitorCount,
  totalCount,
  onOpenAdd,
  onOpenImport,
  onExportCSV,
  onExportPDF,
  onOpenSchedule,
}: CompetitorControlsProps) {
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters({ ...filters, [key]: value });
  };
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'industry' && value !== '' && value !== 'all') return true;
    if (key === 'minClicks' && value > 0) return true;
    if (key === 'maxDistance' && value < 100) return true;
    if (key === 'minAuditScore' && value > 0) return true;
    if (key === 'status' && value !== 'all') return true;
    return false;
  }).length;
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Competitive Analysis</h1>
          <p className="text-muted-foreground">
            Showing {competitorCount} of {totalCount} competitors.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={onOpenSchedule}><Calendar className="w-4 h-4 mr-2" /> Schedule</Button>
          <Button variant="outline" onClick={onOpenImport}><Upload className="w-4 h-4 mr-2" /> Import</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onExportCSV}><TableIcon className="w-4 h-4 mr-2" /> Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPDF}><FileText className="w-4 h-4 mr-2" /> Export PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onOpenAdd}><Plus className="w-4 h-4 mr-2" /> Add</Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, website, or keywords..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Refine your competitor list.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="industry">Industry</Label>
                    <Select onValueChange={(value) => handleFilterChange('industry', value)} defaultValue={filters.industry}>
                      <SelectTrigger id="industry" className="col-span-2 h-8">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Fitness">Fitness</SelectItem>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => handleFilterChange('status', value as FilterState['status'])} defaultValue={filters.status}>
                      <SelectTrigger id="status" className="col-span-2 h-8">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3 pt-2">
                    <Label>Min SEO Clicks: {filters.minClicks.toLocaleString()}</Label>
                    <Slider
                      defaultValue={[filters.minClicks]}
                      max={20000}
                      step={500}
                      onValueChange={([value]) => handleFilterChange('minClicks', value)}
                    />
                  </div>
                  <div className="space-y-3 pt-2">
                    <Label>Min Audit Score: {filters.minAuditScore}</Label>
                    <Slider
                      defaultValue={[filters.minAuditScore]}
                      max={100}
                      step={1}
                      onValueChange={([value]) => handleFilterChange('minAuditScore', value)}
                    />
                  </div>
                  <div className="space-y-3 pt-2">
                    <Label>Max Distance (mi): {filters.maxDistance}</Label>
                    <Slider
                      defaultValue={[filters.maxDistance]}
                      max={100}
                      step={1}
                      onValueChange={([value]) => handleFilterChange('maxDistance', value)}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <ToggleGroup
            type="single"
            value={activeView}
            onValueChange={(value: ActiveView) => value && setActiveView(value)}
            aria-label="View mode"
          >
            <ToggleGroupItem value="list" aria-label="List view">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <Columns className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="board" aria-label="Board view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="gallery" aria-label="Gallery view">
              <Eye className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}