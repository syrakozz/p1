import { shorthands } from '@tamagui/shorthands';
import { createTamagui } from 'tamagui';
import { fonts, animations, tokens } from './tamagui/tokens';
import { themes } from './tamagui/themes';

const appConfig = createTamagui({
  shorthands,
  fonts,
  animations,
  tokens,
  themes,
});

export type AppConfig = typeof appConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
