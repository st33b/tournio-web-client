import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: existing team bowler saved', () => {
  const bowler = {
    position: 3,
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Denver',
  };
  const previousState = {
    team: {
      name: 'Vibe Raiders',
      bowlers: [
        {
          position: 1,
          one: 1,
          name: 'emma',
        },
        {
          position: 2,
          two: 2,
          name: 'daniel',
        },
      ],
    },
    bowler: {...bowler},
    another: 'property',
  };
  const action = {
    type: actionTypes.EXISTING_TEAM_BOWLER_SAVED,
    team: {
      ...previousState.team,
      bowlers: previousState.team.bowlers.concat(bowler),
    },
  };

  const expectedState = {
    ...previousState,
    team: {
      ...previousState.team,
      bowlers: previousState.team.bowlers.concat(bowler),
    },
    bowler: null,
  }

  it ('has the right number of bowlers', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team.bowlers.length).toStrictEqual(expectedState.team.bowlers.length);
  });

  it ('has the expected bowler', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team.bowlers[expectedState.team.bowlers.length - 1]).toStrictEqual(bowler);
  });

  it ('resets the bowler property in state', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler).toBeNull();
  });
});
