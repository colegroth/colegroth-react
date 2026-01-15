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
  const type = pathParts[1]; 
  const slug = pathParts[2]; 

  const filePath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(filePath)) return res.status(500).send("Build artifact index.html not found.");

  let html = fs.readFileSync(filePath, 'utf8');

  if ((type !== 'review' && type !== 'daily') || !slug) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  try {
    const query = encodeURIComponent(`*[slug.current == "${slug}" || _id == "${slug}"][0]{ title, verdict, "imageUrl": heroImage.asset->url }`);
    const sanityUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${query}`;
    
    const { result } = await getSanityData(sanityUrl);

    if (result && result.imageUrl) {
      // FORCEFUL REPLACEMENT regex that catches any attributes
      html = html
        // Replace Title
        .replace(/<title>.*?<\/title>/, `<title>${result.title} | Groth on Film</title>`)
        .replace(/property="og:title"\s+content=".*?"/g, `property="og:title" content="${result.title} Review | Groth on Film"`)
        
        // Replace Description
        .replace(/property="og:description"\s+content=".*?"/g, `property="og:description" content="${result.verdict || 'Film review by Cole Groth.'}"`)
        .replace(/name="description"\s+content=".*?"/g, `name="description" content="${result.verdict || 'Film review by Cole Groth.'}"`)

        // Replace Image (The aggressive fix)
        // This catches <meta property="og:image" content="..." /> regardless of order or content
        .replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/g, `<meta property="og:image" content="${result.imageUrl}" />`)
        .replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/g, `<meta name="twitter:image" content="${result.imageUrl}" />`)
        // Fallback: If it uses the other attribute order (content first)
        .replace(/<meta\s+content=".*?"\s+property="og:image"\s*\/?>/g, `<meta property="og:image" content="${result.imageUrl}" />`);
    }
  } catch (e) {
    console.error("Preview Injection Failed:", e);
  }

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
}