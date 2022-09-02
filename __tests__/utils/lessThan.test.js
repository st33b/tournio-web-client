import {lessThan} from "../../src/utils";

describe('lessThan', () => {
  it ('is defined', () => {
    expect(lessThan).toBeDefined();
  });

  const rowData = [
    {
      values: {
        foo: 'a',
        bar: 'c',
        price: 100,
      },
    },
    {
      values: {
        foo: 'b',
        bar: 'd',
        price: 300,
      },
    },
    {
      values: {
        foo: 'e',
        bar: 'g',
        price: 200,
      },
    },
    {
      values: {
        foo: 'a',
        bar: 'b',
        price: 100,
      },
    },
    {
      values: {
        foo: 'e',
        bar: 'h',
        price: 200,
      },
    },
  ];

  it ('returns those whose price is less than 250', () => {
    const expected = [
      {
        values: {
          foo: 'a',
          bar: 'c',
          price: 100,
        },
      },
      {
        values: {
          foo: 'e',
          bar: 'g',
          price: 200,
        },
      },
      {
        values: {
          foo: 'a',
          bar: 'b',
          price: 100,
        },
      },
      {
        values: {
          foo: 'e',
          bar: 'h',
          price: 200,
        },
      },
    ];
    const result = lessThan(rowData, 'price', 250);
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });

  it ('returns those whose foo is less than d', () => {
    const expected = [
      {
        values: {
          foo: 'a',
          bar: 'c',
          price: 100,
        },
      },
      {
        values: {
          foo: 'b',
          bar: 'd',
          price: 300,
        },
      },
      {
        values: {
          foo: 'a',
          bar: 'b',
          price: 100,
        },
      },
    ];
    const result = lessThan(rowData, 'foo', 'd');
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });
});