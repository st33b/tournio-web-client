import {useEffect} from "react";
import { Analytics } from "@vercel/analytics/react";

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

    return (
      <DirectorContextProvider>
        <CommerceContextProvider>
          <RegistrationContextProvider>
            <>
              {getLayout(<Component {...pageProps} />)}
              <Analytics/>
            </>
          </RegistrationContextProvider>
        </CommerceContextProvider>
      </DirectorContextProvider>
    );
}

export default MyApp;
