import axios from "axios";

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
  const teamId = team.identifier;
  axios.post('/teams/' + teamId + '/bowlers', bowlerData)
    .then(response => {
      const newBowlerIdentifier = response.data.identifier;
      dispatch(submitAddBowlerSuccess(teamId, newBowlerIdentifier));
    })
    .catch(error => {
      console.log('womp womp');
      console.log(error);
      dispatch(submitAddBowlerFail());
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
