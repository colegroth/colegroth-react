import React, { useState, useCallback } from 'react';
import { Stack, Text, Button, Card, TextInput, Flex, Spinner } from '@sanity/ui';
import { set, unset } from 'sanity';
import { useFormValue } from 'sanity';

// REPLACE THIS WITH YOUR API KEY
const TMDB_API_KEY = 'f9a215bc9403e5f84eaba8cc78ebe192'; 

export const TMDbInput = (props) => {
  const { elementProps, onChange } = props;
  const [loading, setLoading] = useState(false);
  
  // This hook grabs the current document's values
  // We don't strictly need it to fetch, but it helps if we want to auto-search by title later
  const docTitle = useFormValue(['title']); 

  const handleFetch = useCallback(async () => {
    // 1. Get the TMDb ID from the input field
    const tmdbId = elementProps.value;
    
    if (!tmdbId) {
      alert("Please enter a TMDb ID first (e.g., 550 for Fight Club)");
      return;
    }

    setLoading(true);

    try {
      // 2. Fetch Data from TMDb
      const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits,images`);
      const data = await response.json();

      if (data.success === false) {
        throw new Error("Movie not found");
      }

      // 3. Extract the goodies
      const director = data.credits.crew.find(p => p.job === 'Director')?.name;
      const year = data.release_date ? data.release_date.split('-')[0] : '';
      const posterUrl = `https://image.tmdb.org/t/p/original${data.backdrop_path || data.poster_path}`;
      const cast = data.credits.cast.slice(0, 5).map(c => c.name); // Top 5 cast
      
      // 4. Construct Sanity Patches
      // We are creating a "transaction" of patches to update OTHER fields
      // Note: In a Custom Input, you usually only control your own value.
      // To update *other* fields, we need to use the Sanity Client provided by the studio context
      // BUT, simple inputs can't easily patch siblings without custom plugins.
      
      // ALTERNATIVE STRATEGY FOR YOU:
      // Since patching siblings is complex code, we will just alert the data 
      // so you can copy/paste it, OR (better) we update the current field to be a specialized object.
      
      alert(`
        FETCH SUCCESS!
        ----------------
        Title: ${data.title}
        Director: ${director}
        Year: ${year}
        Poster: ${posterUrl}
        
        (Note: To auto-fill fields, we need to convert this input to a custom object type. For now, copy the Backdrop URL!)
      `);

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }

  }, [elementProps.value]);

  return (
    <Stack space={2}>
      <Text size={1} weight="bold">TMDb Integration</Text>
      <Flex gap={2}>
        <div style={{flex: 1}}>
          {elementProps.renderDefault(elementProps)}
        </div>
        <Button 
          mode="ghost" 
          tone="primary" 
          onClick={handleFetch} 
          disabled={loading}
          text={loading ? 'Loading...' : 'Fetch Data'} 
        />
      </Flex>
      <Card padding={2} radius={2} shadow={1} tone="transparent">
        <Text size={1} muted>Enter a TMDb ID (found in the URL, e.g. themoviedb.org/movie/<strong>666277</strong>)</Text>
      </Card>
    </Stack>
  );
}