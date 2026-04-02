import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CompetitorControls } from '@/components/competitors/CompetitorControls';
import { AddCompetitor } from '@/components/competitors/AddCompetitor';
import {
  CompetitorList,
  CompetitorTable,
  CompetitorBoard,
  CompetitorGallery,
} from '@/components/competitors/CompetitorViews';
import { CompetitorDetailSheet } from '@/components/competitors/CompetitorDetailSheet';
import {
  SAMPLE_COMPETITORS,
  CompetitorData,
  FilterState,
  SortConfig,
  CompetitorFormData,
} from '@/data/competitors';
import { v4 } from 'uuid';
import { toast, Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

type ActiveView = 'list' | 'table' | 'board' | 'gallery';

export function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>(SAMPLE_COMPETITORS);
  const [activeView, setActiveView] = useState<ActiveView>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({
    key: 'seoMetrics.organicClicks',
    direction: 'desc',
  });
  const [filters, setFilters] = useState<FilterState>({
    industry: '',
    minClicks: 0,
    maxDistance: 100,
    minAuditScore: 0,
    status: 'all',
  });

  // Load competitors from localStorage (fallback to SAMPLE_COMPETITORS)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('competitors');
      if (saved) {
        setCompetitors(JSON.parse(saved) as CompetitorData[]);
      } else {
        setCompetitors(SAMPLE_COMPETITORS);
      }
    } catch {
      setCompetitors(SAMPLE_COMPETITORS);
    }
  }, []);

  // Persist competitors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('competitors', JSON.stringify(competitors));
  }, [competitors]);

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);

  const handleAddSubmit = useCallback((formData: CompetitorFormData) => {
    const { topKeywords: topKeywordsStr, ...restFormData } = formData;
    const newComp: CompetitorData = {
      id: v4(),
      lastUpdated: new Date().toISOString(),
      status: 'active',
      topKeywords: topKeywordsStr
        .split(',')
        .map(k => k.trim())
        .filter(Boolean),
      ...restFormData,
    };
    setCompetitors(prev => [newComp, ...prev]);
    toast.success('Competitor added successfully!');
    setShowAddModal(false);
  }, []);

  const filteredCompetitors = useMemo(() => {
    let filtered = competitors.filter((comp) => {
      const matchesSearch =
        comp.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.topKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesIndustry =
        filters.industry === 'all' ||
        !filters.industry ||
        comp.industry === filters.industry;

      const matchesClicks = comp.seoMetrics.organicClicks >= filters.minClicks;
      const matchesDistance =
        !comp.location.distance || comp.location.distance <= filters.maxDistance;
      const matchesAuditScore = comp.seoMetrics.auditScore >= filters.minAuditScore;
      const matchesStatus = filters.status === 'all' || comp.status === filters.status;

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesClicks &&
        matchesDistance &&
        matchesAuditScore &&
        matchesStatus
      );
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aVal: any, bVal: any;
        const key = sortConfig.key;

        if (key.includes('.')) {
          const keys = key.split('.');
          aVal = (a as any)[keys[0]][keys[1]];
          bVal = (b as any)[keys[0]][keys[1]];
        } else {
          aVal = (a as any)[key];
          bVal = (b as any)[key];
        }

        if (typeof aVal === 'undefined' || aVal === null) aVal = -Infinity;
        if (typeof bVal === 'undefined' || bVal === null) bVal = -Infinity;

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [competitors, searchQuery, filters, sortConfig]);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderActiveView = () => {
    const props = {
      competitors: filteredCompetitors,
      onSelect: setSelectedCompetitor,
      sortConfig,
      handleSort,
    };
    switch (activeView) {
      case 'list':
        return <CompetitorList {...props} />;
      case 'table':
        return <CompetitorTable {...props} />;
      case 'board':
        return <CompetitorBoard {...props} />;
      case 'gallery':
        return <CompetitorGallery {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <CompetitorControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            activeView={activeView}
            setActiveView={setActiveView}
            competitorCount={filteredCompetitors.length}
            totalCount={competitors.length}
            onOpenAdd={handleOpenAdd}
          />
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <CompetitorDetailSheet
        competitor={selectedCompetitor}
        onClose={() => setSelectedCompetitor(null)}
      />

      <AddCompetitor
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddSubmit}
      />

      <footer className="text-center py-4 text-sm text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>

      <Toaster richColors />
    </div>
  );
}
//