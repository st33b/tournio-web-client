import App from 'next/app';
import {AuthContextProvider} from "../store/AuthContext";
import {RegistrationContextProvider} from "../store/RegistrationContext";
import {TournamentContextProvider} from "../store/TournamentContext";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../styles.scss';

class MyApp extends App  {
  render () {
    const { Component, pageProps} = this.props;

    const getLayout = Component.getLayout || ((page) => page);

    return (
      <AuthContextProvider>
        <RegistrationContextProvider>
          <TournamentContextProvider>
            {getLayout(<Component {...pageProps} />)}
          </TournamentContextProvider>
        </RegistrationContextProvider>
      </AuthContextProvider>
    );
  }
}

export default MyApp;