import { COLORS, FONTS } from './theme';

export const TEXT = {
  // Headlines — DM Serif Display
  displayLg: {
    fontFamily: FONTS.serif,
    fontSize: 32,
    lineHeight: 38,
    color: COLORS.text,
  },
  displayMd: {
    fontFamily: FONTS.serif,
    fontSize: 24,
    lineHeight: 30,
    color: COLORS.text,
  },
  displaySm: {
    fontFamily: FONTS.serif,
    fontSize: 20,
    lineHeight: 26,
    color: COLORS.text,
  },
  headlineLg: {
    fontFamily: FONTS.serif,
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.text,
  },
  headlineMd: {
    fontFamily: FONTS.serif,
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.text,
  },

  // Body / UI — DM Sans
  bodyLg: {
    fontFamily: FONTS.sans,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  bodyMd: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
  },
  bodySm: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textMid,
  },
  caption: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textMid,
  },
  label: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    lineHeight: 14,
    color: COLORS.textDim,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelMd: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textMid,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
};
