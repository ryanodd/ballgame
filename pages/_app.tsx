import "../styles/globals.css";
import type { AppProps } from "next/app";
import configureStore from "../src/redux/configureStore";
import { Provider } from "react-redux";
import { useEffect } from "react";
import "antd/dist/antd.css";
import Head from "next/head";

export const store = configureStore();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
