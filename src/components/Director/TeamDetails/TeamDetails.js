import React, {useState, useEffect, useMemo} from "react";
import {useTable} from "react-table";
import Link from 'next/link';

import PartnerSelectionRow from "./PartnerSelectionRow";

import classes from './TeamDetails.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import {useRouter} from "next/router";
import TeamShiftForm from "./TeamShiftForm";
import MixAndMatchShiftForm from "./MixAndMatchShiftForm";

const TeamDetails = ({tournament, team, teamUpdated}) => {
  const router = useRouter();
  const {identifier: tournamentId, teamId} = router.query;

  let initialFormData = {
    fields: {
      name: '',
      initial_size: 4,
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
    newFormData.fields.initial_size = team.initial_size;
    newFormData.fields.bowlers_attributes = team.bowlers.map((b) => {
      return {
        id: b.id,
        position: b.position,
        doubles_partner_id: b.doubles_partner_id,
      }
    }, [team]);
    newFormData.fields.shift_identifiers = team.shifts.map(({identifier}) => identifier);
    setTeamForm(newFormData);
    teamUpdated(newFormData);
  }, [team]);

  let data = [];
  if (team) {
    data = team.bowlers;
  }
  // columns
  const columns = useMemo(() => [
    {
      Header: 'Position',
      accessor: 'position',
      Cell: ({row}) => {
        const index = row.index;
        if (!teamForm.fields.bowlers_attributes[index]) {
          return '';
        }
        return (
          <>
            <input type={'number'}
                   min={1}
                   max={4}
                   value={teamForm.fields.bowlers_attributes[index].position}
                   className={[classes.PositionInput, 'form-control'].join(' ')}
                   name={'team[bowlers_attributes][' + index + '][position]'}
                   id={'team_bowlers_attributes_' + index + '_position'}
                   onChange={(event) => inputChangedHandler(event, 'position', index)}
            />
            <input type={'hidden'}
                   value={row.original.id}
                   name={'team[bowlers_attributes][' + index + '][id]'}
                   id={'team_bowlers_attributes_' + index + '_id'}
            />
          </>
        );
      }
    },
    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({row, value}) => (
        <Link href={{
          pathname: '/director/tournaments/[identifier]/bowlers/[bowlerId]',
          query: {
            identifier: row.original.tournament.identifier,
            bowlerId: row.original.identifier,
          }
        }}
          // href={`/director/bowlers/${row.original.identifier}`}
        >
          {value}
        </Link>
      )
    },
    // {
    //   Header: 'Amount Due',
    //   accessor: 'amount_due',
    //   Cell: ({value}) => `$${value}`,
    // },
    {
      id: 'free_entry',
      Header: 'Free Entry',
      accessor: 'free_entry',
      Cell: ({value}) => {
        if (value === null) {
          return '--';
        }
        if (value.confirmed) {
          return value.unique_code;
        }
        return (
          <span title="Free entry is not yet confirmed">
            {value.unique_code} *
          </span>
        )
      }
    },
    {
      Header: 'Fees Paid?',
      accessor: 'paid',
      Cell: ({value}) => {
        const className = value ? 'bi-check-lg text-success' : 'bi-dash-circle text-danger';
        return (
          <span>
            <i className={className} aria-hidden={true}/>
            <span className={'visually-hidden'}>{value ? 'Paid' : 'Unpaid'}</span>
          </span>
        )
      }
    }
  ], [teamForm]);

  // tell react-table which things we want to use
  // and retrieve properties/functions they let us hook into
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {columns, data},
  );

  const errorMessages = (fields) => {
    const messages = [];

    // an array of flags, where the 0th element is ignored
    const markedPositions = Array(tournament.team_size + 1).fill(false);
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

    const sizeIsValid = fields.initial_size > 0 && fields.initial_size <= tournament.team_size;
    if (!sizeIsValid) {
      messages.push(`Joinable positions must be 1 - ${tournament.team_size}`);
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
      case 'initial_size':
        updatedTeamForm.fields.initial_size = parseInt(event.target.value);
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
      team.bowlers[index].doubles_partner_id = bowlerAttributeRow.doubles_partner_id;
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
          // Need the bowler to reflect the current state of doubles assignment in the form
          return <PartnerSelectionRow key={bowler.identifier}
                                      bowler={bowler}
                                      allBowlers={team.bowlers}
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

  const maxTeamSize = parseInt(tournament.team_size);
  const tournamentType = tournament.config_items.find(({key}) => key === 'tournament_type').value || 'igbo_standard';

  const addBowlerLink = (
    <div className={'text-end'}>
      <Link href={{
        pathname: `/director/tournaments/[identifier]/teams/[teamId]/add_bowler`,
        query: {
          identifier: tournamentId,
          teamId: teamId,
        }
      }}>
        <i className={'bi bi-plus-lg pe-2'} aria-hidden={true}/>
        Add a Bowler
      </Link>
    </div>
  );

  const showInclusiveShifts = tournamentType === 'igbo_multi_shift' || tournamentType === 'single_event' && tournament.shifts.length > 1;

  return (
    <ErrorBoundary>
      <div className={classes.TeamDetails}>
        <div className={'row mb-2'}>
          <label htmlFor={'team_name'}
                 className={'col-form-label col-form-label-lg text-sm-end col-12 col-sm-4'}>
            Team Name
          </label>
          <div className={'col'}>
            <input type={'text'}
                   className={'form-control'}
                   name={'name'}
                   id={'name'}
                   value={teamForm.fields.name}
                   onChange={(event) => inputChangedHandler(event, 'name')}
            />
          </div>
        </div>
        {/*<div className={'row mb-2'}>*/}
        {/*  <label htmlFor={'initial_size'}*/}
        {/*         className={'col-form-label col-form-label-lg text-sm-end col-12 col-sm-4'}>*/}
        {/*    Joinable Positions*/}
        {/*  </label>*/}
        {/*  <div className={'col-sm-4'}>*/}
        {/*    <input type={'number'}*/}
        {/*           min={1}*/}
        {/*           max={tournament.team_size}*/}
        {/*           onChange={(event) => inputChangedHandler(event, 'initial_size')}*/}
        {/*           className={'form-control'}*/}
        {/*           id={'initial_size'}*/}
        {/*           value={teamForm.fields.initial_size}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}

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

        {team.size === 0 && (
          <div className={'border-top border-1 mt-3'}>
            <p className={'lead text-center mt-3'}>
              No bowlers on this team.
            </p>
            {addBowlerLink}
          </div>
        )}
        {team.size > 0 && (
          <>
            <div className={'table-responsive'}>
              <table className={'table table-striped caption-top align-middle'} {...getTableProps}>
                <caption className={classes.Caption}>
                  Roster
                </caption>
                <thead>
                {headerGroups.map((headerGroup, i) => (
                  <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, j) => (
                      <th key={j} {...column.getHeaderProps()}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr key={i} {...row.getRowProps()}>
                      {row.cells.map((cell, j) => (
                        <td key={j} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>

            {team.size < maxTeamSize && addBowlerLink}

            {doublesPartnerSelection}
          </>
        )}
      </div>
    </ErrorBoundary>

  );
}

export default TeamDetails;
