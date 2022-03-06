import {useMemo} from 'react';
import {useTable, useSortBy, useFilters} from 'react-table';

import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";
import BowlerFilterForm from "../BowlerFilterForm/BowlerFilterForm";
import {doesNotEqual} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './BowlerListing.module.scss';

const bowlerListing = ({bowlers}) => {
  const directorContext = useDirectorContext();

  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }

  const columns = useMemo(() => [
      {
        id: 'name',
        Header: ({column}) => <SortableTableHeader text={'Name'} column={column}/>,
        accessor: (props) => props.last_name + ', ' + props.first_name,
        Cell: ({row, cell}) => {
          return (
            <a href={`/director/bowlers/${row.original.identifier}`}>
              {cell.value}
            </a>
          )
        }
      },
      {
        Header: 'Preferred Name',
        accessor: 'preferred_name',
        disableSortBy: true,
      },
      {
        Header: ({column}) => <SortableTableHeader text={'Team Name'} column={column}/>,
        accessor: 'team_name',
        Cell: ({row, cell}) => (
          <a href={`/director/teams/${row.original.team_identifier}`}>
            {cell.value}
          </a>
        ),
      },
      {
        Header: 'Position',
        accessor: 'position',
        disableSortBy: true,
      },
      {
        Header: ({column}) => <SortableTableHeader text={'Date Registered'} column={column}/>,
        accessor: 'date_registered',
      },
      {
        Header: 'Free Entry?',
        accessor: 'has_free_entry',
        disableSortBy: true,
        Cell: ({cell: {value}}) => {
          const classes = value ? ['text-success', 'bi-check-lg'] : ['text-danger', 'bi-x-lg'];
          const text = value ? 'Yes' : 'No';
          return (
            <>
              <i className={classes.join(' ')} aria-hidden={true}/>
              <span className={'visually-hidden'}>{text}</span>
            </>
          )
        }
      },
      {
        Header: 'Billed',
        accessor: 'amount_billed',
        disableSortBy: true,
      },
      {
        Header: 'Due',
        accessor: 'amount_due',
        filter: doesNotEqual,
      },
    ], [identifier]);

  const data = bowlers;

  // tell react-table which things we want to use (sorting, filtering)
  // and retrieve properties/functions they let us hook into
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable(
    {columns, data},
    useFilters,
    useSortBy,
  );

  let list = '';
  if (data.length === 0) {
    list = (
      <div className={'display-6 text-center'}>
        No bowlers to display.
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
    setFilter('name', criteria.name);

    if (criteria.amount_due) {
      setFilter('amount_due', '$0');
    } else {
      setFilter('amount_due', '');
    }
    setFilter('has_free_entry', criteria.has_free_entry)
  }

  return (
    <div className={classes.BowlerListing}>
      <BowlerFilterForm onFilterApplication={filterThatData}/>
      {list}
    </div>
  );
};

export default bowlerListing;