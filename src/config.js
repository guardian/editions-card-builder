import { labs, lifestyle, culture, sport, opinion, news, brand, brandAlt, neutral, specialReport } from '@guardian/src-foundations/palette'

export default {
  dimensions: {
    mobile: [525, 810],
    tablet: [975, 1088]
  },
  svgWidth: 400,
  padding: 10,
  headline: {
    font: "Guardian Titlepiece",
    mobile: {
      maxWidth: 420,
      lineHeight: {
        small: 56,
        medium: 70,
        large: 84
      },
      fontSize: {
        small: 52,
        medium: 68,
        large: 130
      }
    },
    tablet: {
      maxWidth: 648,
      lineHeight: {
        small: 86,
        medium: 114,
        large: 200
      },
      fontSize: {
        small: 80,
        medium: 105,
        large: 180
      }
    }
  },
  standfirst: {
    font: "Guardian Headline Full",
    mobile: {
      maxWidth: 350,
      lineHeight: {
        small: 36,
        medium: 40
      },
      fontSize: {
        small: 28,
        medium: 32
      }
    },
    tablet: {
      maxWidth: 572,
      lineHeight: {
        small: 50,
        medium: 59
      },
      fontSize: {
        small: 43,
        medium: 49
      }
    }
  },
  swatches: {
    simple: {
      white: "#ffffff",
      red: "#c70000",     // news main
      blue: "#052962",    // brand main
      yellow: "#ffe500",  // highlight main
      grey: "#ededed"     // neutral (brightness 93)
    },
    brand: (({ dark, main, pastel }) => ({ dark, main, pastel }))(brand),
    highlight: (({ dark, main }) => ({ dark, main }))(brandAlt),
    news: (({ dark, main, bright, pastel, faded }) => ({ dark, main, bright, pastel, faded }))(news),
    opinion: (({ dark, main, bright, pastel, faded }) => ({ dark, main, bright, pastel, faded }))(opinion),
    sport: (({ dark, main, bright, pastel, faded }) => ({ dark, main, bright, pastel, faded }))(sport),
    culture: (({ dark, main, bright, pastel, faded }) => ({ dark, main, bright, pastel, faded }))(culture),
    lifestyle: (({ dark, main, bright, pastel, faded }) => ({ dark, main, bright, pastel, faded }))(lifestyle),
    labs: (({ dark, main }) => ({ dark, main }))(labs),
    neutral: { main: neutral["60"] },
    special: { main: specialReport["100"] }
  },
  upload: {
    labels: ["edition-cover-card"],
    collections: ["iPad Daily Edition"],
    metadataToCopy: [
      "credit",
      "description",
      "dateTaken",
      "byline",
      "bylineTitle",
      "title",
      "copyrightNotice",
      "copyright",
      "suppliersReference",
      "source",
      "city",
      "country"
    ]
  }
};
