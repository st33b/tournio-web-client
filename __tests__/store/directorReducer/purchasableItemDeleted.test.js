import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: purchasable item deleted', () => {
  const item1 = {
    identifier: '123',
    property: 'old value',
    configuration: {},
  }
  const item2 = {
    identifier: '345345',
    property: 'something old',
    configuration: {},
  }
  const item3 = {
    identifier: 'yahoo',
    property: 'Serious',
    configuration: {},
  }
  const item4 = {
    identifier: 'bacon',
    property: 'salty and fatty',
    configuration: {},
  }
  const item5 = {
    identifier: 'tofu',
    property: 'vegan',
    configuration: {},
  }
  const item6 = {
    identifier: 'eggs',
    property: 'yolky',
    configuration: {},
  }
  const item7 = {
    identifier: 'pancakes',
    property: 'delicious',
    configuration: {},
  }

  const previousState = {
    tournament: {
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
    },
  };

  it('returns the expected object', () => {
    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: item2,
    }

    const expected = {
      tournament: {
        identifier: previousState.tournament.identifier,
        purchasable_items: [
          item1,
          item3,
          item4,
          item5,
          item6,
          item7,
        ],
      },
    };

    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });

  it('correctly deletes the first item', () => {
    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: item1,
    }

    const expected = {
      tournament: {
        identifier: previousState.tournament.identifier,
        purchasable_items: [
          item2,
          item3,
          item4,
          item5,
          item6,
          item7,
        ],
      },
    };

    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });

  it('correctly deletes the last item', () => {
    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: item7,
    }

    const expected = {
      tournament: {
        identifier: previousState.tournament.identifier,
        purchasable_items: [
          item1,
          item2,
          item3,
          item4,
          item5,
          item6,
        ],
      },
    };

    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });

  it('ignores an unrecognized item', () => {
    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: {
        identifier: 'unfamiliar',
        property: 'strange',
      },
    }

    const expected = {
      tournament: {
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
      },
    };

    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });

  it ('deletes the children when deleting a parent', () => {
    const parentItem = {
      "identifier": "51211577-b45d-4798-8512-59f422e9c299",
      "category": "product",
      "configuration": {
        "order": 3
      },
      "determination": "apparel",
      "name": "Pants",
      "refinement": "sized",
      "value": 30
    };
    const childItems = [
      {
        "identifier": "9691882e-d83f-40d6-977d-9312dee66008",
        "category": "product",
        "configuration": {
          "size": "men.xl",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 30
      },
      {
        "identifier": "47f29f0e-6cd3-4f23-bf48-5a1e97df9c49",
        "category": "product",
        "configuration": {
          "size": "men.xs",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 30
      },
      {
        "identifier": "e947d348-a2c3-40e7-acf1-052e4db0488b",
        "category": "product",
        "configuration": {
          "size": "women.l",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 30
      },
      {
        "identifier": "f978e85a-5829-4db3-ac9f-bd3fcb01f12f",
        "category": "product",
        "configuration": {
          "size": "women.m",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 30
      },
      {
        "identifier": "d2b9ebc8-b669-4a0d-a1eb-0db014c4ffe7",
        "category": "product",
        "configuration": {
          "size": "women.s",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 30
      }
    ];

    const purchasableItems = [
      item1,
      item2,
      item3,
      item4,
      parentItem,
      item5,
      item6,
      ...childItems,
      item7,
    ];

    const myPreviousState = {
      tournament: {
        identifier: 'abcdefg',
        purchasable_items: purchasableItems,
      },
    };

    const action = {
      type: actionTypes.PURCHASABLE_ITEM_DELETED,
      item: parentItem,
    }

    const expected = {
      tournament: {
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
      },
    };

    const result = directorReducer(myPreviousState, action);
    expect(result.tournament).toBeDefined();
    expect(result).toStrictEqual(expected);
  });
});
