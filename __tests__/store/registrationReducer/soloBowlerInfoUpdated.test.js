import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: solo bowler info updated', () => {
  const previousState = {
    bowler: {
      name: 'Polly Pinsetter',
      average: 212,
      home_city: 'Denver',
      shift: {
        identifier: 'gears',
        shiftiness: 'light',
      },
    },
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
    home_city: 'Minneapolis',
    shift: 'tools',
  }
  const action = {
    type: actionTypes.SOLO_BOWLER_INFO_UPDATED,
    bowler: newBowler,
  }

  it ('updates the bowler details', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler.home_city).toStrictEqual(newBowler.home_city);
  });

  it ('sets the correct shift object on the bowler', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler.shift.shiftiness).toStrictEqual('moderate');
  });
});