import App from 'next/app';
import {AuthContextProvider} from "../store/AuthContext";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../styles.scss';

class MyApp extends App  {
  render () {
    const { Component, pageProps} = this.props;

    const getLayout = Component.getLayout || ((page) => page);

    return (
      <AuthContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </AuthContextProvider>
    );
  }
}

export default MyApp;