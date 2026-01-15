import fs from 'fs';
import path from 'path';
import https from 'https';

const PROJECT_ID = 'o0lkpygl'; 
const DATASET = 'production';

// Helper to fetch without external dependencies
const getSanityData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
};

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/');
  const type = pathParts[1]; 
  const slug = pathParts[2]; 

  // Look for index.html in the root or dist
  const potentialPaths = [
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'index.html')
  ];
  
  let filePath = potentialPaths.find(p => fs.existsSync(p));
  if (!filePath) {
    return res.status(500).send("Build artifact index.html not found.");
  }

  let html = fs.readFileSync(filePath, 'utf8');

  if ((type !== 'review' && type !== 'daily') || !slug) {
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  try {
    const query = encodeURIComponent(`*[slug.current == "${slug}" || _id == "${slug}"][0]{ title, verdict, "imageUrl": heroImage.asset->url }`);
    const sanityUrl = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${query}`;
    
    const { result } = await getSanityData(sanityUrl);

    if (result) {
      html = html
        .replace(/<title>.*?<\/title>/, `<title>${result.title} | Groth on Film</title>`)
        .replace(/property="og:title" content=".*?"/g, `property="og:title" content="${result.title} Review"`)
        .replace(/property="og:description" content=".*?"/g, `property="og:description" content="${result.verdict || 'Film review by Cole Groth.'}"`)
        .replace(/content="\/me.png"/g, `content="${result.imageUrl}"`)
        .replace(/property="og:image" content=".*?"/g, `property="og:image" content="${result.imageUrl}"`);
    }
  } catch (e) {
    console.error("Preview Injection Failed:", e);
  }

  res.setHeader('Content-Type', 'text/html');
  return res.send(html);
}