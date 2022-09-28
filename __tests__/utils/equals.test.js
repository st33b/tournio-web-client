import {equals} from "../../src/utils";

describe('equals', () => {
  it ('is defined', () => {
    expect(equals).toBeDefined();
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

  it ('returns those whose price is 100', () => {
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
          foo: 'a',
          bar: 'b',
          price: 100,
        },
      },
    ];
    const result = equals(rowData, 'price', 100);
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });

  it ('returns those whose bar is g', () => {
    const expected = [
      {
        values: {
          foo: 'e',
          bar: 'g',
          price: 200,
        },
      },
    ];
    const result = equals(rowData, 'bar', 'g');
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });
});