import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {useEffect} from "react";

import '../styles.scss';

import {DirectorContextProvider} from "../store/DirectorContext";
import {RegistrationContextProvider} from "../store/RegistrationContext";

function MyApp({Component, pageProps})  {
  useEffect(() => {
    import('bootstrap');
  }, []);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <DirectorContextProvider>
      <RegistrationContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </RegistrationContextProvider>
    </DirectorContextProvider>
  );
}

export default MyApp;