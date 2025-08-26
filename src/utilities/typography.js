// src/utilities/typography.js
import Fonts from './fonts';
import Colors from './colors';

const Typography = {
  // Heading Styles
  h1: {
    fontFamily: Fonts.urbanist.bold,
    fontSize: Fonts.sizes['4xl'],
    color: Colors.textPrimary,
    lineHeight: Fonts.sizes['4xl'] * Fonts.lineHeights.tight,
  },
  h2: {
    fontFamily: Fonts.urbanist.bold,
    fontSize: Fonts.sizes['3xl'],
    color: Colors.textPrimary,
    lineHeight: Fonts.sizes['3xl'] * Fonts.lineHeights.tight,
  },
  h3: {
    fontFamily: Fonts.urbanist.semiBold,
    fontSize: Fonts.sizes['2xl'],
    color: Colors.textPrimary,
    lineHeight: Fonts.sizes['2xl'] * Fonts.lineHeights.tight,
  },
  h4: {
    fontFamily: Fonts.urbanist.semiBold,
    fontSize: Fonts.sizes.xl,
    color: Colors.textPrimary,
    lineHeight: Fonts.sizes.xl * Fonts.lineHeights.tight,
  },

  // Body Styles
  body: {
    fontFamily: Fonts.urbanist.regular,
    fontSize: Fonts.sizes.base,
    color: Colors.textPrimary,
    lineHeight: Fonts.sizes.base * Fonts.lineHeights.normal,
  },
  bodySmall: {
    fontFamily: Fonts.urbanist.regular,
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: Fonts.urbanist.regular,
    fontSize: Fonts.sizes.lg,
    color: Colors.textPrimary,
    lineHeight: Fonts.sizes.lg * Fonts.lineHeights.normal,
  },

  // Button Styles
  button: {
    fontFamily: Fonts.urbanist.medium,
    fontSize: Fonts.sizes.base,
    color: Colors.white,
    lineHeight: Fonts.sizes.base * Fonts.lineHeights.normal,
  },
  buttonSmall: {
    fontFamily: Fonts.urbanist.medium,
    fontSize: Fonts.sizes.sm,
    color: Colors.white,
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.normal,
  },

  // Label Styles
  label: {
    fontFamily: Fonts.urbanist.medium,
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: Fonts.sizes.sm * Fonts.lineHeights.normal,
  },

  // Caption Styles
  caption: {
    fontFamily: Fonts.urbanist.regular,
    fontSize: Fonts.sizes.xs,
    color: Colors.textTertiary,
    lineHeight: Fonts.sizes.xs * Fonts.lineHeights.normal,
  },
};

export default Typography;