import axios from "axios";
import {
  bowlerCommerceDetailsRetrieved,
  teamListRetrieved,
  tournamentDetailsRetrieved,
} from "./store/actions/registrationActions";
import {useEffect, useState} from "react";
import {useDirectorContext} from "./store/DirectorContext";

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

export const devConsoleLog = (message, object=null) => {
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
    validateStatus: (status) => { return status < 500 },
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

export const fetchTeamDetails = ({teamIdentifier, onSuccess, onFailure}) => {
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/teams/${teamIdentifier}`,
    headers: {
      'Accept': 'application/json',
    },
    validateStatus: (status) => { return status < 500 },
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
      onFailure({error: 'Unexpected error from the server'});
    });
}

export const fetchBowlerDetails = (bowlerIdentifier, dispatch, onFailure) => {
  const requestConfig = {
    method: 'get',
    url: `${apiHost}/bowlers/${bowlerIdentifier}`,
    headers: {
      'Accept': 'application/json',
    },
    validateStatus: (status) => { return status < 500 },
  }
  axios(requestConfig)
    .then(response => {
      if (response.status === 404) {
        onFailure(response);
      } else if (response.data) {
        const bowlerData = response.data.bowler;
        const availableItems = response.data.available_items;
        dispatch(bowlerCommerceDetailsRetrieved(bowlerData, availableItems));
      }
    })
    .catch(error => {
      // Display some kind of error message
      console.log('Whoops!', error);
      onFailure(error);
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
    validateStatus: (status) => { return status < 500 },
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
      onFailure({error: 'Unexpected error from the server'});
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
    validateStatus: status => { return status < 500 },
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
      onFailure({error: 'Unexpected error from the server'});
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

export const submitSoloRegistration = (tournament, bowler, onSuccess, onFailure) => {
  // make the post
  const bowlerData = { bowlers: [convertBowlerDataForPost(tournament, bowler)] };
  axios.post(`${apiHost}/tournaments/${tournament.identifier}/bowlers`, bowlerData)
    .then(response => {
      const newBowler = response.data[0];
      onSuccess(newBowler);
    })
    .catch(error => {
      console.log('womp womp');
      console.log(error);
      console.log(error.response);
      onFailure(error.response.status);
    });
}

export const submitDoublesRegistration = (tournament, bowlers, onSuccess, onFailure) => {
  // make the post
  const bowlerData = { bowlers: bowlers.map(bowler => convertBowlerDataForPost(tournament, bowler)) };
  axios.post(`${apiHost}/tournaments/${tournament.identifier}/bowlers`, bowlerData)
    .then(response => {
      const newBowlers = response.data;
      onSuccess(newBowlers);
    })
    .catch(error => {
      console.log('womp womp');
      console.log(error);
      console.log(error.response);
      onFailure(error.response.status);
    });
}

export const submitPartnerRegistration = (tournament, bowler, partner, onSuccess, onFailure) => {
  // make the post
  const bowlerData = { bowlers: [convertBowlerDataForPost(tournament, bowler)] };
  bowlerData.bowlers[0].doubles_partner_identifier = partner.identifier;

  axios.post(`${apiHost}/tournaments/${tournament.identifier}/bowlers`, bowlerData)
    .then(response => {
      const newBowler = response.data[0];
      onSuccess(newBowler);
    })
    .catch(error => {
      console.log('womp womp');
      console.log(error);
      console.log(error.response);
      onFailure(error.response.status);
    });
}

export const submitJoinTeamRegistration = (tournament, team, bowler, onSuccess, onFailure) => {
  // make the post
  if (team.shift) {
    bowler.shift = team.shift;
  }
  const teamId = team.identifier;
  const bowlerData = {
    team_identifier: teamId,
    bowlers: [{...convertBowlerDataForPost(tournament, bowler), ...teamDataForBowler(bowler) }],
  };
  axios.post(`${apiHost}/tournaments/${tournament.identifier}/bowlers`, bowlerData)
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

const convertTeamDataForServer = (tournament, team) => {
  let postData = {
    team: {
      name: team.name,
      bowlers_attributes: [],
      options: {
        place_with_others: !!team.placeWithOthers,
      }
    },
  };
  if (team.shift) {
    team.bowlers.forEach(bowler => bowler.shift = team.shift);
  }
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
    doubles_partner_num: bowler.doubles_partner_num,
  };
}

const convertBowlerDataForPost = (tournament, bowler) => {
  const additionalQuestionResponses = convertAdditionalQuestionResponsesForPost(tournament, bowler);
  const shiftObj = {};
  if (bowler.shift) {
    shiftObj.shift_identifier = bowler.shift.identifier;
  }

  const bowlerObj = {
    person_attributes: {
      first_name: bowler.first_name,
      last_name: bowler.last_name,
      usbc_id: bowler.usbc_id,
      // igbo_id: bowler.igbo_id,
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
  return {...bowlerObj, ...shiftObj};
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
    validateStatus: (status) => { return status < 500 },
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
  const purchaseIdentifiers = [];
  const purchasableItems = [];

  const sum = (runningTotal, currentValue) => runningTotal + currentValue.value * (currentValue.quantity || 1);
  const expectedTotal = items.reduce(sum, 0);

  for (let i of items) {
    if (i.category === 'ledger') {
      // mandatory things like entry & late fees, early discount

      // some things we want the server to add: bundle discount, event-linked late fees
      if (i.determination === 'bundle_discount' || i.determination === 'late_fee' && i.refinement === 'event_linked') {
        continue;
      }
      purchaseIdentifiers.push(i.identifier);
    } else {
      purchasableItems.push({
        identifier: i.identifier,
        quantity: i.quantity,
      });
    }
  }
  return {
    purchase_identifiers: purchaseIdentifiers,
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
    validateStatus: (status) => { return status < 500 },
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
    validateStatus: (status) => { return status < 500 },
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
    validateStatus: (status) => { return status < 500 },
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
    validateStatus: (status) => { return status < 500 },
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
