import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: logged in', () => {
  const previousState = {
    tournament: null,
    user: null,
  };

  const loggingInUser = {
    identifier: 'something-you-can-identify-me-with',
    email: 'electronic@letter.usps',
  };

  const token = 'something-we-pulled-out-of-the-authorization-header-of-the-login-response';

  const action = {
    type: actionTypes.LOGGED_IN,
    user: loggingInUser,
    authToken: token,
  }

  const expected = {
    ...previousState,
    user: {
      ...loggingInUser,
      authToken: token,
    }
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result).toStrictEqual(expected);
  });
});