# MarketScope - Competitive Intelligence Platform

[cloudflarebutton]

## Overview

MarketScope is a professional, visually immersive competitive intelligence dashboard designed to help businesses track, analyze, and outperform their competition. It transforms raw competitor data into actionable insights through multiple interactive views (Table, List, Kanban Board, Gallery).

A premium competitive analysis dashboard featuring multi-view data visualization, advanced filtering, and detailed competitor insights.

### Key Features
- **Multi-View Dashboard**: Seamless switching between high-density data tables, detailed list cards, workflow-focused Kanban boards, and visual gallery grids.
- **Deep Analytics**: Real-time calculation of key metrics (Organic Clicks, Domain Authority, Audit Scores) with visual indicators like color-coded badges and progress rings.
- **Interactive Management**: Quick actions to monitor, archive, or edit competitor profiles, complete with a detailed slide-out inspector panel for deep dives.
- **Visual Excellence**: Polished UI built with Shadcn/UI and Tailwind CSS, featuring glassmorphism accents, smooth Framer Motion transitions, and a refined professional color palette.
- **Advanced Filtering & Sorting**: Slice data by industry, SEO metrics, location, status, and more.
- **Responsive Design**: Optimized for mobile, tablet, and desktop with flawless layouts.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, React Router, TanStack Query
- **UI Library**: Shadcn/UI, Tailwind CSS 3, Headless UI, Radix UI
- **Icons & Animations**: Lucide React, Framer Motion
- **Utilities**: clsx, Tailwind Merge, date-fns, Zod, Immer, Zustand
- **Charts & Data**: Recharts
- **Deployment**: Cloudflare Workers & Pages
- **Dev Tools**: ESLint, Bun, Wrangler

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (package manager)
- [Node.js](https://nodejs.org/) (for some dev tools)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for Cloudflare deployment)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd marketscope
   ```

2. Install dependencies with Bun:
   ```
   bun install
   ```

3. Start the development server:
   ```
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

### Development Scripts
| Script | Description |
|--------|-------------|
| `bun dev` | Start local dev server |
| `bun build` | Build for production |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build |
| `bun deploy` | Build & deploy to Cloudflare |

## Usage
- **Dashboard**: View competitors in List, Table, Board, or Gallery modes.
- **Search & Filter**: Use the search bar and filters panel for quick data slicing.
- **Sort Columns**: Click headers in Table view to sort.
- **View Details**: Click any competitor to open the slide-out inspector.
- **Actions**: Add, export, edit, or delete competitors via toolbar buttons.

All data is client-side with mock competitors for demo purposes. Extend with real APIs via `/worker/userRoutes.ts`.

## Deployment to Cloudflare

[cloudflarebutton]

1. **Login to Cloudflare**:
   ```
   bunx wrangler login
   ```

2. **Deploy**:
   ```
   bun deploy
   ```

   This builds the app and deploys to Cloudflare Workers/Pages.

3. **Custom Domain** (optional):
   Update `wrangler.jsonc` and run `bunx wrangler deploy`.

### Production Optimizations
- Assets are served via Cloudflare Pages.
- API routes in `worker/userRoutes.ts`.
- Environment variables via Wrangler secrets.

## Project Structure
```
src/
├── components/     # UI components (Shadcn/UI + custom)
├── hooks/          # Custom React hooks
├── lib/            # Utilities & error reporting
├── pages/          # Route components (HomePage.tsx is main dashboard)
└── main.tsx        # App entrypoint
worker/             # Cloudflare Worker API routes
```

## Contributing
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/name`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push and open a PR.

Follow ESLint rules and TypeScript standards.

## License
MIT License. See [LICENSE](LICENSE) for details.

## Support
- Issues: [GitHub Issues](https://github.com/issues)
- Discussions: [GitHub Discussions](https://github.com/discussions)

Built with ❤️ for rapid development on Cloudflare.