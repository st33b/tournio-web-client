import * as actionTypes from './actionTypes';

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

export const newTeamEntryCompleted = () => {
  return {
    type: actionTypes.NEW_TEAM_ENTRY_COMPLETED,
  }
}

export const teamDetailsRetrieved = (team) => {
  return {
    type: actionTypes.TEAM_DETAILS_RETRIEVED,
    team: team,
  }
}
