import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: tournament config item changed', () => {
  const quality = {
    id: 7,
    key: 'quality',
    label: 'Quality',
    value: 'Ultra-high resolution (4K)',
    value_shortened: 'UHD',
  }
  const mealtime = {
    id: 17,
    key: 'mealtime',
    label: 'Meal time',
    value: 'Whenever I feel hungry',
    value_shortened: 'Whenever',
  }
  const location = {
    id: 27,
    key: 'location',
    label: 'Location',
    value: 'The soft, sandy beaches of Maui',
    value_shortened: 'Maui',
  }
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      config_items: [
        quality,
        mealtime,
        location,
      ]
    },
  };

  const newStateProps = {
    ...mealtime,
    value: '1:00 in the afternoon',
    value_shortened: '1pm',
  }

  const action = {
    type: actionTypes.TOURNAMENT_CONFIG_ITEM_UPDATED,
    configItem: newStateProps,
  }

  const expected = {
    tournament: {
      identifier: previousState.tournament.identifier,
      config_items: [
        quality,
        newStateProps, // Does the position in the array matter?
        location,
      ],
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});