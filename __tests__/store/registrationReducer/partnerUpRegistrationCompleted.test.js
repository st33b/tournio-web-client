import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: partner up registration completed', () => {
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
    partner: {
      name: 'Fuzzy McFuzzball',
      average: 190,
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
    type: actionTypes.PARTNER_UP_REGISTRATION_COMPLETED,
  };

  it ('nulls out the bowler', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler).toBeNull();
  });

  it ('nulls out the partner', () => {
    const result = registrationReducer(previousState, action);
    expect(result.partner).toBeNull();
  });

  it ('leaves other state properties intact', () => {
    const result = registrationReducer(previousState, action);
    expect(result.tournament).toStrictEqual(previousState.tournament);
  });
});