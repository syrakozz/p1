import { ThemeDefinitions, createThemeBuilder } from '@tamagui/theme-builder';
import { componentThemeDefinitions as tgComponentThemeDefinitions, masks, shadows, templates } from '@tamagui/themes';
import { darkColors, lightColors } from './tokens';
import { palettes } from './palettes';
import Config from 'react-native-config';

type Masks = typeof masks;

const componentThemeDefinitions = {
  ...tgComponentThemeDefinitions,
  Button: {
    mask: 'inverseSoften',
  },
} satisfies ThemeDefinitions<keyof Masks>;

const colorThemeDefinition = (colorName: string) => [
  {
    parent: 'light',
    palette: colorName,
    template: 'colorLight',
  },
  {
    parent: 'dark',
    palette: colorName,
    template: 'base',
  },
];

const themesBuilder = createThemeBuilder()
  .addPalettes(palettes)
  .addTemplates(templates)
  .addMasks(masks)
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
      nonInheritedValues: {
        ...lightColors,
        ...shadows.light,
      },
    },
    dark: {
      template: 'base',
      palette: 'dark',
      nonInheritedValues: {
        ...darkColors,
        ...shadows.dark,
      },
    },
  })
  .addChildThemes({
    primary: Config.PUBLIC_WHITELABEL === '2xl' ? colorThemeDefinition('orange') : colorThemeDefinition('crimson'),
    success: colorThemeDefinition('green'),
    error: colorThemeDefinition('red'),
    warning: colorThemeDefinition('yellow'),
    info: colorThemeDefinition('blue'),
    neutral: colorThemeDefinition('neutral'),
  })
  .addChildThemes({
    subtle: {
      mask: 'soften3',
      skip: {
        color: 1,
      },
    },
    inverse: {
      mask: 'inverseSoften',
      skip: {
        color: 1,
      },
    },
    // used by tamagui
    active: {
      mask: 'soften3',
      skip: {
        color: 1,
      },
    },
  })
  .addChildThemes(componentThemeDefinitions);

export const themes = themesBuilder.build();
