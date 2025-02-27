import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";

// Tailwind and other styles
import "@/styles/globals.css";
import theme from "@/styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
