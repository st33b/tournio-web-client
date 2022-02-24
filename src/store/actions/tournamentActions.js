import * as actionTypes from './actionTypes';

export const tournamentDetailsRetrieved = (tournament) => {
  return {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: tournament,
  }
}

export const teamDetailsRetrieved = (team) => {
  return {
    type: actionTypes.TEAM_DETAILS_RETRIEVED,
    team: team,
  }
}
