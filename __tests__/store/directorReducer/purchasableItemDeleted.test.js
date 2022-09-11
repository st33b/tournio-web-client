import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe('action type: purchasable item deleted', () => {
  const item1 = {
    identifier: '123',
    property: 'old value',
  }
  const item2 = {
    identifier: '345345',
    property: 'something old',
  }
  const item3 = {
    identifier: 'yahoo',
    property: 'Serious',
  }
  const item4 = {
    identifier: 'bacon',
    property: 'salty and fatty',
  }
  const item5 = {
    identifier: 'tofu',
    property: 'vegan',
  }
  const item6 = {
    identifier: 'eggs',
    property: 'yolky',
  }
  const item7 = {
    identifier: 'pancakes',
    property: 'delicious',
  }

  const previousState = {
    tournament: TournamentRecord({
      identifier: 'abcdefg',
      purchasable_items: [
        item1,
        item2,
        item3,
        item4,
        item5,
        item6,
        item7,
      ],
    }),
  };

  it('returns the expected object', () => {
    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: item2,
    }

    const expected = TournamentRecord({
      identifier: previousState.tournament.identifier,
      purchasable_items: [
        item1,
        item3,
        item4,
        item5,
        item6,
        item7,
      ],
    });

    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected.toJS()).toEqual(result.tournament.toJS());
  });

  it('correctly deletes the first item', () => {
    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: item1,
    }

    const expected = TournamentRecord({
      identifier: previousState.tournament.identifier,
      purchasable_items: [
        item2,
        item3,
        item4,
        item5,
        item6,
        item7,
      ],
    });

    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected.toJS()).toEqual(result.tournament.toJS());
  });

  it('correctly deletes the last item', () => {
    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: item7,
    }

    const expected = TournamentRecord({
      identifier: previousState.tournament.identifier,
      purchasable_items: [
        item1,
        item2,
        item3,
        item4,
        item5,
        item6,
      ],
    });

    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected.toJS()).toEqual(result.tournament.toJS());
  });

  it('ignores an unrecognized item', () => {
    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: {
        identifier: 'unfamiliar',
        property: 'strange',
      },
    }

    const expected = TournamentRecord({
      identifier: previousState.tournament.identifier,
      purchasable_items: [
        item1,
        item2,
        item3,
        item4,
        item5,
        item6,
        item7,
      ],
    });

    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected.toJS()).toEqual(result.tournament.toJS());
  });
});