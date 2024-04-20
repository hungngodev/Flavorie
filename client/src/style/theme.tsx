import { createBreakpoints } from "@chakra-ui/theme-tools";

const theme = {
    styles: {
        global: {
        "html, body": {
            fontFamily: "Inter, sans-serif",
            bg: "base.d400",
            color: "gray.200",
            h: "full",
        },
        "#root": {
            alignItems: "center",
            display: "flex",
            h: "full",
        },
        },
    },
    breakpoints: createBreakpoints({
        xs: "30em",
        sm: "36em",
        md: "46.25em",
        lg: "62.5em",
        xl: "78.125em",
        xxl: "95em",
    }),
    colors: {
        base: {
        50: "#eceff1",
        100: "#cfd8dc",
        200: "#b0bec5",
        300: "#90a4ae",
        400: "#78909c",
        500: "#607d8b",
        600: "#546e7a",
        700: "#455a64",
        800: "#37474f",
        900: "#263238",
        d100: "#E1CDC1",
        d200: "#12181B",
        d400: "#FFFFFF",
        d700: "#080C0D",
        },
        black: {
        50: "#36454F",
        100: "#353935",
        200: "#343434",
        300: "#28282B",
        400: "#000000",
        },
        brown: {
        100: "B79E8F",
        300: "604F44",
        400: "3A2B22",
        },

        // CDB6A8 #1B1212
    },
    components: {
        Heading: {
        baseStyle: {
            fontFamily: "inherit",
            fontWeight: "normal",
            color: "inherit",
        },
        },
        Text: {
        baseStyle: {
            fontFamily: "inherit",
            fontWeight: "normal",
            lineHeight: "tall",
            color: "inherit",
        },
        },
        Button: {
        baseStyle: {
            textTransform: "uppercase",
            letterSpacing: "widest",
            fontWeight: "normal",
            userSelect: "none",
        },
        },
    },
};

export default theme;
