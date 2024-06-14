import {useMemo} from "react";
import {useFilters, useSortBy, useTable} from "react-table";
import Link from 'next/link';

import {lessThan} from "../../../utils";
import TeamFilterForm from "../TeamFilterForm/TeamFilterForm";
import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";

import classes from './TeamListing.module.scss';

const TeamListing = ({tournament, teams, shiftCount = 1}) => {
  const confClasses = {
    none: 'danger',
    some: 'warning',
    all: 'success',
  }
  const columns = useMemo(() => [
      {
        Header: ({column}) => <SortableTableHeader text={'Team Name'} column={column}/>,
        accessor: 'name',
        Cell: ({row, value}) => (
          <Link href={{
            pathname: '/director/tournaments/[identifier]/teams/[teamId]',
            query: {
              identifier: row.original.tournament.identifier,
              teamId: row.original.identifier,
            }
          }}>
            {value}
          </Link>
        )
      },
      {
        Header: ({column}) => <SortableTableHeader text={'Initially Created'} column={column}/>,
        accessor: 'date_registered',
      },
      {
        Header: '# of Bowlers',
        accessor: 'size',
        disableSortBy: true,
        filter: lessThan,
      },
    ], []);

  let data = [];
  if (teams) {
    data = teams;
  }

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
    {columns, data},
    useFilters,
    useSortBy,
  );

  let list;
  if (data.length === 0) {
    list = (
      <div className={'display-6 text-center'}>
        No teams to display.
      </div>
    );
  } else {
    list = (
      <div className={'table-responsive mt-3'}>
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
    if (criteria.incomplete) {
      setFilter('size', tournament.team_size);
    } else {
      setFilter('size', undefined);
    }
  }

  const resetThoseFilters = () => {
    setAllFilters([]);
  }

  return (
    <div className={classes.TeamListing}>
      {data.length > 0 && <TeamFilterForm
        onFilterApplication={filterThatData}
        onFilterReset={resetThoseFilters}
      />}
      {list}
    </div>
  );
}

export default TeamListing;
