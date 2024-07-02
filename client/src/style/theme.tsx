import '@fontsource/reddit-mono'; // Defaults to weight 400
import { FaUserCircle } from 'react-icons/fa';
const theme = {
    useSystemColorMode: true,
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
        indigo: '#8978D9',
        palette_purple: '#736CED',
        palette_indigo: '#9F9FED',
        palette_lavender: '#D4C1EC',
        palette_pink: '#FFC0CB',
        palette_blue: '#BDE0FE',
        bone_white: '#F9F6EE',
        white_purple: '#fef9ff',
    },
    gradients: {
        palette_purple_gradient: `linear-gradient(to right top, #736ced, #7b76ee, #837fee, #8c89ee, #9492ee, #969df1, #99a7f3, #9eb1f5, #a1bef9, #a7cafb, #b0d5fd, #bde0fe)`,
    },
    fonts: {
        body: 'reddit-mono, sans-serif',
        heading: 'reddit-mono, sans-serif',
    },
    components: {
        Heading: {
            baseStyle: {
                fontFamily: 'inherit',
                fontWeight: 'semibold',
                color: 'inherit',
                fontSize: 'lg',
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
                    bg: '#736CED', // purple
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
        // IconButton: {
        //     baseStyle: {
        //         _hover: {
        //             bg: '#eceff1', // palette_lavender
        //         },
        //     },
        //     variants: {
        //         solid: {
        //             bg: '#9F9FED', // palette_indigo
        //             color: 'white',
        //             _hover: {
        //                 bg: '#D4C1EC', // palette_lavender
        //                 color: 'white',
        //             },
        //         },
        //     },
        // },
        Avatar: {
            icon: FaUserCircle,
        },
    },
};

export default theme;
