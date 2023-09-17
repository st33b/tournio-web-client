import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: solo bowler info added', () => {
  const previousState = {
    bowler: null,
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
  };
  const newBowler = {
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Denver',
    shift: 'gears',
  }
  const action = {
    type: actionTypes.SOLO_BOWLER_INFO_ADDED,
    bowler: newBowler,
  }

  it ('sets the bowler details', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler.name).toStrictEqual(newBowler.name);
  });
});
