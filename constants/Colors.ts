/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  textPrimary: '#F7FAFF',
  textSecondary: '#858E9F',
  accent:'#14A8CC',
  tabIconDefault: '',
  tabIconSelected: '',
  backgroundDark: '#121315',
  backgroundMedium: '#1C1F26',
  backgroundPopup: '#28282c',
  backgroundStatusBar: '#0B0B0D',
  buttonPrimary: '#14A8CC',
  buttonSecondary: '#6d767c',
  buttonAlternative: '#F5103B',
  defaultTagColor: '#7e7e7e'
};

export const COLOR_PALETTE: string[][] = [
  // Red Shades
  ['#FFE5E5', '#FFB3B3', '#FF6666', '#FF3333', '#CC0000'],

  // Green Shades
  ['#E5FFE5', '#B3FFB3', '#66FF66', '#33FF33', '#00CC00'],

  // Blue Shades
  ['#E5F0FF', '#B3D1FF', '#66A3FF', '#3385FF', '#0052CC'],

  // Purple Shades
  ['#F0E5FF', '#D1B3FF', '#A366FF', '#8533FF', '#6600CC'],

  // Yellow Shades
  ['#FFFFE5', '#FFFFB3', '#FFFF66', '#FFFF33', '#CCCC00'],

  // Orange Shades
  ['#FFE5CC', '#FFCC99', '#FF9933', '#FF6600', '#CC5200'],

  // Black Shades
  ['#F2F2F2', '#D9D9D9', '#BFBFBF', '#A6A6A6', '#808080'],
];
