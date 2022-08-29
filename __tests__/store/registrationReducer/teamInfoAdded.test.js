import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: team info added', () => {
  const previousState = {
    tournament: {
      shifts: [
        {
          identifier: 'tools',
          shiftiness: 'moderate',
        },
        {
          identifier: 'gears',
          shiftiness: 'light',
        },
      ],
    },
    team: {
      name: '',
      bowlers: [],
      shift: null,
    }
  };
  const action = {
    type: actionTypes.TEAM_INFO_ADDED,
    name: 'Reyna Terror',
    shiftId: 'tools',
  };

  const expectedTeam = {
    name: 'Reyna Terror',
    shift: previousState.tournament.shifts[0],
    bowlers: [],
  };

  it ('includes the new team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team).toStrictEqual(expectedTeam);
  });

  it ("does not alter the previous state's other properties", () => {
    const result = registrationReducer(previousState, action);
    expect(result.tournament).toStrictEqual(previousState.tournament);
  });
});