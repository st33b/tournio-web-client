import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: tournament config item changed', () => {
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      location: 'The soft, sandy beaches of Maui',
      time_zone: 'America/Chicago',
    },
  };

  const newStateProps = {
    identifier: '32452345',
    key: 'location',
    value: 'The tourist hell that is Honolulu',
    value_shortened: 'Honolulu',
  }

  const action = {
    type: actionTypes.TOURNAMENT_CONFIG_ITEM_UPDATED,
    configItem: newStateProps,
  }

  const expected = {
    tournament: {
      ...previousState.tournament,
      location: newStateProps.value,
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});