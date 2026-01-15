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
    // FIX: coalesce() checks if it's an object OR a direct string. This prevents the "null" error.
    const query = encodeURIComponent(`*[slug.current == "${slug}" || _id == "${slug}"][0]{ 
      title, 
      verdict, 
      "imageUrl": coalesce(heroImage.asset->url, heroImage) 
    }`);
    
    const sanityUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${query}`;
    
    const { result } = await getSanityData(sanityUrl);

    if (result && result.imageUrl) {
      // Force JPEG and dimensions for iMessage
      const separator = result.imageUrl.includes('?') ? '&' : '?';
      const optimizedImage = `${result.imageUrl}${separator}w=1200&h=630&fit=crop&fm=jpg&q=85`;

      html = html.replace(/<meta[^>]*property=["']og:title["'][^>]*>/gi, '');
      html = html.replace(/<meta[^>]*property=["']og:description["'][^>]*>/gi, '');
      html = html.replace(/<meta[^>]*property=["']og:image["'][^>]*>/gi, '');
      html = html.replace(/<meta[^>]*name=["']twitter:image["'][^>]*>/gi, '');
      html = html.replace(/<title>.*?<\/title>/gi, '');

      const newTags = `
        <title>${result.title} | Groth on Film</title>
        <meta property="og:title" content="${result.title} Review" />
        <meta property="og:description" content="${result.verdict || 'Film review by Cole Groth.'}" />
        <meta property="og:image" content="${optimizedImage}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
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