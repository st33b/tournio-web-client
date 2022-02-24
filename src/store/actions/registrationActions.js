import * as actionTypes from './actionTypes';
import axios from "axios";

import {apiHost} from "../../utils";

export const tournamentDetailsRetrieved = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
  }
}

export const newTeamRegistrationInitiated = () => {
  return {
    type: actionTypes.NEW_TEAM_REGISTRATION_INITIATED,
  };
};

export const teamInfoAdded = (teamName) => {
  return {
    type: actionTypes.TEAM_INFO_ADDED,
    teamName: teamName,
  }
};

export const newTeamBowlerInfoAdded = (bowlerInfo) => {
  return {
    type: actionTypes.NEW_TEAM_BOWLER_INFO_ADDED,
    bowler: bowlerInfo,
  }
}

export const newTeamPartnersChosen = (bowlers) => {
  return {
    type: actionTypes.NEW_TEAM_PARTNERS_SELECTED,
    bowlers: bowlers,
  }
}

export const newTeamBowlerEdited = (bowler) => {
  return {
    type: actionTypes.NEW_TEAM_BOWLER_UPDATED,
    bowler: bowler,
  }
}

export const newTeamEntryCompleted = (newTeamIdentifier) => {
  return {
    type: actionTypes.NEW_TEAM_ENTRY_COMPLETED,
    newTeamIdentifier: newTeamIdentifier,
  }
}

export const newTeamEntryFailed = () => {
  return {
    type: actionTypes.NEW_TEAM_ENTRY_FAILED,
  }
}

export const newTeamEntrySubmitted = (tournament, teamName, bowlers) => {
  return dispatch => {
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
        const newTeamIdentifier = response.data.identifier
        dispatch(newTeamEntryCompleted(newTeamIdentifier));
      })
      .catch(error => {
        console.log("Entry submission failed.");
        console.log(error);
        dispatch(newTeamEntryFailed());
      });
  }
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
