import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: team list retrieved', () => {
  const previousState = {};
  const action = {
    type: actionTypes.TEAM_LIST_RETRIEVED,
  }
  const expectedTeam = {
    name: '',
    bowlers: [],
    shift: null,
  };

  it ('returns an initialized team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team).toBeDefined();
    expect(result.team).toStrictEqual(expectedTeam);
  });
});