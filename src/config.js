export default {
  dimensions: {
    mobile: [350, 540],
    tablet: [650, 725]
  },
  svgWidth: 400,
  padding: 10,
  headline: {
    font: 'Guardian Titlepiece',
    maxWidth: 420,
    lineHeight: {
      small: 54,
      medium: 70,
      large: 82
    },
    fontSize: {
      small: 52,
      medium: 68,
      large: 82
    }
  },
  standfirst: {
    font: 'Guardian Headline Full',
    maxWidth: 280,
    lineHeight: {
      small: 34,
      medium: 38
    },
    fontSize: {
      small: 28,
      medium: 32
    }
  },
  colours: {
    white: '#eeeeee',
    red: '#c70000',
    blue: '#052962',
    yellow: '#ffe500',
    grey: '#ececec',
    custom: 'custom'
  },
  upload: {
    labels: [
      'edition-cover-card'
    ],
    collections: [
      'iPad Daily Edition'
    ],
    metadataToCopy: [
      'credit',
      'description',
      'dateTaken',
      'byline',
      'bylineTitle',
      'title',
      'copyrightNotice',
      'copyright',
      'suppliersReference',
      'source',
      'city',
      'country'
    ]
  }
};
