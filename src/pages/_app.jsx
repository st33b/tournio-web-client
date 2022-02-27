import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {useEffect} from "react";

import '../styles.scss';

import {AuthContextProvider} from "../store/AuthContext";
import {RegistrationContextProvider} from "../store/RegistrationContext";

function MyApp({Component, pageProps})  {
  useEffect(() => {
    import('bootstrap');
  }, []);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AuthContextProvider>
      <RegistrationContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </RegistrationContextProvider>
    </AuthContextProvider>
  );
}

export default MyApp;