import React, {useEffect, useMemo, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {useTable, useSortBy, useFilters} from 'react-table';
import {List} from 'immutable';

import LoadingMessage from "../../ui/LoadingMessage/LoadingMessage";
import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";
import UserFilterForm from "../UserFilterForm/UserFilterForm";
import {tournamentName} from '../../../utils';

import classes from './UserListing.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";

const UserListing = ({tournaments}) => {
  const {directorState} = useDirectorContext();

  const columns = useMemo(() => [
    {
      id: 'last_name',
      Header: ({column}) => <SortableTableHeader text={'Last Name'} column={column}/>,
      accessor: 'last_name',
    },
    {
      id: 'first_name',
      accessor: 'first_name',
      Header: 'First Name',
      disableSortBy: true,
    },
    {
      id: 'email',
      Header: ({column}) => <SortableTableHeader text={'Email'} column={column}/>,
      accessor: 'email',
      Cell: ({row}) => (
        <a href={'/director/users/' + row.original.identifier}>
          {row.original.email}
        </a>
      )
    },
    {
      id: 'role',
      Header: 'Role',
      accessor: 'role',
      disableSortBy: true,
    },
    {
      id: 'tournaments',
      accessor: 'tournaments',
      Header: 'Tournaments',
      Cell: ({row}) => row.original.tournaments.map(t => (t.name)).join(', '),
      filter: tournamentName,
      disableSortBy: true,
    },
    {
      id: 'last_sign_in_at',
      accessor: 'last_sign_in_at',
      Header: ({column}) => <SortableTableHeader text={'Last Signed In'} column={column}/>,
    },
  ], [directorState.users]);

  // tell react-table which things we want to use (sorting, filtering)
  // and retrieve properties/functions they let us hook into
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
    setAllFilters,
  } = useTable(
    {columns, data: directorState.users},
    useFilters,
    useSortBy,
  );

  let list = '';
  if (!directorState.users) {
    list = <LoadingMessage message={'Retrieving users...'} />;
  } else if (directorState.users.length === 0) {
    list = <p>No users to display.</p>;
  } else {
    list = (
      <div className={'table-responsive'}>
        <table className={'table table-striped table-hover'} {...getTableProps}>
          <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th key={j} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
    );
  }

  const filterThatData = (criteria) => {
    if (criteria.tournament) {
      setFilter('tournaments', criteria.tournament);
    } else if (criteria.has_no_tournament) {
      setFilter('tournaments', '');
    } else {
      setFilter('tournaments', undefined);
    }

    setFilter('email', criteria.email);

    if (criteria.has_not_signed_in) {
      setFilter('last_sign_in_at', 'n/a');
    } else {
      setFilter('last_sign_in_at', undefined);
    }
  }

  const resetThoseFilters = () => {
    setAllFilters([]);
  }

  return (
    <div className={classes.UserListing}>
      <Row>
        <Col>
          {!!directorState.users.size && <UserFilterForm onFilterApplication={filterThatData} onFilterReset={resetThoseFilters} tournaments={tournaments}/>}
          {list}
        </Col>
      </Row>
    </div>
  );
};

export default UserListing;