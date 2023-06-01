import axios from "axios";
import {apiHost, devConsoleLog, useLocalStorage} from "./utils";
import {useDirectorContext} from "./store/DirectorContext";
import {useEffect, useState} from "react";
import {useLoginContext} from "./store/LoginContext";
import {useRouter} from "next/router";
import useSWR, {unstable_serialize} from "swr";

export const useLoggedIn = () => {
  devConsoleLog("DEPRECATED: useLoggedIn hook. Prefer useLoginContext instead");
  const {directorState} = useDirectorContext();
  const [loggedIn, setLoggedIn] = useState(-1);

  const currentState = loggedIn;
  useEffect(() => {
    if (!directorState) {
      return;
    }
    if (!directorState.user) {
      setLoggedIn(0);
      return;
    }

    setLoggedIn(1);
  }, [directorState.user]);
  return currentState;
}

const handleSuccess = (response, onSuccess, onFailure) => {
  if (response.status >= 200 && response.status < 300) {
    if (onSuccess) {
      onSuccess(response.data);
    }
  } else if (response.status === 401) {
    onFailure({error: 'Unauthorized'});
  } else if (response.status === 404) {
    if (onFailure) {
      onFailure({error: 'Not found'});
    }
  } else {
    if (onFailure) {
      onFailure(response.data);
    }
  }
}

const handleError = (error, callbackFn) => {
  if (error.request) {
    console.log('No response was received.');
    if (callbackFn) {
      callbackFn({error: 'The server did not respond'});
    }
  } else {
    devConsoleLog('Exceptional error', error);
    if (callbackFn) {
      callbackFn(error);
    }
  }
}

export const directorApiRequest = ({uri, requestConfig, onSuccess = null, onFailure = null}) => {
  const url = `${apiHost}${uri}`;
  const config = {...requestConfig};
  config.url = url;
  config.headers = {...requestConfig.headers}
  config.headers['Accept'] = 'application/json';
  config.validateStatus = (status) => status < 500;
  devConsoleLog("Config used for Axios:", config);
  axios(config)
    .then(response => {
      handleSuccess(response, onSuccess, onFailure);
    })
    .catch(error => {
      handleError(error, onFailure);
    });

}

export const useDirectorApi = ({uri, requestConfig}) => {
  const {authToken, ready, logout} = useLoginContext();
  const router = useRouter();

  const authorizedFetcher = async (uri, token, clientReady) => {
    if (token) {
      const headers = new Headers();
      headers.append("Authorization", token);
      headers.append("Accept", "application/json");
      // Here's where we can add more

      const fetchInit = {
        method: 'GET',
        headers: headers,
      }

      const response = await fetch(`${apiHost}/director${uri}`, fetchInit);

      if (!response.ok) {
        const error = new Error('Received an error from the API');
        error.info = await response.text();
        error.status = response.status;
        throw error;
      }

      return response.json();
    } else if (clientReady) {
      const error = new Error('Tried to make an API request without a token. Tsk tsk.');
      error.status = 401;
      throw error;
    }
  }

  const handleError = (error, key, config) => {
    if (error.status === 401) {
      devConsoleLog("Unauthorized request. Logging out and going back to the login page.");
      logout();
      router.replace('/director/login');
    } else {
      devConsoleLog("Unusual Error: ", error.message);
    }
  }

  const { data, error, isLoading } = useSWR(
    [
      uri,
      authToken,
      ready
    ],
    ([uri, token, clientReady]) => authorizedFetcher(uri, token, clientReady),
    {
      fallbackData: [],
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: handleError,
    }
  );

  return {
    loading: isLoading,
    data,
    error,
  }
}

export const directorApiDownloadRequest = ({uri, context, onSuccess = null, onFailure = null}) => {
  const url = `${apiHost}${uri}`;
  const config = {
    method: 'get',
    url: url,
    headers: {
      'Authorization': context.directorState.user.authToken,
    },
    responseType: 'blob',
    validateStatus: (status) => status < 500,
  }
  axios(config)
    .then(response => {
      handleSuccess(response, context.dispatch, onSuccess, onFailure)
    })
    .catch(error => {
      handleError(error, onFailure);
    });
}
