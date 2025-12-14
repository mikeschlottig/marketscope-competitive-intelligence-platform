import {
  TrendingUp, Target, Globe, MapPin, BarChart3,
  Star, ExternalLink, Edit2, Trash2, Copy,
  ArrowUpDown, ArrowUp, ArrowDown, CheckCircle, XCircle, Clock
} from 'lucide-react';
// ============================================
// 📊 TYPE DEFINITIONS
// ============================================
export type CompetitorStatus = 'active' | 'monitoring' | 'archived';
export interface CompetitorData {
  id: string;
  businessName: string;
  website: string;
  industry: string;
  location: {
    city: string;
    state: string;
    distance?: number; // miles from reference point
  };
  seoMetrics: {
    organicClicks: number;
    rankingKeywords: number;
    domainAuthority: number;
    auditScore: number;
  };
  topKeywords: string[];
  lastUpdated: string;
  thumbnailUrl?: string;
  status: CompetitorStatus;
}
export interface SortConfig {
  key: keyof CompetitorData | `seoMetrics.${keyof CompetitorData['seoMetrics']}` | `location.${keyof CompetitorData['location']}`;
  direction: 'asc' | 'desc';
}
export interface FilterState {
  industry: string;
  minClicks: number;
  maxDistance: number;
  minAuditScore: number;
  status: 'all' | CompetitorStatus;
}
// ============================================
// 🎨 SAMPLE DATA (Expanded)
// ============================================
export const SAMPLE_COMPETITORS: CompetitorData[] = [
  {
    id: '1',
    businessName: 'Elite Fitness Studio',
    website: 'https://elitefitness.com',
    industry: 'Fitness',
    location: { city: 'Portland', state: 'OR', distance: 2.3 },
    seoMetrics: { organicClicks: 850, rankingKeywords: 45, domainAuthority: 32, auditScore: 68 },
    topKeywords: ['personal trainer portland', 'fitness classes', 'gym near me'],
    lastUpdated: '2025-01-15',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=400'
  },
  {
    id: '2',
    businessName: 'CrossFit Downtown',
    website: 'https://crossfitdowntown.com',
    industry: 'Fitness',
    location: { city: 'Portland', state: 'OR', distance: 1.8 },
    seoMetrics: { organicClicks: 3500, rankingKeywords: 128, domainAuthority: 45, auditScore: 82 },
    topKeywords: ['crossfit portland', 'strength training', 'functional fitness'],
    lastUpdated: '2025-01-14',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400'
  },
  {
    id: '3',
    businessName: 'Yoga & Wellness Center',
    website: 'https://yogawellness.com',
    industry: 'Fitness',
    location: { city: 'Portland', state: 'OR', distance: 3.7 },
    seoMetrics: { organicClicks: 2800, rankingKeywords: 89, domainAuthority: 38, auditScore: 75 },
    topKeywords: ['yoga portland', 'meditation classes', 'wellness center'],
    lastUpdated: '2025-01-16',
    status: 'monitoring',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400'
  },
  {
    id: '4',
    businessName: 'Peak Performance Gym',
    website: 'https://peakperformance.com',
    industry: 'Fitness',
    location: { city: 'Portland', state: 'OR', distance: 5.2 },
    seoMetrics: { organicClicks: 1200, rankingKeywords: 67, domainAuthority: 28, auditScore: 58 },
    topKeywords: ['gym portland', 'weight training', '24 hour gym'],
    lastUpdated: '2025-01-13',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=400'
  },
  {
    id: '5',
    businessName: 'Studio Pilates Northwest',
    website: 'https://studiopilates.com',
    industry: 'Fitness',
    location: { city: 'Portland', state: 'OR', distance: 4.1 },
    seoMetrics: { organicClicks: 680, rankingKeywords: 34, domainAuthority: 25, auditScore: 52 },
    topKeywords: ['pilates portland', 'reformer pilates', 'core training'],
    lastUpdated: '2025-01-15',
    status: 'monitoring',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598266663999-24a43cb75a6b?q=80&w=400'
  },
  {
    id: '6',
    businessName: 'Iron Temple Powerlifting',
    website: 'https://irontemple.com',
    industry: 'Fitness',
    location: { city: 'Portland', state: 'OR', distance: 6.8 },
    seoMetrics: { organicClicks: 420, rankingKeywords: 28, domainAuthority: 22, auditScore: 45 },
    topKeywords: ['powerlifting gym', 'strength training portland', 'olympic lifting'],
    lastUpdated: '2025-01-12',
    status: 'archived',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400'
  },
  {
    id: '7',
    businessName: 'The Artisan Bakery',
    website: 'https://artisanbakery.com',
    industry: 'Restaurant',
    location: { city: 'Seattle', state: 'WA', distance: 8.1 },
    seoMetrics: { organicClicks: 5200, rankingKeywords: 210, domainAuthority: 52, auditScore: 91 },
    topKeywords: ['artisan bread seattle', 'sourdough bakery', 'best croissants'],
    lastUpdated: '2025-01-16',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=400'
  },
  {
    id: '8',
    businessName: 'Sushi Zen',
    website: 'https://sushizen.com',
    industry: 'Restaurant',
    location: { city: 'Seattle', state: 'WA', distance: 2.5 },
    seoMetrics: { organicClicks: 4100, rankingKeywords: 150, domainAuthority: 48, auditScore: 88 },
    topKeywords: ['sushi seattle', 'omakase experience', 'japanese restaurant'],
    lastUpdated: '2025-01-15',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400'
  },
  {
    id: '9',
    businessName: 'Smith & Associates Law',
    website: 'https://smithlaw.com',
    industry: 'Legal',
    location: { city: 'New York', state: 'NY' },
    seoMetrics: { organicClicks: 12000, rankingKeywords: 350, domainAuthority: 65, auditScore: 95 },
    topKeywords: ['corporate lawyer nyc', 'business litigation', 'legal services'],
    lastUpdated: '2025-01-17',
    status: 'monitoring',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589216532372-1c2a36790039?q=80&w=400'
  },
  {
    id: '10',
    businessName: 'City General Hospital',
    website: 'https://citygeneral.org',
    industry: 'Medical',
    location: { city: 'Chicago', state: 'IL' },
    seoMetrics: { organicClicks: 25000, rankingKeywords: 800, domainAuthority: 72, auditScore: 85 },
    topKeywords: ['hospital chicago', 'emergency room', 'medical center'],
    lastUpdated: '2025-01-16',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=400'
  },
  {
    id: '11',
    businessName: 'Burger Palace',
    website: 'https://burgerpalace.com',
    industry: 'Restaurant',
    location: { city: 'Seattle', state: 'WA', distance: 4.3 },
    seoMetrics: { organicClicks: 1800, rankingKeywords: 95, domainAuthority: 35, auditScore: 72 },
    topKeywords: ['best burgers seattle', 'gourmet burgers', 'fast food'],
    lastUpdated: '2025-01-14',
    status: 'archived',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400'
  },
  {
    id: '12',
    businessName: 'Davis Family Law',
    website: 'https://davisfamilylaw.com',
    industry: 'Legal',
    location: { city: 'New York', state: 'NY' },
    seoMetrics: { organicClicks: 3400, rankingKeywords: 110, domainAuthority: 41, auditScore: 78 },
    topKeywords: ['family lawyer nyc', 'divorce attorney', 'child custody'],
    lastUpdated: '2025-01-13',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=400'
  },
  {
    id: '13',
    businessName: 'Wellness Clinic',
    website: 'https://wellnessclinic.com',
    industry: 'Medical',
    location: { city: 'Chicago', state: 'IL' },
    seoMetrics: { organicClicks: 8000, rankingKeywords: 250, domainAuthority: 55, auditScore: 90 },
    topKeywords: ['primary care chicago', 'family doctor', 'health clinic'],
    lastUpdated: '2025-01-15',
    status: 'monitoring',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=400'
  },
  {
    id: '14',
    businessName: 'Taco Tuesday Cantina',
    website: 'https://tacotuesday.com',
    industry: 'Restaurant',
    location: { city: 'Seattle', state: 'WA', distance: 1.2 },
    seoMetrics: { organicClicks: 2500, rankingKeywords: 130, domainAuthority: 40, auditScore: 80 },
    topKeywords: ['tacos seattle', 'mexican food', 'margaritas'],
    lastUpdated: '2025-01-16',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565299585323-15d11e988488?q=80&w=400'
  },
  {
    id: '15',
    businessName: 'Cycle House',
    website: 'https://cyclehouse.com',
    industry: 'Fitness',
    location: { city: 'Portland', state: 'OR', distance: 0.9 },
    seoMetrics: { organicClicks: 1500, rankingKeywords: 70, domainAuthority: 30, auditScore: 65 },
    topKeywords: ['spin class portland', 'indoor cycling', 'cardio workout'],
    lastUpdated: '2025-01-14',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1594737542312-9b7253481452?q=80&w=400'
  },
  {
    id: '16',
    businessName: 'The Grand Bistro',
    website: 'https://grandbistro.com',
    industry: 'Restaurant',
    location: { city: 'New York', state: 'NY' },
    seoMetrics: { organicClicks: 9500, rankingKeywords: 300, domainAuthority: 60, auditScore: 92 },
    topKeywords: ['french bistro nyc', 'fine dining', 'michelin star'],
    lastUpdated: '2025-01-17',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=400'
  },
  {
    id: '17',
    businessName: 'OrthoCare Specialists',
    website: 'https://orthocare.com',
    industry: 'Medical',
    location: { city: 'Chicago', state: 'IL' },
    seoMetrics: { organicClicks: 6500, rankingKeywords: 200, domainAuthority: 50, auditScore: 88 },
    topKeywords: ['orthopedic surgeon chicago', 'sports medicine', 'joint replacement'],
    lastUpdated: '2025-01-15',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba9996a?q=80&w=400'
  },
  {
    id: '18',
    businessName: 'Immigration Law Group',
    website: 'https://immigrationlawgroup.com',
    industry: 'Legal',
    location: { city: 'New York', state: 'NY' },
    seoMetrics: { organicClicks: 4800, rankingKeywords: 180, domainAuthority: 45, auditScore: 82 },
    topKeywords: ['immigration lawyer nyc', 'visa services', 'green card'],
    lastUpdated: '2025-01-14',
    status: 'monitoring',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400'
  },
  {
    id: '19',
    businessName: 'Rock Climbing Gym',
    website: 'https://rockclimbinggym.com',
    industry: 'Fitness',
    location: { city: 'Portland', state: 'OR', distance: 7.5 },
    seoMetrics: { organicClicks: 950, rankingKeywords: 55, domainAuthority: 28, auditScore: 60 },
    topKeywords: ['rock climbing portland', 'bouldering gym', 'climbing classes'],
    lastUpdated: '2025-01-13',
    status: 'archived',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587399970431-380e3bd27453?q=80&w=400'
  },
  {
    id: '20',
    businessName: 'Pizzeria Roma',
    website: 'https://pizzeriaroma.com',
    industry: 'Restaurant',
    location: { city: 'Chicago', state: 'IL' },
    seoMetrics: { organicClicks: 7200, rankingKeywords: 220, domainAuthority: 53, auditScore: 89 },
    topKeywords: ['pizza chicago', 'italian restaurant', 'deep dish pizza'],
    lastUpdated: '2025-01-16',
    status: 'active',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400'
  }
];