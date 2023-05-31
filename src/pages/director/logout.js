import React, {useEffect} from "react";
import {useRouter} from "next/router";
import axios from "axios";

import {apiHost, devConsoleLog, useClientReady} from "../../utils";
import DirectorLayout from '../../components/Layout/DirectorLayout/DirectorLayout';
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import {useLoginContext} from "../../store/LoginContext";

const Logout = () => {
  const router = useRouter();
  const {logout} = useLoginContext();

  const directorLogout = () => {
    const config = {
      url: `${apiHost}/logout`,
      headers: {
        'Accept': 'application/json',
      },
      method: 'delete',
      validateStatus: (status) => { return status < 500 },
    };
    axios(config)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          logout();
          router.push('/director/login');
        }
      })
      .catch(error => {
        devConsoleLog('Got a strange response from the server.', error);
      });
  }

  useEffect(() => {
    if (!router) {
      return;
    }
    directorLogout();
  }, [router]);

  const ready = useClientReady();
  if (!ready) {
    return '';
  }

  return (
    <LoadingMessage message={'Logging you out...'} />
  );
}

Logout.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Logout;
