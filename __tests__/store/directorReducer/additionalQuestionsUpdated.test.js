import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";

describe('action type: additional questions updated', () => {
  const average = {
    id: 14,
    label: 'Average',
    order: 1,
    name: 'average',
    html_element_type: 'input',
    html_element_config: {},
    validation: '',
    helper: {
      url: '',
      text: '',
    }
  }
  const availableQuestions = [
    {
      id: 100,
      label: 'Le Foo!',
      name: 'le_foo',
      validation_rules: {},
    },
    {
      id: 1000,
      label: 'No soup for you',
      name: 'no-soup',
      validation_rules: {},
    },
  ]
  const previousState = {
    tournament: {
      identifier: 'abcdefg',
    },
  };

  const questions = [
    average,
  ];

  const action = {
    type: actionTypes.ADDITIONAL_QUESTIONS_UPDATED,
    questions: questions,
    availableQuestions: availableQuestions,
  }

  const expected = {
    tournament: {
      identifier: previousState.tournament.identifier,
      additional_questions: questions,
      available_questions: availableQuestions,
    },
  };

  it('returns the expected object', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(expected).toStrictEqual(result);
  });
});