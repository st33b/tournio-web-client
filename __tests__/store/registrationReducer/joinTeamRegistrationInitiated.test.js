import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: join team registration initiated', () => {
  const previousState = {};
  const action = {
    type: actionTypes.JOIN_TEAM_REGISTRATION_INITIATED,
    team: {
      name: 'a bowling team',
      property: 'value',
    }
  }

  it ('includes the specified team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team).toBeDefined();
    expect(result.team).toStrictEqual(action.team);
  });
});