import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { myStore, store } from "@/Store/store";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={myStore}> */}
          <Toaster />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        {/* </PersistGate> */}
      </Provider>
    </ThemeProvider>
  );
}
