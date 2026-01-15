import fs from 'fs';
import path from 'path';
import https from 'https';

const PROJECT_ID = 'o0lkpygl'; 
const DATASET = 'production';

// Helper to fetch data reliably
const getSanityData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
};

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/');
  const slug = pathParts[2]; 

  // Read the HTML file
  const filePath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(filePath)) return res.status(500).send("index.html not found");
  
  let html = fs.readFileSync(filePath, 'utf8');

  // If no slug, just send the site
  if (!slug) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  try {
    const query = encodeURIComponent(`*[slug.current == "${slug}" || _id == "${slug}"][0]{ title, verdict, "imageUrl": heroImage.asset->url }`);
    const sanityUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${query}`;
    
    const { result } = await getSanityData(sanityUrl);

    if (result) {
      // 1. NUCLEAR DELETION: Remove old tags regardless of attribute order
      // This regex catches <meta ... property="og:image" ... > no matter where the property is
      html = html.replace(/<meta[^>]*property=["']og:title["'][^>]*>/gi, '');
      html = html.replace(/<meta[^>]*property=["']og:description["'][^>]*>/gi, '');
      html = html.replace(/<meta[^>]*property=["']og:image["'][^>]*>/gi, '');
      html = html.replace(/<meta[^>]*name=["']twitter:image["'][^>]*>/gi, '');
      html = html.replace(/<title>.*?<\/title>/gi, '');

      // 2. FORCE INJECTION: Put new tags at the very top of <head>
      // Bots usually take the first tag they see.
      const newTags = `
        <title>${result.title} | Groth on Film</title>
        <meta property="og:title" content="${result.title} Review" />
        <meta property="og:description" content="${result.verdict || 'Film review by Cole Groth.'}" />
        <meta property="og:image" content="${result.imageUrl}" />
        <meta name="twitter:image" content="${result.imageUrl}" />
      `;

      html = html.replace('<head>', `<head>${newTags}`);
    }
  } catch (e) {
    console.error("Preview Injection Error:", e);
  }

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
}