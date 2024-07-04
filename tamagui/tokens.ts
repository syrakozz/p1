import { createAnimations } from '@tamagui/animations-react-native';
import { Variable, createTokens } from '@tamagui/web';
import { radius, size, space, zIndex } from '@tamagui/themes';
import {
  crimson,
  crimsonDark,
  green,
  greenDark,
  red,
  redDark,
  orange,
  orangeDark,
  yellow,
  yellowDark,
  blue,
  blueDark,
  whiteA,
  blackA,
} from '@tamagui/colors';
import { createInterFont } from '@tamagui/font-inter';

export const colorTokens = {
  light: {
    crimson: crimson,
    green: green,
    red: red,
    orange: orange,
    yellow: yellow,
    blue: blue,
    neutral: whiteA,
  },
  dark: {
    crimson: crimsonDark,
    green: greenDark,
    red: redDark,
    orange: orangeDark,
    yellow: yellowDark,
    blue: blueDark,
    neutral: blackA,
  },
};

export const darkColors = {
  ...colorTokens.dark.crimson,
  ...colorTokens.dark.green,
  ...colorTokens.dark.red,
  ...colorTokens.dark.orange,
  ...colorTokens.dark.yellow,
  ...colorTokens.dark.blue,
  ...colorTokens.dark.neutral,
};

export const lightColors = {
  ...colorTokens.light.crimson,
  ...colorTokens.light.green,
  ...colorTokens.light.red,
  ...colorTokens.light.orange,
  ...colorTokens.light.yellow,
  ...colorTokens.light.blue,
  ...colorTokens.light.neutral,
};

export const color = {
  ...postfixObjKeys(lightColors, 'Light'),
  ...postfixObjKeys(darkColors, 'Dark'),
};

function postfixObjKeys<A extends { [key: string]: Variable<string> | string }, B extends string>(
  obj: A,
  postfix: B
): {
  [Key in `${keyof A extends string ? keyof A : never}${B}`]: Variable<string> | string;
} {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${k}${postfix}`, v])) as any;
}

export const tokens = createTokens({
  color,
  radius,
  zIndex,
  space,
  size,
});

export const animations = createAnimations({
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
});

const headingFont = createInterFont();
const bodyFont = createInterFont();

export const fonts = {
  heading: headingFont,
  body: bodyFont,
};
