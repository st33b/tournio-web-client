import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: purchasable item updated', () => {
  const item1 = {
    identifier: '123',
    property: 'old value',
  }
  const item2 = {
    identifier: '345345',
    property: 'something old',
  }
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [
        item1,
        item2,
      ],
    },
  };

  const updatedItem = {
    ...item1,
    property: 'new value',
  }

  const action = {
    type: actionTypes.PURCHASABLE_ITEM_UPDATED,
    item: updatedItem,
  }

  const expected = {
    tournament: {
      identifier: previousState.tournament.identifier,
      purchasable_items: [
        updatedItem,
        item2,
      ],
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});