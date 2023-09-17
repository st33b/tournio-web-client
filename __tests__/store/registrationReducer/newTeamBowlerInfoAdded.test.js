import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new team bowler info added', () => {
  const previousState = {
    team: {
      name: 'Britney Spares',
      bowlers: [],
    },
  };
  const newBowler = {
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'Denver',
  }
  const action = {
    type: actionTypes.NEW_TEAM_BOWLER_INFO_ADDED,
    bowler: newBowler,
  }

  it ('does not add the bowler to the team roster', () => {
    const result = registrationReducer(previousState, action);
    const index = result.team.bowlers.findIndex(b => b.name === newBowler.name);
    expect(index).toBe(-1);
  });

  it ('puts the bowler in state', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler).toStrictEqual(newBowler);
  });
});
