import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new team entry completed', () => {
  const previousState = {
    team: {
      bowlers: [
        { one: 1 },
        { two: 2 },
      ],
    },
    otherProperty: 17,
  };
  const action = {
    type: actionTypes.NEW_TEAM_ENTRY_COMPLETED,
  };

  it ('nulls out the team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team).toBeNull();
  });

  it ('leaves other state properties intact', () => {
    const result = registrationReducer(previousState, action);
    expect(result.otherProperty).toBe(17);
  });
});