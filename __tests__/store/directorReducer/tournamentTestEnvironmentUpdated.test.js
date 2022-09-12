import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: tournament test environment updated', () => {
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      testing_environment: {
        settings: {
          registration_period: {
            name: 'registration_period',
            display_name: 'Registration period',
            display_valye: 'Regular',
            value: 'regular',
          },
        },
      },
    },
  };

  const newStateProps = {
    testing_environment: {
      settings: {
        registration_period: {
          name: 'registration_period',
          display_name: 'Registration period',
          display_valye: 'Early',
          value: 'early',
        },
      },
    },
  }

  const action = {
    type: actionTypes.TOURNAMENT_TEST_ENVIRONMENT_UPDATED,
    newRegistrationPeriod: newStateProps.testing_environment.settings.registration_period,
  }

  const expected = {
    tournament: {
      identifier: previousState.tournament.identifier,
      ...newStateProps,
    }
  }

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});