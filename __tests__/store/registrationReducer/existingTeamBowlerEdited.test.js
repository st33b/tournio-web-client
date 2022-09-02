import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: existing team bowler edited', () => {
  const previousState = {
    team: {
      name: 'Vibe Raiders',
      bowlers: [
        {
          position: 1,
          one: 1,
          name: 'emma',
        },
        {
          position: 2,
          two: 2,
          name: 'daniel',
        },
        {
          position: 3,
          name: 'Polly Pinsetter',
          average: 212,
          home_city: 'Denver',
        }
      ],
    },
    something: 'blue',
  };
  const newBowler = {
    position: 3,
    name: 'Polly Pinsetter',
    average: 212,
    home_city: 'San Francisco',
  }
  const action = {
    type: actionTypes.EXISTING_TEAM_BOWLER_EDITED,
    bowler: newBowler,
  }

  // Reducer assumes that the bowler being edited is the last one.
  // That's a reasonable assumption, since bowlers who join an existing team
  // are placed at the end. But we may wish to consider re-thinking that
  // assumption (and implementation) down the road.

  it ('updates the bowler to the team roster', () => {
    const result = registrationReducer(previousState, action);
    const bowler = result.team.bowlers[2]
    expect(bowler.name).toStrictEqual('Polly Pinsetter');
    expect(bowler.home_city).toStrictEqual('San Francisco');
  });

  it ('does not affect other properties in previousState', () => {
    const result = registrationReducer(previousState, action);
    expect(result.something).toStrictEqual('blue');
  });
});