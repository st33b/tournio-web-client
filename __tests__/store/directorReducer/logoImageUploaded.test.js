import * as actionTypes from '../../../src/store/actions/directorActionTypes';
import {directorReducer} from "../../../src/store/directorReducer";
import {TournamentRecord} from "../../../src/store/records/tournament";

describe ('action type: logo image uploaded', () => {
  const tournament = {
    id: 14,
    identifier: 'a-tournament',
    name: 'A Tournament',
    property: 'some_value',
  }
  const previousState = {
    tournament: TournamentRecord(tournament),
  };
  const imageUrl = 'some-random-url-string';
  const action = {
    type: actionTypes.LOGO_IMAGE_UPLOADED,
    imageUrl: imageUrl,
  }
  const expected = TournamentRecord({
    ...tournament,
    image_url: imageUrl,
  });

  it ('includes the tournament in the response', () => {
    const result = directorReducer(previousState, action);
    expect(result.tournament).toBeDefined();
    expect(result.tournament.toJS()).toStrictEqual(expected.toJS());
  });
});