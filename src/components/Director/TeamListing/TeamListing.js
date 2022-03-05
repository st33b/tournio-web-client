import {useMemo} from "react";
import {useFilters, useSortBy, useTable} from "react-table";

import {lessThan} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import TeamFilterForm from "../TeamFilterForm/TeamFilterForm";
import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";

import classes from './TeamListing.module.scss';

const teamListing = ({teams}) => {
  const directorContext = useDirectorContext();

  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }
  const columns = useMemo(() => [
      {
        Header: ({column}) => <SortableTableHeader text={'Team Name'} column={column}/>,
        accessor: 'name',
        Cell: ({row, value}) => (
          <a href={`/director/teams/${row.original.identifier}`}>
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
        <table className={'table table-striped table-hover'} {...getTableProps}>
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

  return (
    <div className={classes.TeamListing}>
      <TeamFilterForm onFilterApplication={filterThatData}/>
      {list}
    </div>
  );
}

export default teamListing;