process.env.TAMAGUI_TARGET = 'native';

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'transform-inline-environment-variables',
    [
      'module-resolver',
      {
        alias: {
          $components: ['./src/components/index.ts'],
          $layout: ['./src/layout/index.ts'],
          $hooks: ['./src/hooks/index.ts'],
        },
      },
    ],
  ],
};
