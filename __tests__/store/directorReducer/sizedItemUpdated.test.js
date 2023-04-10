import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: sized item updated', () => {
  describe('when the sizes change', () => {
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
    const otherPurchasableItems = [
      {
        "identifier": "54a670eb-b129-4dab-a201-ff3c265095e5",
        "category": "ledger",
        "configuration": {},
        "determination": "entry_fee",
        "name": "Entry Fee",
        "refinement": null,
        "value": 120
      },
      {
        "identifier": "0550f837-a192-4582-9037-3ac0b935603c",
        "category": "ledger",
        "configuration": {
          "applies_at": "2023-07-17T00:00:00-04:00"
        },
        "determination": "late_fee",
        "name": "Late Registration Fee",
        "refinement": null,
        "value": 15
      },
      {
        "identifier": "3f00be83-bd40-466e-b09d-21bbe8ccf4e6",
        "category": "ledger",
        "configuration": {
          "valid_until": "2023-06-12T00:00:00-04:00"
        },
        "determination": "early_discount",
        "name": "Early Registration Discount",
        "refinement": null,
        "value": 10
      }
    ];
    const tournament = {
      identifier: 'this-is-a-tournament',
      name: 'This Is A Tournamenrt',
      purchasable_items: [
        ...otherPurchasableItems,
        parentItem,
        ...childItems,
      ],
    }

    const previousState = {
      tournament: tournament,
      user: 'some-user-object',
    };

    const updatedParentItem = {
      "identifier": "51211577-b45d-4798-8512-59f422e9c299",
      "category": "product",
      "configuration": {
        "order": 3
      },
      "determination": "apparel",
      "name": "Pants",
      "refinement": "sized",
      "value": 40
    };

    const updatedChildItems = [
      {
        "identifier": "7004ab58-9d3e-4f29-b29e-198bbefe726f",
        "category": "product",
        "configuration": {
          "size": "men.m",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 40
      },
      {
        "identifier": "28fdef99-909d-4f0e-838a-4984ee80b713",
        "category": "product",
        "configuration": {
          "size": "men.s",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 40
      },
      {
        "identifier": "fd905d7f-6e43-4467-8185-e70b2018d833",
        "category": "product",
        "configuration": {
          "size": "infant.m6",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 40
      }
    ];

    const action = {
      type: actionTypes.SIZED_ITEM_UPDATED,
      sizedItem: [
        updatedParentItem,
        ...updatedChildItems,
      ],
    }

    const expectedPurchasableItems = [
      ...otherPurchasableItems,
      updatedParentItem,
      ...updatedChildItems,
    ];

    const expected = {
      tournament: {
        ...tournament,
        purchasable_items: expectedPurchasableItems,
      },
      user: previousState.user,
    };

    it('returns the expected object', () => {
      const result = directorReducer(previousState, action);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('changing from one-size to sized', () => {
    const parentItem = {
      "identifier": "51211577-b45d-4798-8512-59f422e9c299",
      "category": "product",
      "configuration": {
        "order": 3,
        "size": "one_size_fits_all",
      },
      "determination": "apparel",
      "name": "Pants",
      "value": 30
    };
    const otherPurchasableItems = [
      {
        "identifier": "54a670eb-b129-4dab-a201-ff3c265095e5",
        "category": "ledger",
        "configuration": {},
        "determination": "entry_fee",
        "name": "Entry Fee",
        "refinement": null,
        "value": 120
      },
      {
        "identifier": "0550f837-a192-4582-9037-3ac0b935603c",
        "category": "ledger",
        "configuration": {
          "applies_at": "2023-07-17T00:00:00-04:00"
        },
        "determination": "late_fee",
        "name": "Late Registration Fee",
        "refinement": null,
        "value": 15
      },
      {
        "identifier": "3f00be83-bd40-466e-b09d-21bbe8ccf4e6",
        "category": "ledger",
        "configuration": {
          "valid_until": "2023-06-12T00:00:00-04:00"
        },
        "determination": "early_discount",
        "name": "Early Registration Discount",
        "refinement": null,
        "value": 10
      }
    ];
    const tournament = {
      identifier: 'this-is-a-tournament',
      name: 'A Grand Old Time',
      property: 'value',
      purchasable_items: [
        ...otherPurchasableItems,
        parentItem,
      ],
    }

    const previousState = {
      tournament: tournament,
      user: 'a logged-in user',
    };

    const updatedParentItem = {
      "identifier": "51211577-b45d-4798-8512-59f422e9c299",
      "category": "product",
      "configuration": {
        "order": 3
      },
      "determination": "apparel",
      "name": "Pants",
      "refinement": "sized",
      "value": 40
    };

    const updatedChildItems = [
      {
        "identifier": "7004ab58-9d3e-4f29-b29e-198bbefe726f",
        "category": "product",
        "configuration": {
          "size": "men.m",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 40
      },
      {
        "identifier": "28fdef99-909d-4f0e-838a-4984ee80b713",
        "category": "product",
        "configuration": {
          "size": "men.s",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 40
      },
      {
        "identifier": "fd905d7f-6e43-4467-8185-e70b2018d833",
        "category": "product",
        "configuration": {
          "size": "infant.m6",
          "order": 3,
          "parent_identifier": "51211577-b45d-4798-8512-59f422e9c299"
        },
        "determination": "apparel",
        "name": "Pants",
        "refinement": null,
        "value": 40
      }
    ];

    const action = {
      type: actionTypes.SIZED_ITEM_UPDATED,
      sizedItem: [
        updatedParentItem,
        ...updatedChildItems,
      ],
    }

    const expectedPurchasableItems = [
      ...otherPurchasableItems,
      updatedParentItem,
      ...updatedChildItems,
    ];

    const expected = {
      tournament: {
        ...tournament,
        purchasable_items: expectedPurchasableItems,
      },
      user: previousState.user,
    };

    it('returns the expected object', () => {
      const result = directorReducer(previousState, action);
      expect(result).toStrictEqual(expected);
    });
  })
});
