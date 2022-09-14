import axios from "axios";
import {apiHost} from "../utils";
import {useDirectorContext} from "./DirectorContext";
import {loggedIn, loggedOut} from "./actions/directorActions";
import {useRouter} from "next/router";

const handleError = (error, callbackFn) => {
  if (error.request) {
    console.log('No response was received.');
    if (callbackFn) {
      callbackFn({error: 'The server did not respond'});
    }
  } else {
    console.log('Exceptional error', error.message);
    if (callbackFn) {
      callbackFn({error: error.message});
    }
  }
}

export const directorLogin = ({userCreds, dispatch, onSuccess = null, onFailure = null}) => {
  const config = {
    url: `${apiHost}/login`,
    headers: {
      'Accept': 'application/json',
    },
    method: 'post',
    data: userCreds,
    validateStatus: (status) => { return status < 500 },
  };
  axios(config)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        const authToken = response.headers.authorization;
        const userData = response.data;
        dispatch(loggedIn(userData, authToken));
        if (onSuccess) {
          onSuccess();
        }
      } else {
        if (onFailure) {
          onFailure(response.data);
        }
      }
    })
    .catch(error => {
      handleError(error, onFailure);
    });
}

export const directorLogout = ({dispatch, onSuccess = null, onFailure = null}) => {
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
        dispatch(loggedOut());
        if (onSuccess) {
          onSuccess();
        }
      } else {
        if (onFailure) {
          onFailure({error: 'Got a strange response from the server.'});
        }
      }
    })
    .catch(error => {
      handleError(error, onFailure);
    });
}

export const directorApiRequest = ({uri, requestConfig, context, onSuccess = null, onFailure = null}) => {
  const url = `${apiHost}${uri}`;
  const config = {...requestConfig};
  config.url = url;
  config.headers = {...requestConfig.headers}
  config.headers['Accept'] = 'application/json';
  config.headers['Authorization'] = context.directorState.user.authToken;
  config.validateStatus = (status) => { return status < 500 }
  axios(config)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);
      } else if (response.status === 401) {
        context.dispatch(loggedOut());
        onFailure({error: 'Login session timed out'})
      } else if (response.status === 404) {
        onFailure({error: 'Not found'});
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      handleError(error, onFailure);
    });
}