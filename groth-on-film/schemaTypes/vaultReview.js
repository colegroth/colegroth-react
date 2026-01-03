import { TMDbLoader } from '../components/TMDbLoader';
import { VerdictGenerator } from '../components/ContentGenerators';

export default {
  name: 'vaultReview',
  title: 'Daily Review',
  type: 'document',
  fields: [
    // 1. THE TOOL (Must be first for easy access)
    {
      name: 'tmdbInput',
      type: 'string', // Pseudo-field
      title: 'TMDb Tools',
      components: { input: TMDbLoader }, // <--- Connects the UI
      description: 'Search ID to browse gallery.'
    },

    // 2. METADATA
    { name: 'title', type: 'string', title: 'Movie Title' },
    { name: 'slug', type: 'slug', title: 'URL Slug', options: { source: 'title' } },
    { name: 'director', type: 'string', title: 'Director' },
    { name: 'year', type: 'string', title: 'Release Year' },
    { 
      name: 'ratingStars', 
      type: 'string', 
      title: 'Rating', 
      options: { list: ['★★★★★', '★★★★½', '★★★★', '★★★½', '★★★', '★★½', '★★', '★½', '★'] } 
    },
    { name: 'publishedDate', type: 'date', title: 'Watched Date' },
    { name: 'heroImage', type: 'url', title: 'Hero Image URL' },
    
    // 3. CONTENT
    { 
      name: 'body', 
      type: 'array', 
      title: 'Review Body', 
      of: [{type: 'block'}] 
    },
    { 
      name: 'verdict', 
      type: 'string', 
      title: 'The Verdict',
      components: { input: VerdictGenerator } 
    },
    
    { name: 'footerText', type: 'string', title: 'Availability Text' },
    { name: 'footerLink', type: 'url', title: 'Purchase/Streaming Link' },
  ]
}