import { labs, lifestyle, culture, sport, opinion, news, brand, brandAlt, neutral, specialReport } from '@guardian/src-foundations/palette'

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
        small: 32 * headlineLineHeightMultiplier,
        medium: 42 * headlineLineHeightMultiplier,
        large: 52 * headlineLineHeightMultiplier,
        xLarge: 62 * headlineLineHeightMultiplier
      },
      fontSize: {
        small: 32,
        medium: 42,
        large: 52,
        xLarge: 62
      }
    },
    tablet: {
      maxWidth: 648,
      lineHeight: {
        small: 50 * headlineLineHeightMultiplier,
        medium: 65 * headlineLineHeightMultiplier,
        large: 80 * headlineLineHeightMultiplier,
        xLarge: 112 * headlineLineHeightMultiplier
      },
      fontSize: {
        small: 50,
        medium: 65,
        large: 80,
        xLarge: 112
      }
    }
  },
  standfirst: {
    font: "GuardianTextEgyptian",
    mobile: {
      maxWidth: 350,
      lineHeight: {
        small: 16 * standfirstLineHeightMultiplier,
        medium: 20 * standfirstLineHeightMultiplier
      },
      fontSize: {
        small: 16,
        medium: 20
      }
    },
    tablet: {
      maxWidth: 572,
      lineHeight: {
        small: 26 * standfirstLineHeightMultiplier,
        medium: 30 * standfirstLineHeightMultiplier
      },
      fontSize: {
        small: 26,
        medium: 30
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
