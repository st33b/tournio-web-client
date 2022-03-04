import {useEffect, useState, useMemo} from "react";
import axios from "axios";
import {useFilters, useSortBy, useTable} from "react-table";

import {apiHost, lessThan} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import TeamFilterForm from "../TeamFilterForm/TeamFilterForm";
import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";

import classes from './TeamListing.module.scss';

const teamListing = ({teams}) => {
  const directorContext = useDirectorContext();
  const [errorMessage, setErrorMessage] = useState(null);

  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }
  const columns = useMemo(() => [
      {
        Header: ({column}) => <SortableTableHeader text={'Team Name'} column={column}/>,
        accessor: 'name',
        Cell: ({row, value}) => (
          <a href={`/director/tournaments/${identifier}/teams/${row.original.identifier}`}>
            {value}
          </a>
        )
      },
      {
        Header: ({column}) => <SortableTableHeader text={'Initially Created'} column={column}/>,
        accessor: 'date_registered',
      },
      {
        Header: 'Size',
        accessor: 'size',
        disableSortBy: true,
        filter: lessThan,
      },
    ], [identifier]);

  const data = teams;

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

  let list = '';
  if (data.length === 0) {
    list = (
      <div className={'display-6 text-center'}>
        No teams to display.
      </div>
    );
  } else {
    list = (
      <div className={'table-responsive'}>
        <table className={'table table-striped'} {...getTableProps}>
          <thead className={'table-light'}>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
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
      setFilter('size', 4);
    } else {
      setAllFilters([]);
    }
  }

  let error = '';
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          <strong>
            Oh no!
          </strong>
          {' '}{errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.TeamListing}>
      {error}
      <TeamFilterForm onFilterApplication={filterThatData}/>
      {list}
    </div>
  );
}

export default teamListing;