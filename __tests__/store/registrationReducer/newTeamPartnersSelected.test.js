import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: new team bowler info added', () => {
  const previousState = {
    somethingElse: 'hello',
    team: {
      name: 'Britney Spares',
      bowlers: [
        {
          name: 'Oops',
        },
        {
          name: 'Work',
        },
      ],
    },
  };
  const newBowlers = [...previousState.team.bowlers];
  newBowlers[0] = {
    ...previousState.team.bowlers[0],
    something: 'new',
  };
  newBowlers[1] = {
    ...previousState.team.bowlers[1],
    something: 'borrowed',
  };

  const action = {
    type: actionTypes.NEW_TEAM_PARTNERS_SELECTED,
    bowlers: newBowlers,
  }

  it ('replaces the bowlers in the team roster with the new bowlers', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team.bowlers).toStrictEqual(newBowlers);
  });

  it ('does not step on other properties of previousState', () => {
    const result = registrationReducer(previousState, action);
    expect(result.somethingElse).toStrictEqual('hello');
  })
});