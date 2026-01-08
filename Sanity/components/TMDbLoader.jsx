import React, { useState, useCallback } from 'react';
import { Stack, Text, Button, Card, Flex, TextInput, Label, useToast, Grid, Box } from '@sanity/ui';
import { useClient, useFormValue } from 'sanity';

const TMDB_API_KEY = 'f9a215bc9403e5f84eaba8cc78ebe192';

// === HELPER: Image Card ===
const ImageCard = ({ img, onClick, label }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      style={{
        position: 'relative', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        cursor: 'pointer',
        boxShadow: hovered ? '0 10px 25px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease-out',
        border: hovered ? '2px solid #5227ff' : '2px solid transparent'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(img.file_path)}
    >
      <img 
        src={`https://image.tmdb.org/t/p/w500${img.file_path}`} 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        alt="Still"
      />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end'
      }}>
        <Text size={0} style={{color: 'rgba(255,255,255,0.9)', fontWeight: 600}}>
          {img.width} x {img.height}
        </Text>
        {label && <Text size={0} style={{color: '#5227ff', fontWeight: 700, textTransform: 'uppercase'}}>{label}</Text>}
      </div>
    </div>
  );
};

export const TMDbLoader = () => {
  const client = useClient({ apiVersion: '2021-06-07' });
  const toast = useToast();
  
  const documentId = useFormValue(['_id']);
  const docType = useFormValue(['_type']);
  const currentStills = useFormValue(['stills']) || [];
  
  const [tmdbId, setTmdbId] = useState('');
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState(null);

  // === 1. FETCH DATA ===
  const fetchFromTMDb = async () => {
    if (!tmdbId) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits,releases,images,watch/providers`);
      const data = await res.json();
      if (!data.id) throw new Error("Movie not found");
      
      if(data.images?.backdrops) {
        data.images.backdrops.sort((a, b) => b.width - a.width);
      }
      
      setMovieData(data);
    } catch (err) {
      toast.push({ status: 'error', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const patchDocument = async (patches) => {
    try {
      const id = documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`;
      await client.createIfNotExists({ _id: id, _type: docType });
      await client.patch(id).set(patches).commit();
      toast.push({ status: 'success', title: 'Updated!' });
    } catch (err) {
      console.error(err);
      toast.push({ status: 'error', title: 'Patch Failed', description: err.message });
    }
  };

  // === 2. GENERATE AVAILABILITY & LINK ===
  const getAvailabilityInfo = (data) => {
    const today = new Date();
    const releaseDate = new Date(data.release_date);
    const title = data.title;
    
    // Default Link: Amazon Search for the movie (Rent/Buy)
    // To monetize later, you just append "&tag=YOUR_AMAZON_ID" to this string
    const amazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(title + " movie rent")}`;

    // A. Is it brand new? (Less than 60 days old)
    const diffTime = Math.abs(today - releaseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays < 60) {
      return { 
        text: `${title} is in theaters now.`, 
        link: '' // No link for theaters usually
      };
    }

    // B. Check Streaming Providers (US)
    const providers = data['watch/providers']?.results?.US;
    
    if (providers?.flatrate && providers.flatrate.length > 0) {
      const platform = providers.flatrate[0].provider_name;
      return { 
        text: `${title} is available on ${platform}.`, 
        link: amazonLink // Keep Amazon as backup, or generic link
      };
    }

    // C. Check Rent/Buy
    if (providers?.rent || providers?.buy) {
      return { 
        text: `${title} is available to rent.`, 
        link: amazonLink 
      };
    }

    // D. Default
    return { 
      text: `${title} is available now.`, 
      link: amazonLink 
    };
  };

  // === 3. APPLY METADATA ===
  const applyMetadata = () => {
    if (!movieData) return;
    const director = movieData.credits.crew.find(p => p.job === 'Director')?.name;
    const year = movieData.release_date?.split('-')[0];
    const slug = { current: movieData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') };
    
    // Get Text & Link
    const { text, link } = getAvailabilityInfo(movieData);

    patchDocument({
      title: movieData.title,
      director: director,
      year: year,
      slug: slug,
      footerText: text, // e.g. "Fight Club is available to rent."
      footerLink: link  // e.g. Amazon Search URL
    });
  };

  const setHero = (url) => {
    patchDocument({ heroImage: `https://image.tmdb.org/t/p/original${url}` });
  };

  const addStill = (url) => {
    const fullUrl = `https://image.tmdb.org/t/p/original${url}`;
    patchDocument({ stills: [...currentStills, fullUrl] });
  };

  return (
    <Card padding={4} radius={3} shadow={2} border style={{marginBottom: '24px', borderColor: movieData ? '#5227ff' : '#e0e0e0'}}>
      <Stack space={4}>
        <Flex justify="space-between" align="center">
            <Label size={2}>🎬 TMDb Commander</Label>
            {movieData && <Text size={1} weight="bold" style={{color:'#5227ff'}}>✓ Connected: {movieData.title}</Text>}
        </Flex>

        <Flex gap={2}>
          <TextInput 
            fontSize={2}
            padding={3}
            placeholder="Search by TMDb ID (e.g. 9345)" 
            value={tmdbId} 
            onChange={(e) => setTmdbId(e.target.value)} 
          />
          <Button 
            fontSize={2}
            padding={3}
            text={loading ? "Searching..." : "Fetch Data"} 
            tone="primary" 
            mode="ghost"
            onClick={fetchFromTMDb} 
            disabled={loading} 
          />
        </Flex>

        {movieData && (
          <Stack space={5} marginTop={2}>
            
            {/* 1. METADATA SECTION */}
            <Card padding={3} radius={2} tone="transparent" style={{backgroundColor: '#f9f9f9'}}>
               <Flex align="center" justify="space-between">
                 <Box>
                    <Label size={1} muted>METADATA PREVIEW</Label>
                    <Text size={2} weight="bold" style={{marginTop: '4px'}}>
                      {movieData.title} <span style={{fontWeight:'normal'}}>({movieData.release_date?.split('-')[0]})</span>
                    </Text>
                    <Text size={1} muted>Dir. {movieData.credits.crew.find(p => p.job === 'Director')?.name}</Text>
                    
                    {/* PREVIEW AVAILABILITY */}
                    <Stack space={2} marginTop={3}>
                        <Text size={1} style={{color:'#5227ff'}}>
                           Footer: "{getAvailabilityInfo(movieData).text}"
                        </Text>
                        <Text size={0} muted style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px'}}>
                           Link: {getAvailabilityInfo(movieData).link}
                        </Text>
                    </Stack>
                 </Box>
                 <Button text="Auto-Fill Text Fields" tone="primary" onClick={applyMetadata} />
               </Flex>
            </Card>

            {/* 2. HERO SELECTOR */}
            <Stack space={3}>
                <Label size={1}>SELECT HERO IMAGE (Top Resolution First)</Label>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px'}}>
                    {movieData.images.backdrops.slice(0, 8).map(img => (
                        <ImageCard key={img.file_path} img={img} onClick={setHero} label="SET HERO" />
                    ))}
                </div>
            </Stack>

            {/* 3. STILLS SELECTOR */}
            {docType === 'featureReview' && (
                <Stack space={3}>
                    <Label size={1}>ADD GALLERY STILLS (Click to Append)</Label>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px'}}>
                        {movieData.images.backdrops.slice(8, 20).map(img => (
                            <ImageCard key={img.file_path} img={img} onClick={addStill} label="ADD" />
                        ))}
                    </div>
                </Stack>
            )}

          </Stack>
        )}
      </Stack>
    </Card>
  );
};