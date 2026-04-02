import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

const SITEMAP_FILTER = (page) => {
  if (page.includes('/admin')) return false;
  return true;
};

const PRIORITY_RULES = [
  { match: /\/(trust|privacy-policy|terms|dpa|cookies)$/, priority: 0.3, changefreq: 'yearly' },
  { match: /\/(home|pricing)$/, priority: 1.0, changefreq: 'weekly' },
  { match: /\/en\/(api|job-change-detection|email-finder|phone-finder|crm-enrichment|how-it-works|data-coverage|integrations|chrome-extension)$/, priority: 0.9, changefreq: 'monthly' },
  { match: /\/(de|fr|nl|it|es|pt)\/(api|job-change-detection|email-finder|phone-finder|crm-enrichment|how-it-works|data-coverage|integrations|chrome-extension)$/, priority: 0.8, changefreq: 'monthly' },
  { match: /\/compare$/, priority: 0.9, changefreq: 'weekly' },
  { match: /\/compare\/[a-z-]+$/, priority: 0.82, changefreq: 'monthly' },
  { match: /\/vs-(apollo|zoominfo|cognism|lusha|clearbit|hunter|kaspr|dropcontact|phantombuster|snov)$/, priority: 0.85, changefreq: 'monthly' },
  { match: /\/vs-[a-z-]+$/, priority: 0.72, changefreq: 'monthly' },
  { match: /\/[a-z-]+-vs-[a-z-]+$/, priority: 0.55, changefreq: 'monthly' },
];

export default defineConfig({
  site: "https://datagma.com",
  output: "static",
  server: { port: 4321 },
  integrations: [
    mdx(),
    tailwind(),
    sitemap({
      filter: SITEMAP_FILTER,
      serialize(item) {
        for (const rule of PRIORITY_RULES) {
          if (rule.match.test(item.url)) {
            return { ...item, priority: rule.priority, changefreq: rule.changefreq };
          }
        }
        return { ...item, priority: 0.5, changefreq: 'monthly' };
      },
    }),
  ],
  trailingSlash: "never",
  build: {
    format: "directory",
  },
});
