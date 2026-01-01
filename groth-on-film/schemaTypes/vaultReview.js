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
    {name: 'publishedDate', type: 'date', title: 'Watched Date'},
    {name: 'heroImage', type: 'url', title: 'Hero Image URL'},
    {name: 'verdict', type: 'string', title: 'The Verdict'},
    // REPLACE ONLY THE PARAGRAPHS SECTION WITH THIS:
    {
      name: 'body', 
      type: 'text', 
      title: 'Review Body',
      description: 'Paste your full review here. Use double enters for new paragraphs.'
    },
    {name: 'footerText', type: 'string', title: 'Availability Text'},
    {name: 'footerLink', type: 'url', title: 'Purchase/Streaming Link'},
  ]
}