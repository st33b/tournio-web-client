import * as actionTypes from '../../../src/store/actions/actionTypes';
import {registrationReducer} from "../../../src/store/registrationReducer";

describe ('action type: partner up registration initiated', () => {
  const previousState = {
    team: { one: 1 },
    bowlers: [],
  };
  const existingBowler = {
    name: 'Joey',
  }
  const action = {
    type: actionTypes.PARTNER_UP_REGISTRATION_INITIATED,
    partner: existingBowler,
  }

  it ('puts the partner in the result', () => {
    const result = registrationReducer(previousState, action);
    expect(result.partner).toStrictEqual(existingBowler);
  });

  it ('nulls out the team', () => {
    const result = registrationReducer(previousState, action);
    expect(result.team).toBeNull();
  });

  it ('nulls out the bowlers array', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowlers).toBeNull();
  });

  it ('initializes a new bowler', () => {
    const result = registrationReducer(previousState, action);
    expect(result.bowler).not.toBeNull();
  });

  describe ('when the existing bowler has a shift', () => {
    const shiftyBowler = {
      ...existingBowler,
      shift: {
        identifier: 'gears',
        shiftiness: 'heavy',
      },
    };
    const shiftedAction = {
      ...action,
      partner: shiftyBowler,
    };

    it ('puts the same shift on the new bowler', () => {
      const result = registrationReducer(previousState, shiftedAction);
      expect(result.bowler.shift).toStrictEqual(shiftyBowler.shift);
    });
  })
});