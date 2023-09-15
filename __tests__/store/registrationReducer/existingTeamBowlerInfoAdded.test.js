import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: existing team bowler info added', () => {
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
    bowler: null,
    another: 'property',
  };
  const newBowler = {
    position: 3,
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Denver',
  };
  const action = {
    type: actionTypes.EXISTING_TEAM_BOWLER_INFO_ADDED,
    bowler: newBowler,
  };

  it ('writes the bowler information to state', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler).toStrictEqual(newBowler);
  });

  it ('does not affect other properties in previousState', () => {
    const result = registrationReducer(previousState, action);
    expect(result.another).toStrictEqual('property');
  });
});
