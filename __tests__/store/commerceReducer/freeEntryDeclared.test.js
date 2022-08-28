import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";

describe ('action type: free entry declared', () => {
  const expected = {
    code: '',
    message: '',
    error: '',
  };

  const previousState = {};

  const action = {
    type: actionTypes.FREE_ENTRY_DECLARED,
  };

  it ('returns an initialized free entry', () => {
    const result = commerceReducer(previousState, action);
    expect(result.freeEntry).toStrictEqual(expected);
  });
});