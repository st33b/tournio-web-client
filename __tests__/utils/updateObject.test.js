import {updateObject} from "../../src/utils";

describe('updateObject', () => {
  it ('is defined', () => {
    expect(updateObject).toBeDefined();
  })

  it ('returns a semantically equal object when no changes are submitted', () => {
    const obj1 = {
      kylie: 'a',
      robyn: 'b',
    };
    const delta = {};

    const result = updateObject(obj1, delta);
    expect(result).toStrictEqual(obj1);
  });

  it ('returns a new object with the delta applied', () => {
    const obj1 = {
      kylie: 'a',
      robyn: 'b',
    };
    const delta = {
      robyn: 's',
      cher: 'c',
    }
    const result = updateObject(obj1, delta);
    const expected = {
      kylie: 'a',
      robyn: 's',
      cher: 'c',
    }
    expect(result).toStrictEqual(expected);
  });

  it ('returns a new object', () => {
    const obj1 = {
      kylie: 'a',
      robyn: 'b',
    };
    const delta = {};

    const result = updateObject(obj1, delta);
    expect(result).not.toBe(obj1); // toBe() checks referential integrity on objects
  });

  it ('does not deep-copy nested objects', () => {
    const obj1 = {
      kylie: 'a',
      robyn: [1, 2, 3, 4],
    };
    const delta = {};

    const result = updateObject(obj1, delta);
    expect(result.robyn).toBe(obj1.robyn); // The arrays are the same object
  });
});