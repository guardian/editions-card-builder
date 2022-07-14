import {
  labs,
  lifestyle,
  culture,
  sport,
  opinion,
  news,
  brand,
  brandAlt,
  neutral,
  specialReport
} from "@guardian/src-foundations/palette";

document.fonts.load("52px Guardian Headline Light");
document.fonts.load("700 28px Guardian Text Egyptian");

const DARK = 300;
const MAIN = 400;
const BRIGHT = 500;
const PASTEL = 600;
const FADED = 800;

const HEADLINE_LINE_HEIGHT_MULTIPLIER = 1.05;
const STANDFIRST_LINE_HEIGHT_MULTIPLIER = 1.1;

const TEXT_MARGIN = 25;

const MOBILE_CROP_WIDTH = 525;
const TABLET_CROP_WIDTH = 975;

const MOBILE_SAFE_RATIO = 1.3;
const TABLET_SAFE_RATIO = 1.0;

const MOBILE_CROP_RATIO = 1.7;
const TABLET_CROP_RATIO = 1.1;

const HEADLINE_FONT_SIZE_SMALL = 52;
const HEADLINE_FONT_SIZE_MEDIUM = 68;
const HEADLINE_FONT_SIZE_LARGE = 84;
const HEADLINE_FONT_SIZE_XLARGE = 100;

const scaleFontSizeForTablet = (fontSize: number) => {
  // scale the tablet font size based on the device height ratio so the font size appears consistent between devices
  return Math.floor(fontSize / ((MOBILE_CROP_WIDTH * MOBILE_CROP_RATIO) / (TABLET_CROP_WIDTH * TABLET_CROP_RATIO)))
}

export default {
  gridDomain: process.env.GRID_DOMAIN as string,
  crop: {
    mobile: {
      cropWidth: MOBILE_CROP_WIDTH,
      safeRatio: MOBILE_SAFE_RATIO,
      cropRatio: MOBILE_CROP_RATIO,
      label: "mobile cover card"
    },
    tablet: {
      cropWidth: TABLET_CROP_WIDTH,
      safeRatio: TABLET_SAFE_RATIO,
      cropRatio: TABLET_CROP_RATIO,
      label: "tablet cover card"
    }
  },
  padding: 10,
  headline: {
    font: "Guardian Titlepiece",
    mobile: {
      maxWidth: MOBILE_CROP_WIDTH - TEXT_MARGIN,
      lineHeight: {
        small: HEADLINE_FONT_SIZE_SMALL * HEADLINE_LINE_HEIGHT_MULTIPLIER,
        medium: HEADLINE_FONT_SIZE_MEDIUM * HEADLINE_LINE_HEIGHT_MULTIPLIER,
        large: HEADLINE_FONT_SIZE_LARGE * HEADLINE_LINE_HEIGHT_MULTIPLIER,
        xLarge: HEADLINE_FONT_SIZE_XLARGE * HEADLINE_LINE_HEIGHT_MULTIPLIER
      },
      fontSize: {
        small: HEADLINE_FONT_SIZE_SMALL,
        medium: HEADLINE_FONT_SIZE_MEDIUM,
        large: HEADLINE_FONT_SIZE_LARGE,
        xLarge: HEADLINE_FONT_SIZE_XLARGE
      }
    },
    tablet: {
      maxWidth: TABLET_CROP_WIDTH - TEXT_MARGIN,
      lineHeight: {
        small: scaleFontSizeForTablet(HEADLINE_FONT_SIZE_SMALL) * HEADLINE_LINE_HEIGHT_MULTIPLIER,
        medium: scaleFontSizeForTablet(HEADLINE_FONT_SIZE_MEDIUM) * HEADLINE_LINE_HEIGHT_MULTIPLIER,
        large: scaleFontSizeForTablet(HEADLINE_FONT_SIZE_LARGE) * HEADLINE_LINE_HEIGHT_MULTIPLIER,
        xLarge: scaleFontSizeForTablet(HEADLINE_FONT_SIZE_XLARGE) * HEADLINE_LINE_HEIGHT_MULTIPLIER
      },
      fontSize: {
        small: scaleFontSizeForTablet(HEADLINE_FONT_SIZE_SMALL),
        medium: scaleFontSizeForTablet(HEADLINE_FONT_SIZE_MEDIUM),
        large: scaleFontSizeForTablet(HEADLINE_FONT_SIZE_LARGE),
        xLarge: scaleFontSizeForTablet(HEADLINE_FONT_SIZE_XLARGE)
      }
    }
  },
  standfirst: {
    font: "Guardian Text Egyptian",
    mobile: {
      maxWidth: MOBILE_CROP_WIDTH - TEXT_MARGIN,
      lineHeight: {
        small: 28 * STANDFIRST_LINE_HEIGHT_MULTIPLIER,
        medium: 32 * STANDFIRST_LINE_HEIGHT_MULTIPLIER
      },
      fontSize: {
        small: 28,
        medium: 32
      }
    },
    tablet: {
      maxWidth: TABLET_CROP_WIDTH - TEXT_MARGIN,
      lineHeight: {
        small: 43 * STANDFIRST_LINE_HEIGHT_MULTIPLIER,
        medium: 49 * STANDFIRST_LINE_HEIGHT_MULTIPLIER
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
    collections: ["UK Daily Edition"],
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
