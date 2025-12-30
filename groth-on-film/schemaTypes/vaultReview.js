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
    {name: 'publishedDate', type: 'date', title: 'Published Date'},
    {name: 'heroImage', type: 'image', title: 'Hero Image', options: {hotspot: true}},
    {name: 'verdict', type: 'string', title: 'The Verdict'},
    {
      name: 'paragraphs', 
      type: 'array', 
      title: 'Review Body',
      of: [{type: 'text'}] // This lets you add multiple paragraphs easily
    },
    {name: 'quotes', type: 'array', title: 'Pull Quotes', of: [{type: 'string'}]},
    {
      name: 'stills', 
      type: 'array', 
      title: 'Film Stills', 
      of: [{type: 'image', options: {hotspot: true}}]
    },
    {name: 'footerText', type: 'string', title: 'Availability Text'},
    {name: 'footerLink', type: 'url', title: 'Purchase/Streaming Link'},
  ]
}