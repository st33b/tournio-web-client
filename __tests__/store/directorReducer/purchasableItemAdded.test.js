import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";


describe('action type: purchasable item added', () => {
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
      purchasable_items: [],
    },
  };

  const newItem = {
    identifier: 'something-you-can-buy',
    name: 'Shiny New Toy',
    description: "It's so shiny!",
    some_other_property: "Because the structure of the item doesn't matter",
  }

  const action = {
    type: actionTypes.PURCHASABLE_ITEMS_ADDED,
    items: [newItem],
  }

  const expected = {
    tournament: {
      identifier: previousState.tournament.identifier,
      purchasable_items: [newItem],
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});
