const theme = {
  colors: {
    base: {
      50: '#eceff1',
      100: '#cfd8dc',
      200: '#b0bec5',
      300: '#90a4ae',
      400: '#78909c',
      500: '#607d8b',
      600: '#546e7a',
      700: '#455a64',
      800: '#37474f',
      900: '#263238',
      d100: '#E1CDC1',
      d200: '#12181B',
      d400: '#FFFFFF',
      d700: '#080C0D',
    },
    blue: {
      100: '#6CB4EE',
      200: '#2a52be',
      250: '#0066b2',
      300: '#0039a6',
      350: '#034694',
      400: '#00308F',
      500: '#002D62',
      600: '#002244',
    },
    black: {
      50: '#36454F',
      100: '#353935',
      200: '#343434',
      300: '#28282B',
      400: '#000000',
    },
    brown: {
      20: '#F6F5F2',
      100: 'B79E8F',
      300: '604F44',
      400: '3A2B22',
    },
    palette_purple: '#736CED',
    palette_indigo: '#9F9FED',
    palette_lavender: '#D4C1EC',
    palette_pink: '#FFC0CB',
    palette_blue: '#BDE0FE',

    purple: {
    20: '#fef9ff',  // light_purple previously
    500: '#974EC3',
  }
    // CDB6A8 #1B1212
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: 'inherit',
        fontWeight: 'normal',
        color: 'inherit',
      },
    },
    Text: {
      baseStyle: {
        fontFamily: 'inherit',
        fontWeight: 'normal',
        lineHeight: 'tall',
        color: 'inherit',
      },
    },
    Button: {
      variants: {
        solid: {
          bg: '#736CED',
          color: 'white',
          _hover: {
            bg: '#9F9FED',
          },
          _active: {
            bg: '#9F9FED',
          },
        },
        outline: {
          borderColor: '#9F9FED', // indigo
          color: '#736CED', // purple
          _hover: {
            bg: '#fef9ff', // light purple
          },
          _active: {
            bg: '#fef9ff',
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          borderColor: '#D4C1EC',
          _focus: {
            borderColor: '#736CED',
          },
        },
      },
    },
  },
};

export default theme;
