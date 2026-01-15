import fs from 'fs';
import path from 'path';
import https from 'https';

const PROJECT_ID = 'o0lkpygl'; 
const DATASET = 'production';

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

  const filePath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(filePath)) return res.status(500).send("index.html not found");
  
  let html = fs.readFileSync(filePath, 'utf8');

  if (!slug) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  try {
    const query = encodeURIComponent(`*[slug.current == "${slug}" || _id == "${slug}"][0]{ title, verdict, "imageUrl": heroImage.asset->url }`);
    const sanityUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${query}`;
    
    const { result } = await getSanityData(sanityUrl);

    if (result && result.imageUrl) {
      // 1. RESIZE IMAGE: Force 1200x630 for social cards (Fixes iMessage rejection)
      const optimizedImage = `${result.imageUrl}?w=1200&h=630&fit=crop&q=80`;

      // 2. AGGRESSIVE DELETION: Remove ANY meta tag that mentions og:image, og:title, etc.
      // This regex matches <meta ... og:image ... > regardless of attribute order
      html = html.replace(/<meta[^>]*og:title[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*og:description[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*og:image[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*twitter:image[^>]*>/gi, '');
      html = html.replace(/<title>.*?<\/title>/gi, '');

      // 3. INJECT NEW TAGS: Put them at the very top of <head>
      const newTags = `
        <title>${result.title} | Groth on Film</title>
        <meta property="og:title" content="${result.title} Review" />
        <meta property="og:description" content="${result.verdict || 'Film review by Cole Groth.'}" />
        <meta property="og:image" content="${optimizedImage}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="${optimizedImage}" />
      `;

      html = html.replace('<head>', `<head>${newTags}`);
    }
  } catch (e) {
    console.error("Preview Injection Error:", e);
  }

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
}