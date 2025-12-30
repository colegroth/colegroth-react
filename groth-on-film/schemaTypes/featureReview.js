export default {
  name: 'featureReview',
  title: 'Feature Review',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Movie Title',
      description: 'The main title of the film (e.g., Mickey 17)',
    },
    {
      name: 'id',
      type: 'string',
      title: 'Review ID',
      description: 'Internal ID (e.g., 001-Mickey17)',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'URL Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'director',
      type: 'string',
      title: 'Director',
    },
    {
      name: 'year',
      type: 'string',
      title: 'Release Year',
    },
    {
      name: 'ratingStars',
      type: 'string',
      title: 'Rating',
      options: {
        list: [
          {title: '5 Stars', value: '★★★★★'},
          {title: '4.5 Stars', value: '★★★★½'},
          {title: '4 Stars', value: '★★★★'},
          {title: '3.5 Stars', value: '★★★½'},
          {title: '3 Stars', value: '★★★'},
          {title: '2.5 Stars', value: '★★½'},
          {title: '2 Stars', value: '★★'},
          {title: '1.5 Stars', value: '★½'},
          {title: '1 Star', value: '★'},
        ],
      },
    },
    {
      name: 'publishedDate',
      type: 'string',
      title: 'Display Date',
      description: 'Formatted date (e.g., Jan 31, 2025)',
    },
    {
      name: 'heroImage',
      type: 'image',
      title: 'Hero Image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'verdict',
      type: 'string',
      title: 'The Verdict',
      description: 'A short, punchy summary sentence.',
    },
    {
      name: 'paragraphs',
      type: 'array',
      title: 'Review Paragraphs',
      of: [{type: 'text'}],
      description: 'Add each paragraph as a separate item in this list.',
    },
    {
      name: 'quotes',
      type: 'array',
      title: 'Pull Quotes',
      of: [{type: 'string'}],
      description: 'Important lines to highlight in the layout.',
    },
    {
      name: 'stills',
      type: 'array',
      title: 'Film Stills',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: 'The two high-quality stills used within the article body.',
    },
    {
      name: 'footerText',
      type: 'string',
      title: 'Availability Footer',
      description: 'e.g., "is in theaters now" or "is streaming on Hulu"',
    },
    {
      name: 'footerLink',
      type: 'url',
      title: 'Call to Action Link',
      description: 'Link to watch, buy, or rent the film.',
    },
  ],
}