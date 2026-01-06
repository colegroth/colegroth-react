import { VerdictGenerator, QuoteGenerator } from '../components/ContentGenerators';
import { TMDbLoader } from '../components/TMDbLoader';

export default {
  name: 'featureReview',
  title: 'Feature Review',
  type: 'document',
  fields: [
    // 1. THE TOOL
    {
      name: 'tmdbInput',
      type: 'string', 
      title: 'TMDb Tools',
      components: { input: TMDbLoader }, 
      description: 'Search ID to browse gallery for Hero and Stills.'
    },

    // 2. SCHEDULING (NEW)
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Scheduled Release Date',
      description: 'The review will remain hidden until this date/time.',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required()
    },

    // 3. METADATA
    { name: 'title', type: 'string', title: 'Movie Title' },
    { name: 'slug', type: 'slug', title: 'URL Slug', options: { source: 'title' } },
    { 
      name: 'isFeatured', 
      type: 'boolean', 
      title: 'Is Main Feature?', 
      initialValue: false
    },
    { name: 'director', type: 'string', title: 'Director' },
    { name: 'year', type: 'string', title: 'Release Year' },
    { 
      name: 'ratingStars', 
      type: 'string', 
      title: 'Rating', 
      options: { 
        list: [
          '★★★★★', '★★★★½', '★★★★', '★★★½', '★★★', 
          '★★½', '★★', '★½', '★', '½'
        ] 
      } 
    },
    { name: 'publishedDate', type: 'string', title: 'Display Date (Text)' },
    { name: 'heroImage', type: 'url', title: 'Hero Image URL' },

    // 4. CONTENT
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
    { 
      name: 'quotes', 
      type: 'array', 
      title: 'Pull Quotes', 
      components: { input: QuoteGenerator },
      of: [{type: 'string'}] 
    },
    { 
      name: 'stills', 
      type: 'array', 
      title: 'Film Stills', 
      description: 'Use TMDb Tools to add high-quality stills from the gallery.',
      of: [{type: 'url'}] 
    },
    { name: 'footerText', type: 'string', title: 'Availability Footer' },
    { name: 'footerLink', type: 'url', title: 'Call to Action Link' },
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'heroImage' }
  }
}