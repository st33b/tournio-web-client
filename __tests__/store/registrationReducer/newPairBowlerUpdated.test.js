import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new pair bowler updated', () => {
  const previousBowler = {
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Denver',
  };
  const otherBowler = {
    name: 'Oliver Oilmachine',
    average: 199,
    home_city: 'Boston',
  };
  const previousState = {
    bowlers: [otherBowler, previousBowler],
  };
  const updatedBowler = {
    ...previousBowler,
    home_city: 'San Diego',
  };
  const action = {
    type: actionTypes.NEW_PAIR_BOWLER_UPDATED,
    bowler: updatedBowler,
    index: 1,
  };

  it ('includes the updated bowler in the returned list at the correct index', () => {
    const result = registrationReducer(previousState, action);
    const index = result.bowlers.findIndex(b => b.name === previousBowler.name);
    expect(index).toBe(1);
  });

  it ('has the updated details', () => {
    const result = registrationReducer(previousState, action);
    const bowler = result.bowlers.find(b => b.name === updatedBowler.name);
    expect(bowler.home_city).toStrictEqual(updatedBowler.home_city);
  });
});