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
      // UPDATED QUERY to match the server fix
      const query = `*[slug.current == "${slug}" || _id == "${slug}"][0]{ 
        title, 
        verdict, 
        "imageUrl": coalesce(heroImage.asset->url, heroImage) 
      }`;
      const data = await client.fetch(query);
      
      if (!data) throw new Error("No review found.");
      if (!data.imageUrl) throw new Error("Image URL is still null. Check Sanity data.");

      const separator = data.imageUrl.includes('?') ? '&' : '?';
      const optimizedImage = `${data.imageUrl}${separator}w=1200&h=630&fit=crop&fm=jpg&q=85`;

      setResult({ ...data, optimizedImage });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-12 font-mono">
      <h1 className="text-2xl mb-8 text-green-500 border-b border-green-500 pb-4">DEBUGGER 2.0</h1>
      <div className="flex gap-4 mb-8">
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-gray-800 p-4 w-96 rounded" />
        <button onClick={testPreview} className="bg-green-600 px-8 py-4 font-bold rounded">RUN TEST</button>
      </div>
      {error && <div className="text-red-500 font-bold text-xl">ERROR: {error}</div>}
      {result && (
        <div className="grid grid-cols-2 gap-12">
          <div>
            <p className="text-gray-400">Title: <span className="text-white">{result.title}</span></p>
            <p className="text-gray-400 mt-4">Raw Image URL: <span className="text-white break-all">{result.imageUrl}</span></p>
            <p className="text-gray-400 mt-4">Final Optimized URL: <span className="text-green-400 break-all">{result.optimizedImage}</span></p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Social Card Preview:</p>
            <img src={result.optimizedImage} alt="Preview" className="border-2 border-green-500 w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPreview;