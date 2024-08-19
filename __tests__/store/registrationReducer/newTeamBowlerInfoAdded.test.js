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

  it ('adds the bowler to the team roster', () => {
    const result = registrationReducer(previousState, action);
    const index = result.team.bowlers.findIndex(b => b.name === newBowler.name);
    expect(index).toBe(0);
  });

  describe ('adding a third bowler', () => {
    const previousState = {
      team: {
        name: 'Britney Spares',
        bowlers: [
          {
            position: 1,
            average: 212,
            name: 'Alvin',
          },
          {
            position: 3,
            average: 189,
            name: 'Theodore',
          },
        ],
      },
    };

    const newBowler = {
      name: 'Simon',
      average: 212,
      position: 2,
    }

    const action = {
      type: actionTypes.NEW_TEAM_BOWLER_INFO_ADDED,
      bowler: newBowler,
    }

    it ('adds the bowler to the team roster, ordered by position', () => {
      const result = registrationReducer(previousState, action);
      const index = result.team.bowlers.findIndex(b => b.name === newBowler.name);
      expect(index).toBe(1);
    });
  });
});
