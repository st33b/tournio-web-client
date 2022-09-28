import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: solo bowler registration completed', () => {
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
      stuff: 'fun',
    },
  };
  const action = {
    type: actionTypes.SOLO_BOWLER_REGISTRATION_COMPLETED,
  };

  it ('nulls out the bowler', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler).toBeNull();
  });

  it ('leaves other state properties intact', () => {
    const result = registrationReducer(previousState, action);
    expect(result.tournament).toStrictEqual(previousState.tournament);
  });
});