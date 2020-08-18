import { labs, lifestyle, culture, sport, opinion, news, brand, brandAlt, neutral, specialReport } from '@guardian/src-foundations/palette'

document.fonts.load("52px Guardian Headline Light");
document.fonts.load("700 28px Guardian Text Egyptian");

const DARK = 300
const MAIN = 400
const BRIGHT = 500
const PASTEL = 600
const FADED = 800
const headlineLineHeightMultiplier = 1.05;
const standfirstLineHeightMultiplier = 1.1;

export default {
  gridDomain: process.env.GRID_DOMAIN as string,
  dimensions: {
    mobile: [525, 810],
    tablet: [975, 1088]
  },
  padding: 10,
  headline: {
    font: "Guardian Titlepiece",
    mobile: {
      maxWidth: 420,
      lineHeight: {
        small: 52 * headlineLineHeightMultiplier,
        medium: 68 * headlineLineHeightMultiplier,
        large: 84 * headlineLineHeightMultiplier,
        xLarge: 100 * headlineLineHeightMultiplier
      },
      fontSize: {
        small: 52,
        medium: 68,
        large: 84,
        xLarge: 100
      }
    },
    tablet: {
      maxWidth: 648,
      lineHeight: {
        small: 80 * headlineLineHeightMultiplier,
        medium: 105 * headlineLineHeightMultiplier,
        large: 128 * headlineLineHeightMultiplier,
        xLarge: 180 * headlineLineHeightMultiplier
      },
      fontSize: {
        small: 80,
        medium: 105,
        large: 128,
        xLarge: 180
      }
    }
  },
  standfirst: {
    font: "Guardian Text Egyptian",
    mobile: {
      maxWidth: 350,
      lineHeight: {
        small: 28 * standfirstLineHeightMultiplier,
        medium: 32 * standfirstLineHeightMultiplier
      },
      fontSize: {
        small: 28,
        medium: 32
      }
    },
    tablet: {
      maxWidth: 572,
      lineHeight: {
        small: 43 * standfirstLineHeightMultiplier,
        medium: 49 * standfirstLineHeightMultiplier
      },
      fontSize: {
        small: 43,
        medium: 49
      }
    }
  },
  byline: {
   underHeadline: {
      font: "Guardian Headline Light"
    },
    underStandfirst: {
      font: "Guardian Text Egyptian"
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

//  Explanation from Ana Pradas:
//
//    The reason why it was changed to numeric naming is because we might
//    want to add more swatches in the future, so it's easier to do when
//    we tag them numerically rather than dark, extra dark, extra extra
//    dark.
//
//    But since we are using a limited amount of swatches here, I don't
//    see why we shouldn't make it easier for the team using the tool and
//    go with bright/pastel, etc.
//
//    The main thing for us would be to avoid generic names like "red".

// Note from Justin:
//
//    We considered merging labs/neutral/special into one entry, but Katy V
//    was of the opinion that separate entries, even if short, were better.

    brand: { dark: brand[DARK], main: brand[MAIN], pastel: brand[PASTEL] },
    highlight: { dark: brandAlt[DARK], main: brandAlt[MAIN] },
    news: { dark: news[DARK], main: news[MAIN], bright: news[BRIGHT], pastel: news[PASTEL], faded: news[FADED] },
    opinion: { dark: opinion[DARK], main: opinion[MAIN], bright: opinion[BRIGHT], pastel: opinion[PASTEL], faded: opinion[FADED] },
    sport: { dark: sport[DARK], main: sport[MAIN], bright: sport[BRIGHT], pastel: sport[PASTEL], faded: sport[FADED] },
    culture: { dark: culture[DARK], main: culture[MAIN], bright: culture[BRIGHT], pastel: culture[PASTEL], faded: culture[FADED] },
    lifestyle: { dark: lifestyle[DARK], main: lifestyle[MAIN], bright: lifestyle[BRIGHT], pastel: lifestyle[PASTEL], faded: lifestyle[FADED], },
    labs: { dark: labs[DARK], main: labs[MAIN] },
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
