import { VerdictGenerator, QuoteGenerator } from '../components/ContentGenerators';
import { TMDbLoader } from '../components/TMDbLoader';
import { SmartExtract } from '../components/SmartExtract';

export default {
  name: 'featureReview',
  title: 'Feature Review',
  type: 'document',
  fields: [
    {
      name: 'tmdbInput',
      type: 'string', 
      title: 'TMDb Tools',
      components: { input: TMDbLoader }, 
      description: 'Search ID to browse gallery for Hero and Stills.'
    },
    { name: 'title', type: 'string', title: 'Movie Title' },
    { name: 'slug', type: 'slug', title: 'URL Slug', options: { source: 'title' } },
    { 
      name: 'isFeatured', 
      type: 'boolean', 
      title: 'Is Main Feature?', 
      initialValue: false,
      validation: Rule => Rule.custom(async (isFeatured, context) => {
        if (!isFeatured) return true;
        const query = `*[_type == "featureReview" && isFeatured == true && _id != $id]`;
        const params = { id: context.document._id.replace('drafts.', '') };
        const duplicates = await context.getClient({apiVersion: '2021-06-07'}).fetch(query, params);
        return duplicates.length > 0 ? `Error: "${duplicates[0].title}" is already the Featured Review.` : true;
      })
    },
    { name: 'director', type: 'string', title: 'Director' },
    { name: 'year', type: 'string', title: 'Release Year' },
    { 
      name: 'ratingStars', 
      type: 'string', 
      title: 'Rating', 
      // ADDED '½' to the end of this list
      options: { 
        list: [
          '★★★★★', '★★★★½', '★★★★', '★★★½', '★★★', 
          '★★½', '★★', '★½', '★', '½'
        ] 
      } 
    },
    { name: 'publishedDate', type: 'string', title: 'Display Date' },
    { name: 'heroImage', type: 'url', title: 'Hero Image URL' },
    { name: 'body', type: 'array', title: 'Review Body', of: [{type: 'block'}] },
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
    { name: 'stills', type: 'array', title: 'Film Stills', of: [{type: 'url'}] },
    { name: 'footerText', type: 'string', title: 'Availability Footer' },
    { name: 'footerLink', type: 'url', title: 'Call to Action Link' },
  ],
}