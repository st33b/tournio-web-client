import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new team registration initiated', () => {
  const previousState = {};
  const newTeam = {
    name: 'A big-time team',
    bowlerCount: 3,
    preferredShift: 'a-shift-identifier',
  }
  const action = {
    type: actionTypes.NEW_TEAM_REGISTRATION_INITIATED,
    team: newTeam,
  }
  const expectedTeam = {
    ...newTeam,
    bowler: {},
  };

  it ('returns an initialized team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team).toBeDefined();
    expect(result.team).toStrictEqual(expectedTeam);
  });
});
