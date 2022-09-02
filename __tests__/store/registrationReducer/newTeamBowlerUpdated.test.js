import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new team bowler updated', () => {
  const otherBowler = {
    position: 1,
    name: 'Oliver Oilmachine',
    average: 199,
    home_city: 'Boston',
  };
  const bowlerToUpdate = {
    position: 2,
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Denver',
  };
  const previousState = {
    team: {
      bowlers: [otherBowler, bowlerToUpdate],
    },
  };
  const updatedBowler = {
    ...bowlerToUpdate,
    home_city: 'Seattle',
  };
  const action = {
    type: actionTypes.NEW_TEAM_BOWLER_UPDATED,
    bowler: updatedBowler,
  };

  it ('includes the updated bowler in the returned list at the correct index', () => {
    const result = registrationReducer(previousState, action);
    const index = result.team.bowlers.findIndex(b => b.name === updatedBowler.name);
    expect(index).toBe(1);
  });

  it ('has the updated details', () => {
    const result = registrationReducer(previousState, action);
    const bowler = result.team.bowlers.find(b => b.name === updatedBowler.name);
    expect(bowler.home_city).toStrictEqual(updatedBowler.home_city);
  });
});