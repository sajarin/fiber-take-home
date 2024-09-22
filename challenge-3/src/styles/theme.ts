// theme.ts
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/spline-sans";

const theme = extendTheme({
  fonts: {
    heading: '"Spline Sans", sans-serif',
    body: "system-ui, sans-serif",
  },
  colors: {
    fiber_purple: "#6b47c1",
  },
});

export default theme;
