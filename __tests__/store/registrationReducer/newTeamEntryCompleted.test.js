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
    bowler: {
      identifier: 'yeah ok',
    },
    otherProperty: 17,
  };
  const updatedTeam = {
    ...previousState.team,
    bowlers: previousState.team.bowlers.concat(previousState.bowler),
  }
  const action = {
    type: actionTypes.NEW_TEAM_ENTRY_COMPLETED,
    team: updatedTeam,
  };

  it ('nulls out the bowler', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler).toBeNull();
  });

  it ('puts the bowler into the team list of bowlers', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team.bowlers[2]).toStrictEqual(previousState.bowler);
  });

  it ('leaves other state properties intact', () => {
    const result = registrationReducer(previousState, action);
    expect(result.otherProperty).toBe(17);
  });
});
