import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";
import {sign} from "chart.js/helpers";

describe ('action type: signupable status updated', () => {
  const signupables = [
    {
      identifier: 'uno',
      signupStatus: 'initial',
      signupIdentifier: 'one',
    },
    {
      identifier: 'dos',
      signupStatus: 'initial',
      signupIdentifier: 'two',
    },
    {
      identifier: 'tres',
      signupStatus: 'requested',
      signupIdentifier: 'three',
    },
    {
      identifier: 'cuatro',
      signupStatus: 'paid',
      signupIdentifier: 'four',
    },
  ];
  const previousState = {
    bowler: {
      identifier: 'some bowler',
    },
    tournament: {
      identifier: 'a tournament',
      name: 'A Tournament',
    },
    signupables: signupables,
  }

  const action = {
    type: actionTypes.SIGNUPABLE_STATUS_UPDATED,
    identifier: 'two',
    status: 'requested',
  }

  //
  // Update of property value
  //
  it ('includes a signupables property in the return', () => {
    const result = commerceReducer(previousState, action);
    const changedOne = result.signupables.find(s => s.identifier === 'dos')
    expect(changedOne.signupStatus).toStrictEqual('requested');
  });

  // Non-update of the rest
  it ('includes a signupables property in the return', () => {
    const result = commerceReducer(previousState, action);
    const theRestOriginal = signupables.filter(s => s.identifier !== 'dos');
    const theRestResult = result.signupables.filter(s => s.identifier !== 'dos');
    expect(theRestResult).toStrictEqual(theRestOriginal);
  });

});
