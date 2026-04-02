import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CompetitorControls } from '@/components/competitors/CompetitorControls';
import { AddCompetitor } from '@/components/competitors/AddCompetitor';
import { ImportModal } from '@/components/competitors/ImportModal';
import { ScheduleModal } from '@/components/competitors/ScheduleModal';
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
import Papa from 'papaparse';
type ActiveView = 'list' | 'table' | 'board' | 'gallery';
export function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>(SAMPLE_COMPETITORS);
  const [activeView, setActiveView] = useState<ActiveView>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
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
  const handleImport = useCallback((importedData: CompetitorData[]) => {
    setCompetitors(prev => {
      const newComps = [...prev];
      importedData.forEach(imported => {
        const index = newComps.findIndex(c => c.website === imported.website);
        if (index >= 0) {
          newComps[index] = { ...newComps[index], ...imported };
        } else {
          newComps.unshift(imported);
        }
      });
      return newComps;
    });
  }, []);
  const handleRefreshMetrics = async (comp: CompetitorData) => {
    toast.promise(
      fetch(`/api/seo-metrics?url=${encodeURIComponent(comp.website)}`).then(res => res.json()),
      {
        loading: `Refreshing metrics for ${comp.businessName}...`,
        success: (data) => {
          if (data.success && data.data) {
            setCompetitors(prev => prev.map(c => 
              c.id === comp.id ? { ...c, seoMetrics: { ...c.seoMetrics, ...data.data }, lastUpdated: new Date().toISOString() } : c
            ));
            if (selectedCompetitor?.id === comp.id) {
              setSelectedCompetitor(prev => prev ? { ...prev, seoMetrics: { ...prev.seoMetrics, ...data.data } } : null);
            }
            return 'Metrics updated successfully!';
          }
          throw new Error(data.error || 'Failed to update metrics');
        },
        error: 'Failed to refresh metrics',
      }
    );
  };
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
  const handleExportCSV = () => {
    const csvData = filteredCompetitors.map(c => ({
      BusinessName: c.businessName,
      Website: c.website,
      Industry: c.industry,
      City: c.location.city,
      State: c.location.state,
      OrganicClicks: c.seoMetrics.organicClicks,
      RankingKeywords: c.seoMetrics.rankingKeywords,
      DomainAuthority: c.seoMetrics.domainAuthority,
      AuditScore: c.seoMetrics.auditScore,
      Status: c.status
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'competitors_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };
  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Competitive Analysis Report', 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Competitors: ${filteredCompetitors.length}`, 14, 36);
      const tableData = filteredCompetitors.map(c => [
        c.businessName,
        c.industry,
        `${c.location.city}, ${c.location.state}`,
        c.seoMetrics.organicClicks.toString(),
        c.seoMetrics.auditScore.toString()
      ]);
      autoTable(doc, {
        startY: 45,
        head: [['Business', 'Industry', 'Location', 'Clicks', 'Audit Score']],
        body: tableData,
      });
      doc.save('competitors_report.pdf');
      toast.success('PDF exported successfully');
    } catch (e) {
      toast.error('Failed to export PDF');
    }
  };
  const renderActiveView = () => {
    const props = {
      competitors: filteredCompetitors,
      onSelect: setSelectedCompetitor,
      sortConfig,
      handleSort,
      onRefreshMetrics: handleRefreshMetrics,
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
            onOpenImport={() => setShowImportModal(true)}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            onOpenSchedule={() => setShowScheduleModal(true)}
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
        onRefreshMetrics={handleRefreshMetrics}
      />
      <AddCompetitor
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddSubmit}
      />
      <ImportModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImport={handleImport}
      />
      <ScheduleModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
      />
      <footer className="text-center py-4 text-sm text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>
      <Toaster richColors />
    </div>
  );
}