import React from 'react';
import { TMDbLoader } from '../components/TMDbLoader';

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
    // CHANGED: Optional. Blank = Immediate.
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Scheduled Release Date',
      description: 'Leave blank to publish immediately. Set a future date to schedule.',
    },
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
    { name: 'publishedDate', type: 'date', title: 'Display Date (Text)' },
    { name: 'heroImage', type: 'url', title: 'Hero Image URL' },
    { 
      name: 'body', 
      type: 'array', 
      title: 'Review Body', 
      of: [{type: 'block'}] 
    },
    { 
      name: 'verdict', 
      type: 'string', 
      title: 'The Verdict (Hook)',
      description: 'A 3-6 word punchy hook.'
    },
    { 
      name: 'quotes', 
      type: 'array', 
      title: 'Pull Quotes', 
      description: 'Add short, punchy sentences from your review.',
      of: [{type: 'string'}] 
    },
    { 
      name: 'stills', 
      type: 'array', 
      title: 'Film Stills', 
      of: [{type: 'url'}] 
    },
    { name: 'footerText', type: 'string', title: 'Availability Footer' },
    { name: 'footerLink', type: 'url', title: 'Call to Action Link' },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      imageUrl: 'heroImage'
    },
    prepare({ title, subtitle, imageUrl }) {
      return {
        title,
        subtitle: subtitle || 'Immediate Release', // Show status in list
        media: imageUrl ? React.createElement('img', { 
          src: imageUrl, 
          alt: title, 
          style: { objectFit: 'cover', height: '100%', width: '100%' } 
        }) : null
      }
    }
  }
}