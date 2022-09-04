import {useEffect} from "react";
import {useRouter} from "next/router";

import '../scss/tournio-bs.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../scss/styles.scss';

import {DirectorContextProvider} from "../store/DirectorContext";
import {RegistrationContextProvider} from "../store/RegistrationContext";
import {CommerceContextProvider} from "../store/CommerceContext";

const APP_VERSION = 'app_version';

function MyApp({Component, pageProps})  {
  useEffect(() => {
    import('bootstrap');

    const myVersion = localStorage.getItem(APP_VERSION);
    if (myVersion === null || myVersion !== process.env.NEXT_PUBLIC_TOURNIO_CLIENT_VERSION) {
      localStorage.setItem(APP_VERSION, process.env.NEXT_PUBLIC_TOURNIO_CLIENT_VERSION);
    }
  }, []);

  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  if (router.pathname.startsWith('/director')) {
    return (
      <DirectorContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </DirectorContextProvider>
    );
  }

  return (
    <CommerceContextProvider>
      <RegistrationContextProvider>
        {getLayout(<Component {...pageProps} />)}
      </RegistrationContextProvider>
    </CommerceContextProvider>
  );
}

export default MyApp;