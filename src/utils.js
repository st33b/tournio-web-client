import axios from "axios";
import {
  bowlerCommerceDetailsRetrieved,
} from "./store/actions/registrationActions";
import {useEffect, useState} from "react";
import useSWR from "swr";

export const useStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedValue = sessionStorage.getItem(key);
      if (savedValue !== null) {
        return JSON.parse(savedValue);
      }
    }
    return initialValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

export const useLocalStorage = ({key, initialValue = null}) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(key);
      if (savedValue !== null) {
        return JSON.parse(savedValue);
      }
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

export const useClientReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return ready;
}

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

export const equals = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue === filterValue;
  });
};

export const lessThan = (rows, id, filterValue) => {
  return rows.filter(row => {
    const rowValue = row.values[id];
    return rowValue < filterValue;
  });
};

export const isOrIsNot = (rows, id, filterValue) => {
  if (filterValue === '') {
    return rows;
  }
  return rows.filter(row => {
    return row.values[id] === filterValue;
  });
}

export const tournamentName = (rows, id, filterValue) => {
  if (filterValue === '') {
    return rows.filter(row => {
      return row.values[id].length === 0;
    });
  }
  return rows.filter(row => row.values[id].some(t => t.name === filterValue));
}

export const devConsoleLog = (message, object = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] ${message}`, object);
  }
}

export const timezones = {
  'Pacific/Honolulu': {
    key: 'Pacific/Honolulu',
    display: 'Hawaii (HST)',
  },
  'America/Adak': {
    key: 'America/Adak',
    display: 'Hawaii-Aleutian (HST/HDT)',
  },
  'America/Anchorage': {
    key: 'America/Anchorage',
    display: 'Alaska (AKST/AKDT)',
  },
  'America/Los_Angeles': {
    key: 'America/Los_Angeles',
    display: 'Pacific (PST/PDT)',
  },
  'America/Phoenix': {
    key: 'America/Phoenix',
    display: 'Phoenix (MST)',
  },
  'America/Denver': {
    key: 'America/Denver',
    display: 'Mountain (MST/MDT)',
  },
  'America/Chicago': {
    key: 'America/Chicago',
    display: 'Central (CST/CDT)',
  },
  'America/New_York': {
    key: 'America/New_York',
    display: 'Eastern (EST/EDT)',
  },
}

export const apparelSizes = {
  unisex: {
    xxs: false,
    xs: false,
    s: false,
    m: false,
    l: false,
    xl: false,
    xxl: false,
    xxxl: false,
    xxxxl: false,
  },
  women: {
    xxs: false,
    xs: false,
    s: false,
    m: false,
    l: false,
    xl: false,
    xxl: false,
    xxxl: false,
    xxxxl: false,
  },
  men: {
    xxs: false,
    xs: false,
    s: false,
    m: false,
    l: false,
    xl: false,
    xxl: false,
    xxxl: false,
    xxxxl: false,
  },
  infant: {
    newborn: false,
    m6: false,
    m12: false,
    m18: false,
    m24: false,
  },
};

export const apparelSizeMapping = {
  one_size_fits_all: 'One size fits all',
  xxs: '2XS',
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
  xxl: '2XL',
  xxxl: '3XL',
  xxxxl: '4XL',
  unisex: 'Unisex',
  women: "Women's",
  men: "Men's",
  infant: "Infant",
  newborn: "Newborn",
  m6: '6 months',
  m12: '12 months',
  m18: '18 months',
  m24: '24 months',
};

///////////////////////////////////////////////////

export const apiHost = `${process.env.NEXT_PUBLIC_API_PROTOCOL}://${process.env.NEXT_PUBLIC_API_HOSTNAME}:${process.env.NEXT_PUBLIC_API_PORT}`;

export const fetchTournamentList = (onSuccess, onFailure) => {
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/tournaments`,
    headers: {
      'Accept': 'application/json',
    },
    validateStatus: (status) => {
      return status < 500
    },
  };
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      onFailure({error: error.message});
    });

}

export const fetchTournamentDetails = (identifier, onSuccess, onFailure) => {
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/tournaments/${identifier}`,
    headers: {
      'Accept': 'application/json',
    }
  }
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 400) {
        onSuccess(response.data);
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      onFailure({error: 'Tournament not found'});
    });
}

export const fetchTeamList = ({tournamentIdentifier, dispatch, onSuccess, onFailure, incomplete = false}) => {
  const queryParams = {};
  if (incomplete) {
    queryParams.incomplete = true;
  }
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/tournaments/${tournamentIdentifier}/teams`,
    headers: {
      'Accept': 'application/json',
    },
    params: queryParams,
    validateStatus: (status) => {
      return status < 500
    },
  }
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        dispatch(teamListRetrieved());
        onSuccess(response.data);
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      onFailure({error: `Unexpected error from the server: ${error}`});
    });
}

export const fetchBowlerList = ({tournamentIdentifier, onSuccess, onFailure, unpartneredOnly}) => {
  const queryString = unpartneredOnly ? '?unpartnered=true' : '';
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/tournaments/${tournamentIdentifier}/bowlers${queryString}`,
    headers: {
      'Accept': 'application/json',
    },
    validateStatus: status => {
      return status < 500
    },
  };
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 400) {
        onSuccess(response.data);
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      onFailure({error: `Unexpected error from the server: ${error}`});
    });
}

////////////////////////////////////////////////////

export const submitNewTeamRegistration = (tournament, team, onSuccess, onFailure) => {
  const postData = convertTeamDataForServer(tournament, team);

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

export const submitNewTeamWithPlaceholders = ({tournament, team, bowler, onSuccess, onFailure}) => {
  const postData = {
    team: {
      name: team.name,
      initial_size: team.bowlerCount,
      bowlers_attributes: [{
        ...convertBowlerDataForPost(tournament, bowler),
        position: bowler.position,
      }],
      shift_identifiers: [...team.shiftIdentifiers],
    },
  }
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

export const submitSoloRegistration = (tournament, bowler, onSuccess, onFailure) => {
  // make the post
  const bowlerData = {bowlers: [convertBowlerDataForPost(tournament, bowler)]};
  axios.post(`${apiHost}/tournaments/${tournament.identifier}/bowlers`, bowlerData)
    .then(response => {
      const newBowler = response.data[0];
      onSuccess(newBowler);
    })
    .catch(error => {
      console.log(error);
      console.log(error.response);
      onFailure(error.response.status);
    });
}

export const submitAddBowler = ({tournament, team, bowler, onSuccess, onFailure}) => {
  // make the post
  const bowlerData = convertBowlerDataForPost(tournament, bowler);
  bowlerData.position = bowler.position;
  const postData =
    {
      team_identifier: team.identifier,
      bowlers: [bowlerData],
    };
  axios.post(`${apiHost}/tournaments/${tournament.identifier}/bowlers`, postData)
    .then(response => {
      const newBowler = response.data[0];
      onSuccess(newBowler);
    })
    .catch(error => {
      console.log(error);
      console.log(error.response);
      onFailure(error.response.status);
    });
}

export const submitDoublesRegistration = (tournament, bowlers, onSuccess, onFailure) => {
  // make the post
  const bowlerData = {bowlers: bowlers.map(bowler => convertBowlerDataForPost(tournament, bowler))};
  axios.post(`${apiHost}/tournaments/${tournament.identifier}/bowlers`, bowlerData)
    .then(response => {
      const newBowlers = response.data;
      onSuccess(newBowlers);
    })
    .catch(error => {
      console.log(error);
      console.log(error.response);
      onFailure(error.response.status);
    });
}

export const submitPartnerRegistration = (tournament, bowler, partner, onSuccess, onFailure) => {
  // make the post
  const bowlerData = {bowlers: [convertBowlerDataForPost(tournament, bowler)]};
  bowlerData.bowlers[0].doubles_partner_identifier = partner.identifier;

  axios.post(`${apiHost}/tournaments/${tournament.identifier}/bowlers`, bowlerData)
    .then(response => {
      const newBowler = response.data[0];
      onSuccess(newBowler);
    })
    .catch(error => {
      console.log(error);
      console.log(error.response);
      onFailure(error.response.status);
    });
}

const convertTeamDataForServer = (tournament, team) => {
  let postData = {
    team: {
      name: team.name,
      initial_size: team.bowlerCount,
      bowlers_attributes: [],
      options: {
        place_with_others: !!team.placeWithOthers,
      }
    },
  };
  for (const bowler of team.bowlers) {
    postData.team.bowlers_attributes.push(
      {
        ...convertBowlerDataForPost(tournament, bowler),
        ...teamDataForBowler(bowler)
      }
    );
  }
  return postData;
}

const teamDataForBowler = (bowler) => {
  return {
    position: bowler.position,
    doubles_partner_index: bowler.doublesPartnerIndex,
  };
}

const convertBowlerDataForPost = (tournament, bowler) => {
  const additionalQuestionResponses = convertAdditionalQuestionResponsesForPost(tournament, bowler);

  const bowlerObj = {
    person_attributes: {
      first_name: bowler.first_name,
      last_name: bowler.last_name,
      usbc_id: bowler.usbc_id,
      birth_month: bowler.birth_month,
      birth_day: bowler.birth_day,
      birth_year: bowler.birth_year,
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
  if (bowler.doubles_partner) {
    bowlerObj.doubles_partner_identifier = bowler.doubles_partner;
  }
  return bowlerObj;
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

export const postFreeEntry = (tournamentIdentifier, postData, onSuccess, onFailure) => {
  const requestConfig = {
    method: 'post',
    url: `${apiHost}/tournaments/${tournamentIdentifier}/free_entries`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data: postData,
    validateStatus: (status) => {
      return status < 500
    },
  }
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      onFailure({error: error.message});
    });
}

export const purchaseDetailsPostData = (items) => {
  const purchasableItems = [];
  const automaticItemIdentifiers = [];

  const sum = (runningTotal, currentValue) => {
    if (currentValue.category === 'ledger' && (currentValue.determination === 'early_discount'
      || currentValue.determination === 'bundle_discount')) {
      return runningTotal - currentValue.value * (currentValue.quantity || 1);
    }
    return runningTotal + currentValue.value * (currentValue.quantity || 1);
  };

  const expectedTotal = items.reduce(sum, 0);

  for (let i of items) {
    if (i.category === 'ledger') {
      // mandatory things like entry & late fees, early discount

      // hold off on this for now
      // if (i.determination === 'bundle_discount' || i.refinement === 'event_linked') {
      //   devConsoleLog("Not adding to the checkout request:", i);
      //   continue;
      // }

      automaticItemIdentifiers.push(i.identifier);
    } else {
      purchasableItems.push({
        identifier: i.identifier,
        quantity: i.quantity,
      });
    }
  }
  return {
    automatic_items: automaticItemIdentifiers,
    purchasable_items: purchasableItems,
    expected_total: expectedTotal,
  };
}

export const postPurchaseDetails = (bowlerIdentifier, path, postData, onSuccess, onFailure) => {
  const requestConfig = {
    method: 'post',
    url: `${apiHost}/bowlers/${bowlerIdentifier}/${path}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: postData,
    validateStatus: (status) => {
      return status < 500
    },
  }
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      onFailure({error: error.message});
    });
}

export const getCheckoutSessionStatus = (identifier, onSuccess, onFailure) => {
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/checkout_sessions/${identifier}`,
    headers: {
      'Accept': 'application/json',
    },
    validateStatus: (status) => {
      return status < 500
    },
  }
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);
      } else {
        onFailure(response.data);
      }
    })
    .catch(error => {
      onFailure(error);
    });

}

////////////////////////////////////////////////

export const directorForgotPasswordRequest = (postData, onSuccess, onFailure) => {
  const url = `${apiHost}/password`;
  const requestConfig = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    url: url,
    validateStatus: (status) => {
      return status < 500
    },
    data: postData,
  }
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        onSuccess();
      } else if (response.status === 422) {
        onSuccess();
      } else {
        console.log(response.data);
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

export const directorResetPasswordRequest = (postData, onSuccess, onFailure) => {
  const url = `${apiHost}/password`;
  const requestConfig = {
    method: 'patch',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    url: url,
    validateStatus: (status) => {
      return status < 500
    },
    data: postData,
  }
  axios(requestConfig)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        onSuccess(response.data);
      } else if (response.status === 422) {
        onFailure(response.data.error);
      } else {
        console.log(response.data);
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

/////////////////////////////////////////////////////

export const validateEmail = async function(emailAddress) {
  const response = await fetch('/api/email_check', {
    method: 'POST',
    mode: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    body: JSON.stringify({email: emailAddress}),
  }).catch((error) => {
    return {error: error};
  });
  return await response.json();
}

/////////////////////////////////////////////////////

// We can use this for fetching data from the API required by a component, but that's it.
// It'll make the pages that need it smaller, since they won't have to worry about
// handing over the user auth token, among other things.
export const useApi = ({
                         uri,
                         onSuccess = () => {},
                         onFailure = () => {},
                         initialData = null,
                       }) => {
  const ready = useClientReady();

  const handleSuccess = (data, key, config) => {
    onSuccess(data);
  }

  const handleError = (error) => {
    devConsoleLog("Unusual Error: ", error.message);
    onFailure(error.message);
  }

  /////////////////
  // This prevents SWR from making the request if we don't have a URI yet (which may be
  // the case when pulling URI details from, say, one or more query parameters
  const swrKey = uri ? [`${apiHost}${uri}`, ready] : null;
  // devConsoleLog("SWR Key:", swrKey);
  const swrOptions = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    onSuccess: handleSuccess,
    onError: handleError,
    fallbackData: initialData,
  };
  const swrFetcher = async (url, clientReady) => {
    if (clientReady) {
      const headers = new Headers();
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
    }
  }
  /////////////////

  const {data, error, isLoading, mutate} = useSWR(
    swrKey,
    ([requestUrl, clientReady]) => swrFetcher(requestUrl, clientReady),
    swrOptions
  );

  return {
    loading: isLoading,
    data,
    error,
    onDataUpdate: (newData) => mutate(newData),
  }
}

export const useTournament = (identifier, onSuccess = () => {
}, onFailure = () => {}) => {
  const {loading, data: tournament, error, onDataUpdate} = useApi({
    uri: identifier ? `/tournaments/${identifier}` : null,
    onSuccess: onSuccess,
  });

  const tournamentHasChanged = (updatedTournament) => {
    const mutateOptions = {
      optimisticData: updatedTournament,
      rollbackOnError: true,
      populateCache: true,
    };
    onDataUpdate(updatedTournament, mutateOptions);
  }

  return {
    loading,
    error,
    tournament,
    tournamentHasChanged,
  }
}

export const useTeam = (teamIdentifier, onSuccess = () => {
}) => {
  const {loading, data: team, error, onDataUpdate} = useApi({
    uri: teamIdentifier ? `/teams/${teamIdentifier}` : null,
    onSuccess: onSuccess,
  });

  const teamHasChanged = (updatedTeam) => {
    const mutateOptions = {
      optimisticData: updatedTeam,
      rollbackOnError: true,
      populateCache: true,
    };
    onDataUpdate(updatedTeam, mutateOptions);
  }

  return {
    loading,
    team,
    error,
    teamHasChanged,
  }
}

export const useBowlerCommerce = (bowlerIdentifier, onSuccess = () => {}, onFailure = () => {}) => {
  const {loading, data, error} = useApi({
    uri: bowlerIdentifier ? `/bowlers/${bowlerIdentifier}/commerce` : null,
    onSuccess: onSuccess,
    onFailure: onFailure,
  });

  return {
    loading,
    data,
    error,
  }
}
