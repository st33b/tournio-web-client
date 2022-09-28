import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: partner up bowler updated', () => {
  const previousState = {
    bowler: {
      name: 'Polly Pinsetter',
      average: 212,
      home_city: 'Denver',
      existing: 'data',
      also: 'also',
    },
  };
  const newBowler = {
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Austin',
    also: 'as well',
  }
  const action = {
    type: actionTypes.PARTNER_UP_BOWLER_UPDATED,
    bowler: newBowler,
  }

  it ('sets the bowler details', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler.name).toStrictEqual(newBowler.name);
  });

  it ('merges the new properties with existing ones', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler.existing).toStrictEqual('data');
  });

  it ('properties in the new bowler take precedence', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler.also).toStrictEqual('as well');
    expect(result.bowler.home_city).toStrictEqual(newBowler.home_city)
  });
});