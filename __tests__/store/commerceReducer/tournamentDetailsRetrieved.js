import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe ('action type: tournament details retrieved', () => {
  const actionTournament = {
    name: 'argle bargle',
    foo: 'a',
    gloo: 'b',
    collection: [
      {
        id: 4,
        meh: true,
      },
      {
        id: 5,
        meh: false,
      },
    ],
    another_collection: [2, 4, 6, 8],
  };
  const action = {
    type: actionTypes.TOURNAMENT_DETAILS_RETRIEVED,
    tournament: actionTournament,
  }

  it ('includes an error property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.error).toBeDefined();
  });
  it ('nulls the error property in the return', () => {
    const result = commerceReducer({}, action);
    expect(result.error).toBeNull();
  });
  it ('includes the retrieved tournament in the returned object', () => {
    const result = commerceReducer({}, action);
    expect(result.tournament).toStrictEqual(actionTournament);
  });
});