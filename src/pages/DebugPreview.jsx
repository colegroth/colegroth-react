import React, { useState } from 'react';
import { client } from '../sanityClient';

const DebugPreview = () => {
  const [slug, setSlug] = useState('people-we-meet-on-vacation');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testPreview = async () => {
    setError(null);
    setResult(null);
    try {
      // This is the EXACT query the server uses
      const query = `*[slug.current == "${slug}" || _id == "${slug}"][0]{ title, verdict, "imageUrl": heroImage.asset->url }`;
      const data = await client.fetch(query);
      
      if (!data) throw new Error("No review found with this slug.");

      // This is the EXACT image processing the server uses
      const optimizedImage = `${data.imageUrl}?w=1200&h=630&fit=crop&fm=jpg&q=85`;

      setResult({ ...data, optimizedImage });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-12 font-mono">
      <h1 className="text-2xl mb-8 text-red-500 uppercase tracking-widest border-b border-red-500 pb-4">Preview Debugger</h1>
      
      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={slug} 
          onChange={(e) => setSlug(e.target.value)}
          className="bg-gray-800 text-white p-4 w-96 rounded"
          placeholder="Enter review slug (e.g., the-adults)" 
        />
        <button onClick={testPreview} className="bg-red-600 px-8 py-4 font-bold rounded hover:bg-red-700">RUN TEST</button>
      </div>

      {error && <div className="text-red-400 mb-8">ERROR: {error}</div>}

      {result && (
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h2 className="text-gray-500 mb-2 uppercase">Meta Data</h2>
            <ul className="space-y-4 text-sm">
              <li><span className="text-blue-400">og:title:</span> {result.title} Review</li>
              <li><span className="text-blue-400">og:description:</span> {result.verdict}</li>
              <li><span className="text-blue-400">og:image:</span> <a href={result.optimizedImage} target="_blank" className="underline break-all">{result.optimizedImage}</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-gray-500 mb-2 uppercase">Visual Preview (1200x630)</h2>
            <div className="border-2 border-green-500 inline-block">
              <img src={result.optimizedImage} alt="Preview" width="600" />
            </div>
            <p className="mt-2 text-green-500 text-xs">If you see the image above, the link IS valid.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPreview;