import React, {useState, useEffect} from "react";
import Link from 'next/link';

import PartnerSelectionRow from "./PartnerSelectionRow";

import classes from './TeamDetails.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import {useRouter} from "next/router";
import TeamShiftForm from "./TeamShiftForm";
import MixAndMatchShiftForm from "./MixAndMatchShiftForm";

const TeamDetails = ({tournament, team, teamUpdated}) => {
  const router = useRouter();
  const {identifier: tournamentId} = router.query;

  let initialFormData = {
    fields: {
      name: '',
      bowlers_attributes: [],
      shift_identifiers: [],
    },
    valid: true,
    touched: false,
    errors: [],
  }

  const [teamForm, setTeamForm] = useState(initialFormData);

  useEffect(() => {
    if (!team) {
      return;
    }
    const newFormData = {...teamForm}
    newFormData.fields.name = team.name;
    newFormData.fields.bowlers_attributes = team.bowlers.map((b) => {
      return {
        id: b.id,
        position: b.position,
        doubles_partner_id: b.doublesPartner ? b.doublesPartner.id : null,
      }
    }, [team]);
    newFormData.fields.shift_identifiers = team.shifts.map(({identifier}) => identifier);
    setTeamForm(newFormData);
    teamUpdated(newFormData);
  }, [team]);

  const errorMessages = (fields) => {
    const messages = [];

    // an array of flags, where the 0th element is ignored
    const markedPositions = Array(tournament.config['team_size'] + 1).fill(false);
    // mark the chosen positions as true
    fields.bowlers_attributes.forEach(bowler => markedPositions[bowler.position] = true);
    // filtering by marked positions, does its size match the number of bowlers we have?
    const noDuplicates = markedPositions.filter(p => !!p).length === fields.bowlers_attributes.length;

    if (!noDuplicates) {
      messages.push('Bowler positions overlap');
    }
    if (fields.name.length === 0) {
      messages.push('Team needs a name');
    }

    return messages;
  }

  const inputChangedHandler = (event, inputName, index = -1) => {
    const updatedTeamForm = {
       ...teamForm,
      touched: true,
    };

    switch (inputName) {
      case 'name':
        updatedTeamForm.fields.name = event.target.value;
        break;
      case 'position':
        updatedTeamForm.fields.bowlers_attributes[index].position = parseInt(event.target.value);
        // TODO: do something with this?
        // const sortedByPosition = updatedTeamForm.fields.bowlers_attributes.map((attrs) => attrs.position).sort();
        break;
    }
    updatedTeamForm.errors = errorMessages(updatedTeamForm.fields);
    updatedTeamForm.valid = updatedTeamForm.errors.length === 0;

    setTeamForm(updatedTeamForm);
    teamUpdated(updatedTeamForm);
  }

  // When a doubles partner is clicked, what needs to happen:
  // - update the double partner assignments in state. (One click is enough to know everyone.)
  //  - Ex: Bowler A clicked on Bowler B
  //  - set A's partner to be B
  //  - set B's partner to be A (reciprocal)
  //  - set C and D to be partners (the remaining two)
  const gimmeNewDoublesPartners = (bowlerId, partnerId) => {
    // create a copy of the bowlers_attributes value array
    const newBowlers = teamForm.fields.bowlers_attributes.slice(0);

    let bowlersLeftToUpdate = [...newBowlers.keys()];
    const bowlerIndex = newBowlers.findIndex(b => b.id === bowlerId);
    const partnerIndex = newBowlers.findIndex(b => b.id === partnerId);

    newBowlers[bowlerIndex].doubles_partner_id = partnerId;
    newBowlers[partnerIndex].doubles_partner_id = bowlerId;

    // Remove those two from the list of bowlers who need to be updated
    bowlersLeftToUpdate = bowlersLeftToUpdate.filter((value) => {
      return newBowlers[value].id !== bowlerId && newBowlers[value].id !== partnerId;
    });

    // Update the other two (if there are two) to be partners with each other
    if (bowlersLeftToUpdate.length > 1) {
      const left = bowlersLeftToUpdate[0];
      const right = bowlersLeftToUpdate[1];
      newBowlers[left].doubles_partner_id = newBowlers[right].id;
      newBowlers[right].doubles_partner_id = newBowlers[left].id;
    } else if (bowlersLeftToUpdate.length === 1) {
      // If there's just one left, then nullify their doubles partner selection
      newBowlers[bowlersLeftToUpdate[0]].doubles_partner_id = null;
    }

    const updatedTeamForm = {
      ...teamForm,
      touched: true,
    }
    updatedTeamForm.fields.bowlers_attributes = newBowlers;
    setTeamForm(updatedTeamForm);

    // update the bowlers on the team, so that the partner selection rows get presented correctly
    updatedTeamForm.fields.bowlers_attributes.forEach((bowlerAttributeRow, index) => {
      team.bowlers[index].doublesPartnerId = bowlerAttributeRow.doubles_partner_id;
    });

    // Send update notification
    teamUpdated(updatedTeamForm);
  }

  const doublesPartnerSelection = (
    <div className={'table-responsive'}>
      <table className={'table table-hover caption-top align-middle'}>
        <caption className={classes.Caption}>
          Doubles Partner Assignment
        </caption>
        <thead>
        <tr>
          <th scope={'col'}>
            Bowler
          </th>
          <th colSpan={3} scope={'col'}>
            Partner options
          </th>
        </tr>
        </thead>
        <tbody>
        {team.bowlers.map(bowler => {
          const teammates = team.bowlers.filter(({id}) => id !== bowler.id);
          return <PartnerSelectionRow key={bowler.identifier}
                                      bowler={bowler}
                                      activeId={bowler.doublesPartnerId}
                                      teammates={teammates}
                                      onPartnerSelected={gimmeNewDoublesPartners}
          />
        })}
        </tbody>
      </table>
    </div>
  );

  const updateShiftIdentifiers = (newShiftIdentifiers) => {
    const updatedFields = {
      ...teamForm.fields,
      shift_identifiers: [...newShiftIdentifiers],
    }
    const updatedTeamForm = {
      fields: updatedFields,
      touched: true,
    };

    setTeamForm(updatedTeamForm);
    teamUpdated(updatedTeamForm);
  }

  const multiShiftChangeHandler = (newShiftIdentifier) => {
    updateShiftIdentifiers([newShiftIdentifier]);
  }

  //////////////////////////////////////////////////////////////////

  if (!tournament || !team) {
    return '';
  }

  const maxTeamSize = parseInt(tournament.config['team_size']);
  const tournamentType = tournament.config['tournament_type'] || 'igbo_standard';

  const showInclusiveShifts = tournamentType === 'igbo_multi_shift' || tournamentType === 'single_event' && tournament.shifts.length > 1;

  const bowlerRows = [];
  for (let i = 0; i < maxTeamSize; i++) {
    const position = i + 1;
    const index = team.bowlers.findIndex(b => b.position === position);
    const bowler = team.bowlers[index];
    let row = '';
    if (bowler) {
      const inputValue = !!teamForm.fields.bowlers_attributes[index] ? teamForm.fields.bowlers_attributes[index].position : position;
      row = (
        <div className={'d-flex align-items-center py-2 tournio-striped-list-item'}
             key={`bowler-at-position-${position}`}>
          <input type={'hidden'}
                 value={bowler.id}
                 name={`team[bowlers_attributes][${index}][id]`}
                 id={`team_bowlers_attributes_${index}_id`}
          />
          <div>
            <input type={'number'}
                   min={1}
                   max={maxTeamSize}
                   value={inputValue}
                   className={[classes.PositionInput, 'form-control', 'ms-2'].join(' ')}
                   name={`team[bowlers_attributes][${index}][position]`}
                   id={`team_bowlers_attributes_${index}_position`}
                   onChange={(event) => inputChangedHandler(event, 'position', index)}
            />
          </div>

          <div className={'ps-3'}>
            <Link href={{
              pathname: '/director/tournaments/[identifier]/bowlers/[bowlerId]',
              query: {
                identifier: tournamentId,
                bowlerId: bowler.identifier,
              }
            }}
            >
              {bowler.fullName}
            </Link>
          </div>
        </div>
      );
    } else {
      row = (
        <div className={'d-flex align-items-center py-2 tournio-striped-list-item'}
             key={`bowler-at-position-${position}`}>
          <div className={'ps-4'}>
            {position}
          </div>

          <div className={'ms-auto pe-2'}>
            <Link href={{
              pathname: '/director/tournaments/[identifier]/teams/[teamId]/add-bowler',
              query: {
                identifier: tournament.identifier,
                teamId: team.identifier,
                position: position,
              }
            }}
            >
              <span className={'bi bi-plus-lg pe-2'} aria-hidden={true}/>
              New Bowler
            </Link>
          </div>
        </div>
      );
    }
    bowlerRows.push(row);
  }

  return (
    <ErrorBoundary>
      <div className={classes.TeamDetails}>
        <div className={'row mb-3'}>
          <label htmlFor={'team_name'}
                 className={'col-form-label col-form-label-lg text-sm-end col-12 col-sm-4'}>
            Team Name
          </label>
          <div className={'col'}>
            <input type={'text'}
                   className={'form-control form-control-lg'}
                   name={'name'}
                   id={'name'}
                   value={teamForm.fields.name}
                   onChange={(event) => inputChangedHandler(event, 'name')}
            />
          </div>
        </div>

        {tournamentType === 'igbo_mix_and_match' && (
          <MixAndMatchShiftForm shiftsByEvent={tournament.shifts_by_event}
                                currentShifts={team.shifts}
                                onUpdate={updateShiftIdentifiers}/>
        )}
        {showInclusiveShifts && (
          <div className={'row mb-2'}>
            <label htmlFor={'shift_identifier'}
                   className={'col-form-label col-form-label-lg text-sm-end col-12 col-sm-4'}>
              Shift Preference
            </label>
            <div className={'col-sm-4'} id={'shift_identifier'}>
              <TeamShiftForm allShifts={tournament.shifts}
                             team={team}
                             shift={team.shifts[0]}
                             onShiftChange={multiShiftChangeHandler}/>
            </div>
          </div>
        )}

        <div className={'tournio-striped-list'}>
          {bowlerRows}
        </div>

        {team.size > 1 && (
          <div className={'row mb-2'}>
            {doublesPartnerSelection}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default TeamDetails;
