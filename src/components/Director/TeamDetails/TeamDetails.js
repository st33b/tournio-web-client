import {useState, useEffect, useMemo} from "react";
import {useTable} from "react-table";
import {Button} from "react-bootstrap";
import Link from 'next/link';

import PartnerSelectionRow from "./PartnerSelectionRow";

import classes from './TeamDetails.module.scss';
import ErrorBoundary from "../../common/ErrorBoundary";
import {useTournament} from "../../../director";
import {useRouter} from "next/router";

const TeamDetails = ({team, teamUpdateSubmitted}) => {
  const {loading, tournament} = useTournament();
  const router = useRouter();
  const {identifier: tournamentId, teamId} = router.query;

  let initialFormData = {
    valid: true,
    touched: false,
    fields: {
      name: {
        value: '',
        valid: true,
      },
      bowlers_attributes: {
        value: [],
        valid: true,
      },
    }
  }

  const [teamForm, setTeamForm] = useState(initialFormData);

  useEffect(() => {
    if (!team) {
      return;
    }
    const newFormData = {...teamForm}
    newFormData.fields.name.value = team.name;
    newFormData.fields.bowlers_attributes.value = team.bowlers.map((b) => {
      return {
        id: b.id,
        position: b.position,
        doubles_partner_id: b.doubles_partner_id,
      }
    }, [team]);
    setTeamForm(newFormData);
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
        if (!teamForm.fields.bowlers_attributes.value[index]) {
          return '';
        }
        return (
          <>
            <input type={'number'}
                   min={1}
                   max={4}
                   value={teamForm.fields.bowlers_attributes.value[index].position}
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
    {
      Header: 'Amount Due',
      accessor: 'amount_due',
      Cell: ({value}) => `$${value}`,
    },
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

  const inputChangedHandler = (event, inputName, index = -1) => {
    const updatedTeamForm = {...teamForm};
    updatedTeamForm.touched = true;

    switch (inputName) {
      case 'name':
        updatedTeamForm.fields.name.value = event.target.value;
        break;
      case 'position':
        updatedTeamForm.fields.bowlers_attributes.value[index].position = parseInt(event.target.value);
        const positions = updatedTeamForm.fields.bowlers_attributes.value.map((attrs) => attrs.position).sort();
        updatedTeamForm.fields.bowlers_attributes.valid = positions.reduce((result, value, index, array) => result && array[index - 1] < value);
        break;
    }

    // Do we need to Handle validity of partner assignments?
    let formIsValid = true;
    for (let fieldName in updatedTeamForm.fields) {
      formIsValid = formIsValid && updatedTeamForm.fields[fieldName].valid;
    }
    updatedTeamForm.valid = formIsValid;

    setTeamForm(updatedTeamForm);
  }

  const updateSubmitHandler = () => {
    const formData = {};
    for (let key in teamForm.fields) {
      formData[key] = teamForm.fields[key].value;
    }
    teamUpdateSubmitted(formData);
  }

  // When a doubles partner is clicked, what needs to happen:
  // - update the double partner assignments in state. (One click is enough to know everyone.)
  //  - Ex: Bowler A clicked on Bowler B
  //  - set A's partner to be B
  //  - set B's partner to be A (reciprocal)
  //  - set C and D to be partners (the remaining two)
  const gimmeNewDoublesPartners = (bowlerId, partnerId) => {
    // create a copy of the bowlers_attributes value array
    const newBowlers = teamForm.fields.bowlers_attributes.value.slice(0);

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

    const updatedTeamForm = {...teamForm}
    updatedTeamForm.fields.bowlers_attributes.value = newBowlers;
    updatedTeamForm.touched = true;
    setTeamForm(updatedTeamForm);
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
          return <PartnerSelectionRow key={bowler.id}
                                      bowler={bowler}
                                      allBowlers={team.bowlers}
                                      onPartnerSelected={gimmeNewDoublesPartners}
                                      values={teamForm.fields.bowlers_attributes.value}
          />
        })}
        </tbody>
      </table>
    </div>
  );

  //////////////////////////////////////////////////////////////////

  if (loading || !tournament || !team) {
    return '';
  }

  const maxTeamSize = parseInt(tournament.team_size);

  return (
    <ErrorBoundary>
      <div className={classes.TeamDetails}>
        <div className={'row mb-2'}>
          <label htmlFor={'team_name'} className={'col-form-label fw-bold text-sm-end col-12 col-sm-4'}>
            Team Name
          </label>
          <div className={'col'}>
            <input type={'text'}
                   className={'form-control'}
                   name={'name'}
                   id={'name'}
                   value={teamForm.fields.name.value}
                   onChange={(event) => inputChangedHandler(event, 'name')}
            />
          </div>
        </div>
        <div className={'row mb-2'}>
          <label htmlFor={'initial_size'}
                 className={'col-form-label fw-bold text-sm-end col-12 col-sm-4'}>
            Initially Requested Size
          </label>
          <div className={'col'}>
            <input type={'text'}
                   readOnly={true}
                   className={'form-control-plaintext'}
                   id={'initial_size'}
                   value={team.initial_size}
            />
          </div>
        </div>
        {team.size === 0 && (
          <div className={'border-top border-1 mt-3'}>
            <p className={'lead text-center mt-3'}>No bowlers on this team.</p>
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

            {maxTeamSize > team.bowlers.length && (
              <div className={'text-center'}>
                <Link href={{
                  pathname: `/director/tournaments/[identifier]/teams/[teamId]/add_bowler`,
                  query: {
                    identifier: tournamentId,
                    teamId: teamId,
                  }
                }}
                      className={'btn btn-success'}>
                  Add a New Bowler
                </Link>
              </div>
            )}

            {doublesPartnerSelection}

            <div className={'text-center mt-4'}>
              <Button variant={'primary'}
                      disabled={!teamForm.touched || !teamForm.valid}
                      onClick={updateSubmitHandler}
              >
                Update Details
              </Button>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>

  );
}

export default TeamDetails;
