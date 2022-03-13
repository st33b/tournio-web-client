import axios from "axios";
import {bowlerCommerceDetailsRetrieved, tournamentDetailsRetrieved} from "./store/actions/registrationActions";

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const doesNotEqual = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue !== filterValue;
  });
};

export const lessThan = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue < filterValue;
  });
};

export const apiHost = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_HOSTNAME}:${process.env.NEXT_PUBLIC_API_PORT}`;

export const retrieveTournamentDetails = (identifier, ...dispatches) => {
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/tournaments/${identifier}`,
    headers: {
      'Accept': 'application/json',
    }
  }
  axios(requestConfig)
    .then(response => {
      dispatches.map(dispatch => {
        dispatch(tournamentDetailsRetrieved(response.data));
      });
    })
    .catch(error => {
      // Let's dispatch a failure, because that's a big deal
    });

}

export const submitNewTeamRegistration = (tournament, teamName, bowlers, onSuccess, onFailure) => {
  const postData = convertTeamDataForServer(tournament, teamName, bowlers);

  const requestConfig = {
    method: 'post',
    url: `${apiHost}/tournaments/${tournament.identifier}/teams`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: postData,
  }
  axios(requestConfig)
    .then(response => {
      onSuccess(response.data);
    })
    .catch(error => {
      console.log("Entry submission failed.");
      console.log(error);
      onFailure(error.response.data);
    });

}

export const submitJoinTeamRegistration = (tournament, team, bowler, onSuccess, onFailure) => {
  // make the post
  const bowlerData = { bowler: convertBowlerDataForPost(tournament, bowler) };
  console.log(bowler);
  const teamId = team.identifier;
  axios.post(`${apiHost}/teams/${teamId}/bowlers`, bowlerData)
    .then(response => {
      const newBowlerIdentifier = response.data.identifier;
      onSuccess(newBowlerIdentifier);
    })
    .catch(error => {
      console.log('womp womp');
      console.log(error);
      console.log(error.response);
      onFailure(error.response.status);
    });

}

///////////////////////////////////////////////

const convertTeamDataForServer = (tournament, teamName, bowlers) => {
  let postData = {
    team: {
      name: teamName,
      bowlers_attributes: []
    }
  };
  for (const bowler of bowlers) {
    postData.team.bowlers_attributes.push(
      convertBowlerDataForPost(tournament, bowler)
    );
  }
  return postData;
}

const convertBowlerDataForPost = (tournament, bowler) => {
  const additionalQuestionResponses = convertAdditionalQuestionResponsesForPost(tournament, bowler);
  return {
    position: bowler.position,
    doubles_partner_num: bowler.doubles_partner_num,
    person_attributes: {
      first_name: bowler.first_name,
      last_name: bowler.last_name,
      usbc_id: bowler.usbc_id,
      igbo_id: bowler.igbo_id,
      birth_month: bowler.birth_month,
      birth_day: bowler.birth_day,
      nickname: bowler.nickname,
      phone: bowler.phone,
      email: bowler.email,
      address1: bowler.address1,
      address2: bowler.address2,
      city: bowler.city,
      state: bowler.state,
      country: bowler.country,
      postal_code: bowler.postal_code,
    },
    additional_question_responses: additionalQuestionResponses,
  };
}

const convertAdditionalQuestionResponsesForPost = (tournament, bowler) => {
  const responses = [];
  for (let key in tournament.additional_questions) {
    responses.push({
      name: key,
      response: bowler[key] || '',
    });
  }
  return responses;
}

////////////////////////////////////////////////

export const fetchBowlerDetails = (bowlerIdentifier, commerceObj, commerceDispatch) => {
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/bowlers/${bowlerIdentifier}`,
    headers: {
      'Accept': 'application/json',
    }
  }
  axios(requestConfig)
    .then(response => {
      const bowlerData = response.data.bowler;
      const availableItems = response.data.available_items;
      commerceDispatch(bowlerCommerceDetailsRetrieved(bowlerData, availableItems));

      // Make sure the tournament in context matches that of the bowler.
      // If it doesn't, retrieve the bowler's tournament so we can put it
      // into context.
      if (commerceObj.tournament) {
        const contextTournamentId = commerceObj.tournament.identifier;
        const bowlerTournamentId = bowlerData.tournament.identifier;

        if (contextTournamentId !== bowlerTournamentId) {
          retrieveTournamentDetails(bowlerTournamentId, commerceDispatch);
        }
      }
    })
    .catch(error => {
      // Display some kind of error message
      console.log('Whoops!');
    });
}

////////////////////////////////////////////////////

export const directorApiRequest = ({uri, requestConfig, context, router, onSuccess = null, onFailure = null, redirectOnUnauthorized = true}) => {
  const url = `${apiHost}${uri}`;
  const config = {...requestConfig};
  config.url = url;
  config.headers = {...requestConfig.headers}
  config.headers['Accept'] = 'application/json';
  config.headers['Authorization'] = context.token;
  config.validateStatus = (status) => { return status < 500 }
  axios(config)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);
      } else if (response.status === 401 && redirectOnUnauthorized) {
        context.logout();
        router.push('/director/login');
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

export const directorApiLoginRequest = ({userCreds, context, onSuccess = null, onFailure = null}) => {
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
        const authHeader = response.headers.authorization;
        const userData = response.data;
        context.login(authHeader, userData);
        onSuccess(response.data);
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
