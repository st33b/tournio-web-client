import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new pair bowler info added', () => {
  const previousState = {
    tournament: {
      shifts: [
        {
          identifier: 'tools',
          shiftiness: 'moderate',
        },
        {
          identifier: 'gears',
          shiftiness: 'light',
        },
      ],
    },
    bowlers: [],
  };
  const newBowler = {
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Denver',
  }
  const action = {
    type: actionTypes.NEW_PAIR_BOWLER_INFO_ADDED,
    bowler: newBowler,
  }

  it ('includes the new bowler in the returned list', () => {
    const result = registrationReducer(previousState, action);
    const index = result.bowlers.findIndex(b => b.name === newBowler.name);
    expect(index).toBeGreaterThanOrEqual(0);
  });

  it ('has added the correct shift to the returned bowler', () => {
    const result = registrationReducer(previousState, action);
    const bowler = result.bowlers.find(b => b.name === newBowler.name);
  });
});
