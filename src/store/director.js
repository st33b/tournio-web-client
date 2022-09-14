import axios from "axios";
import {apiHost} from "../utils";
import {useDirectorContext} from "./DirectorContext";
import {loggedIn} from "./actions/directorActions";

export const directorLogin = ({userCreds, onSuccess = null, onFailure = null}) => {
  const context = useDirectorContext();
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
        context.dispatch(loggedIn(userData, authToken));
        onSuccess();
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      if (error.request) {
        console.log('No response was received.');
        onFailure({error: 'The server did not respond'});
      } else {
        console.log('Exceptional error', error.message);
        onFailure({error: error.message});
      }
    });
}
