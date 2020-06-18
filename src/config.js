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
    uk: {
      white: "#eeeeee",
      red: "#c70000",
      blue: "#052962",
      yellow: "#ffe500",
      grey: "#ececec"
    },
    australia: {
      white: "#ffffff",
      blue: "#041F4A",
      ochre: "#A1845C",
      purple: "#7D0068",
      orange: "#E05E00"
    }
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
