import {tournamentName} from "../../src/utils";

describe('tournamentName', () => {
  it('is defined', () => {
    expect(tournamentName).toBeDefined();
  });

  const rowData = [
    {
      values: {
        id: 'alpha',
        tournaments_they_can_access: [
          {
            name: 'TROT',
          }
        ],
      },
    },
    {
      values: {
        id: 'beta',
        tournaments_they_can_access: [
          {
            name: 'MAKIT',
          }
        ],
      },
    },
    {
      values: {
        id: 'gamma',
        tournaments_they_can_access: [],
      },
    },
    {
      values: {
        id: 'delta',
        tournaments_they_can_access: [
          {
            name: 'Big D',
          },
          {
            name: 'TROT',
          },
        ],
      },
    },
    {
      values: {
        id: 'epsilon',
        tournaments_they_can_access: [
          {
            name: 'Golden Gate',
          },
          {
            name: 'SVIT',
          },
        ],
      },
    },
  ];

  it('returns those tournaments include TROT', () => {
    const expected = [
      {
        values: {
          id: 'alpha',
          tournaments_they_can_access: [
            {
              name: 'TROT',
            }
          ],
        },
      },
      {
        values: {
          id: 'delta',
          tournaments_they_can_access: [
            {
              name: 'Big D',
            },
            {
              name: 'TROT',
            },
          ],
        },
      },
    ];
    const result = tournamentName(rowData, 'tournaments_they_can_access', 'TROT');
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });

  it('returns those whose tournaments include SVIT', () => {
    const expected = [
      {
        values: {
          id: 'epsilon',
          tournaments_they_can_access: [
            {
              name: 'Golden Gate',
            },
            {
              name: 'SVIT',
            },
          ],
        },
      },
    ];
    const result = tournamentName(rowData, 'tournaments_they_can_access', 'SVIT');
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });

  it('returns an empty array when no matches are found', () => {
    const expected = [];
    const result = tournamentName(rowData, 'tournaments_they_can_access', 'IGBO Annual');
    expect(result.length).toEqual(expected.length);
    expect(result).toStrictEqual(expected);
  });
});