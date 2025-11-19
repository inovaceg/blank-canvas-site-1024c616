// Utility to generate sitemap data
// This should be called server-side or during build time in a real application

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority ? `<priority>${url.priority}</priority>` : ""}
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export const staticPages: SitemapUrl[] = [
  {
    loc: "https://docessaofidelis.com.br/",
    changefreq: "daily",
    priority: 1.0,
  },
  {
    loc: "https://docessaofidelis.com.br/produtos",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    loc: "https://docessaofidelis.com.br/nossa-historia",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    loc: "https://docessaofidelis.com.br/qualidade",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    loc: "https://docessaofidelis.com.br/contato",
    changefreq: "monthly",
    priority: 0.6,
  },
];
