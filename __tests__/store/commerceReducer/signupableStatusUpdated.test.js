import * as actionTypes from '../../../src/store/actions/actionTypes';
import {commerceReducer} from "../../../src/store/commerceReducer";
import {sign} from "chart.js/helpers";

describe ('action type: signupable status updated', () => {
  const signupables = [
    {
      identifier: 'one',
      status: 'initial',
    },
    {
      identifier: 'two',
      status: 'initial',
    },
    {
      identifier: 'three',
      status: 'requested',
    },
    {
      identifier: 'four',
      status: 'paid',
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

  const modifiedObject = {
    identifier: 'two',
    status: 'requested',
  }
  const action = {
    type: actionTypes.SIGNUPABLE_STATUS_UPDATED,
    ...modifiedObject,
  }

  //
  // Update of property value
  //
  it ('includes a signupables property in the return', () => {
    const result = commerceReducer(previousState, action);
    const changedOne = result.signupables.find(s => s.identifier === 'two')
    expect(changedOne.status).toStrictEqual('requested');
  });

  // Non-update of the rest
  it ('includes a signupables property in the return', () => {
    const result = commerceReducer(previousState, action);
    const theRestOriginal = signupables.filter(s => s.identifier !== 'two');
    const theRestResult = result.signupables.filter(s => s.identifier !== 'two');
    expect(theRestResult).toStrictEqual(theRestOriginal);
  });

});
