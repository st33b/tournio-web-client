import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe('action type: tournament test environment updated', () => {
  const previousState = {
    tournament: TournamentRecord({
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
    }),
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

  const expected = TournamentRecord({
    identifier: previousState.tournament.identifier,
    ...newStateProps,
  });

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected.toJS()).toEqual(result.tournament.toJS());
  });
});