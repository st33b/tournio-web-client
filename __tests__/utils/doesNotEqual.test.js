import {doesNotEqual} from "../../src/utils";

describe('doesNotEqual', () => {
  it ('is defined', () => {
    expect(doesNotEqual).toBeDefined();
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

  it ('returns those whose price is not 100', () => {
    const expected = [
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
          foo: 'e',
          bar: 'h',
          price: 200,
        },
      },
    ];
    const result = doesNotEqual(rowData, 'price', 100);
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });

  it ('returns those whose bar is not g', () => {
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
      {
        values: {
          foo: 'e',
          bar: 'h',
          price: 200,
        },
      },
    ];
    const result = doesNotEqual(rowData, 'bar', 'g');
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });
});