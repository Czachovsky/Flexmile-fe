const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Konfiguracja
const API_URL = process.env.API_URL || 'http://flexmile.local/wp-json/flexmile/v1';
const BASE_URL = process.env.BASE_URL || 'https://flexmile.pl';
const OUTPUT_PATH = path.join(__dirname, '../dist/flexmile/browser/sitemap.xml');

// Statyczne strony
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/oferty', priority: '0.9', changefreq: 'daily' },
  { url: '/polityka-prywatnosci', priority: '0.3', changefreq: 'monthly' },
  { url: '/regulamin', priority: '0.3', changefreq: 'monthly' },
  { url: '/polityka-cookies', priority: '0.3', changefreq: 'monthly' }
];

// Funkcja do escape XML
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Funkcja do generowania wpisu URL
function generateUrlEntry(path, priority, changefreq) {
  const url = `${BASE_URL}${path}`;
  const lastmod = new Date().toISOString().split('T')[0];
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Funkcja do pobierania ofert z API
function fetchOffers() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/offers`);
    url.searchParams.append('per_page', '1000');
    
    const client = url.protocol === 'https:' ? https : http;
    
    client.get(url.toString(), (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.offers || []);
        } catch (error) {
          console.error('Error parsing offers:', error);
          resolve([]);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching offers:', error);
      resolve([]);
    });
  });
}

// Główna funkcja
async function generateSitemap() {
  console.log('Generating sitemap...');
  console.log(`API URL: ${API_URL}`);
  console.log(`Base URL: ${BASE_URL}`);
  
  // Pobierz oferty
  const offers = await fetchOffers();
  console.log(`Found ${offers.length} offers`);
  
  // Generuj wpisy URL
  const urls = [
    ...staticPages.map(page => generateUrlEntry(page.url, page.priority, page.changefreq)),
    ...offers.map(offer => generateUrlEntry(`/oferta/${offer.id}`, '0.8', 'weekly'))
  ];
  
  // Generuj XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;
  
  // Zapisz plik
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`Sitemap generated successfully: ${OUTPUT_PATH}`);
  console.log(`Total URLs: ${urls.length}`);
}

// Uruchom
generateSitemap().catch(console.error);

