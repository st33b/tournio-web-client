import * as actionTypes from './actionTypes';

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