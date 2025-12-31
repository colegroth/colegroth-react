export default {
  name: 'vaultReview',
  title: 'Vault Review',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Movie Title'},
    {name: 'slug', type: 'slug', title: 'URL Slug', options: {source: 'title'}},
    {name: 'director', type: 'string', title: 'Director'},
    {name: 'year', type: 'string', title: 'Year'},
    {
      name: 'ratingStars',
      type: 'string',
      title: 'Rating',
      options: {
        list: ['★★★★★', '★★★★½', '★★★★', '★★★½', '★★★', '★★½', '★★', '★½', '★']
      }
    },
    {name: 'publishedDate', type: 'date', title: 'Watched Date'}, // This is your sorting date
    {name: 'heroImage', type: 'url', title: 'Hero Image URL'}, // Changed to URL for TMDB
    {name: 'verdict', type: 'string', title: 'The Verdict'},
    {
      name: 'paragraphs', 
      type: 'array', 
      title: 'Review Body',
      of: [{type: 'text'}] 
    },
    {name: 'footerText', type: 'string', title: 'Availability Text'}, // Maps to availabilityText in prompt
    {name: 'footerLink', type: 'url', title: 'Purchase/Streaming Link'},
  ]
}