import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: partner up bowler info added', () => {
  const previousState = {
    bowler: {
      existing: 'data',
      also: 'also',
    },
  };
  const newBowler = {
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Denver',
    also: 'as well',
  }
  const action = {
    type: actionTypes.PARTNER_UP_BOWLER_INFO_ADDED,
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
  });
});