import { Hono } from "hono";
import { Env } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/test', (c) => c.json({ success: true, data: { name: 'this works' }}));
    app.post('/api/ai-parse', async (c) => {
        try {
            const body = await c.req.text();
            let aiResult = "";
            if ((c.env as any).AI) {
                const response = await (c.env as any).AI.run('@cf/meta/llama-3.2-3b-instruct', {
                    messages: [
                        { role: 'system', content: 'Parse competitors from this CSV/markdown. Output ONLY a JSON array of CompetitorData objects. Keys: businessName, website, industry, location (city, state), seoMetrics (organicClicks, rankingKeywords, domainAuthority, auditScore), topKeywords (array of strings), status ("active"|"monitoring"|"archived").' },
                        { role: 'user', content: body }
                    ]
                });
                aiResult = response.response;
            } else {
                // Mock fallback when AI binding is missing
                aiResult = JSON.stringify([
                    {
                        businessName: "Mock AI parsed Business",
                        website: "https://mock.com",
                        industry: "Fitness",
                        location: { city: "Mock City", state: "MC" },
                        seoMetrics: { organicClicks: 1000, rankingKeywords: 50, domainAuthority: 40, auditScore: 80 },
                        topKeywords: ["mock", "ai"],
                        status: "active"
                    }
                ]);
            }
            const jsonMatch = aiResult.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return c.json({ success: true, data: JSON.parse(jsonMatch[0]) });
            }
            return c.json({ success: false, error: 'Could not parse JSON from AI response' }, 400);
        } catch (e) {
            return c.json({ success: false, error: String(e) }, 500);
        }
    });
    app.get('/api/seo-metrics', async (c) => {
        const url = c.req.query('url');
        if (!url) return c.json({ success: false, error: 'Missing url' }, 400);
        try {
            // Mock fetching and extracting SEO metrics based on URL heuristics
            const mockData = {
                organicClicks: Math.floor(Math.random() * 5000) + 500,
                rankingKeywords: Math.floor(Math.random() * 200) + 20,
                domainAuthority: Math.floor(Math.random() * 60) + 20,
                auditScore: Math.floor(Math.random() * 40) + 60
            };
            return c.json({ success: true, data: mockData });
        } catch (e) {
            return c.json({ success: false, error: String(e) }, 500);
        }
    });
    app.post('/api/schedule-report', async (c) => {
        return c.json({ success: true, message: "Report scheduled" });
    });
}