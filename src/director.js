import axios from "axios";
import {useRouter} from "next/router";
import useSWR from "swr";
import {apiHost, devConsoleLog, useLocalStorage} from "./utils";
import {useLoginContext} from "./store/LoginContext";

const handleSuccess = (response, onSuccess, onFailure) => {
  if (response.status >= 200 && response.status < 300) {
    if (onSuccess) {
      onSuccess(response.data);
    }
  } else if (response.status === 401) {
    onFailure('Unauthorized');
  } else if (response.status === 404) {
    if (onFailure) {
      onFailure('Not found');
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
      callbackFn('The server did not respond');
    }
  } else {
    if (callbackFn) {
      callbackFn(error);
    }
  }
}

// We can use this for fetching data from the API required by a component, but that's it.
// It'll make the pages that need it smaller, since they won't have to worry about
// handing over the user auth token, among other things.
export const useDirectorApi = ({
                                 uri,
                                 onSuccess = () => {},
                                 onFailure = () => {},
                                 initialData = null
}) => {
  const {authToken, ready, logout} = useLoginContext();
  const router = useRouter();

  const handleSuccess = (data, key, config) => {
    onSuccess(data);
  }

  const handleError = (error, key, config) => {
    if (error.status === 401) {
      devConsoleLog("Unauthorized request. Logging out and going back to the login page.");
      logout();
      router.replace('/director/login');
    } else {
      devConsoleLog("Unusual Error: ", error.message);
      onFailure(error.message);
    }
  }

  /////////////////
  // This prevents SWR from making the request if we don't have a URI yet (which may be
  // the case when pulling URI details from, say, one or more query parameters
  const swrKey = uri ? [`${apiHost}/director${uri}`, authToken, ready] : null;
  // devConsoleLog("SWR Key:", swrKey);
  const swrOptions = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    onSuccess: handleSuccess,
    onError: handleError,
    fallbackData: initialData,
  };
  const swrFetcher = async (url, token, clientReady) => {
    if (token) {
      const headers = new Headers();
      headers.append("Authorization", token);
      headers.append("Accept", "application/json");

      // @hooks_todo Merge requestConfig in here when we get to the point where we need to.
      const fetchInit = {
        method: 'GET',
        headers: headers,
      }

      const response = await fetch(url, fetchInit);

      if (!response.ok) {
        const error = new Error('Received an error from the server.');
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
  /////////////////

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    ([requestUrl, clientToken, clientReady]) => swrFetcher(requestUrl, clientToken, clientReady),
    swrOptions
  );

  return {
    loading: isLoading,
    data,
    error,
    onDataUpdate: (newData) => mutate(newData),
  }
}

// This is meant to be used for on-demand requests, such as writes and anything else that
// happens outside the context of a page load
export const directorApiRequest = ({uri, requestConfig, authToken, onSuccess = null, onFailure = null}) => {
  const url = `${apiHost}/director${uri}`;
  const config = {...requestConfig};
  config.url = url;
  config.headers = {...requestConfig.headers}
  config.headers['Accept'] = 'application/json';
  config.headers['Authorization'] = authToken;
  config.validateStatus = (status) => status < 500;
  axios(config)
    .then(response => {
      if (response.status >= 200 && response.status < 400) {
        handleSuccess(response, onSuccess, onFailure);
      } else {
        const message = response.data && response.data.error ? response.data.error : 'Something went wrong with that request.';
        const err = new Error(message);
        throw err;
      }
    })
    .catch(error => {
      devConsoleLog("Nope.", error);
      handleError(error, onFailure);
    });
}

export const directorApiDownloadRequest = ({uri, authToken, onSuccess = null, onFailure = null}) => {
  const url = `${apiHost}/director${uri}`;
  const config = {
    method: 'get',
    url: url,
    headers: {
      'Authorization': authToken,
    },
    responseType: 'blob',
    validateStatus: (status) => status < 500,
  }
  axios(config)
    .then(response => {
      handleSuccess(response, onSuccess, onFailure)
    })
    .catch(error => {
      devConsoleLog("Nope.", error);
      handleError(error, onFailure);
    });
}

////////////////////
// Experimental hook
////////////////////
export const useTournament = (onSuccess = () => {}) => {
  const router = useRouter();
  const {identifier} = router.query;

  const {loading, data: tournament, error, onDataUpdate: tournamentUpdated} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}` : null,
    onSuccess: onSuccess,
  });

  const tournamentUpdatedQuietly = (updatedTournament) => {
    const mutateOptions = {
      optimisticData: updatedTournament,
      rollbackOnError: true,
      populateCache: true,
    }
    tournamentUpdated(updatedTournament, mutateOptions);
  }

  return {
    loading,
    error,
    tournament,
    tournamentUpdated,
    tournamentUpdatedQuietly,
  };
}
