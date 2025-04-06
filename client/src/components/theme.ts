import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: '{colors.white}', _dark: '#141414' }, // Custom dark background
          },
        },
        border: {
          DEFAULT: {
            value: { _light: '{colors.gray.200}', _dark: '#404040' }, // Custom dark border
          },
        },
        'tile-bg': {
          value: { _light: '#efefef', _dark: '#212121' },
        },
      },
    },
  },
  globalCss: {
    '*::selection': {
      bg: 'blue.300',
      color: 'black',
    },
  },
});

export const system = createSystem(defaultConfig, config);
