// Colours — dark theme (default)
export const COLORS = {
  bg:       '#080A0F',   // Main background — near black
  surface:  '#0F1218',   // Card and panel background
  border:   '#1C2030',   // Dividers and borders
  borderB:  '#252A38',   // Hover/active borders
  gold:     '#D4AF6A',   // Primary accent — LexStar gold
  goldDim:  '#8A6F3E',   // Muted gold
  blue:     '#4A9EFF',   // Markets / data accent
  green:    '#3ECF8E',   // Verified / positive
  red:      '#FF5C5C',   // Breaking / negative
  purple:   '#A78BFA',   // Legal accent
  text:     '#E8E4DC',   // Primary text
  textMid:  '#8A8880',   // Secondary text
  textDim:  '#383840',   // Placeholder / disabled
  student:  '#6C8EFF',   // Student plan accent
};

// Colours — light theme
export const LIGHT_COLORS = {
  bg:       '#F8F6F2',
  surface:  '#FFFFFF',
  border:   '#E8E4DC',
  borderB:  '#D0CCC5',
  gold:     '#D4AF6A',
  goldDim:  '#8A6F3E',
  blue:     '#4A9EFF',
  green:    '#3ECF8E',
  red:      '#FF5C5C',
  purple:   '#A78BFA',
  text:     '#0D0F14',
  textMid:  '#5A5A60',
  textDim:  '#C0BDB8',
  student:  '#6C8EFF',
};

export function getColors(isDark) {
  return isDark !== false ? COLORS : LIGHT_COLORS;
}

// Typography
export const FONTS = {
  serif:      'DMSerifDisplay',       // Headlines
  sans:       'DMSans',               // Body / UI
};

// Spacing scale
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// Border radius
export const RADIUS = {
  sm:  6,
  md:  12,
  lg:  20,
  full: 999,
};

// Category accent colours
export const CATEGORY_COLORS = {
  breaking: '#FF5C5C',
  legal:    '#A78BFA',
  markets:  '#4A9EFF',
  finance:  '#D4AF6A',
};
