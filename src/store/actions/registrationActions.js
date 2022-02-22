import * as actionTypes from './actionTypes';

export const teamInfoAdded = (teamName) => {
  return {
    type: actionTypes.TEAM_INFO_ADDED,
    teamName: teamName,
  }
}