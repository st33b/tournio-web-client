import {useMemo} from "react";
import {useFilters, useSortBy, useTable} from "react-table";

import {lessThan, isOrIsNot} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import TeamFilterForm from "../TeamFilterForm/TeamFilterForm";
import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";

import classes from './TeamListing.module.scss';

const TeamListing = ({teams, shiftCount = 1}) => {
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
      {
        Header: shiftCount > 1 ? 'Shift' : 'All Paid?',
        accessor: 'shift',
        Cell: ({row, value}) => {
          if (value === null) {
            return 'n/a';
          }
          const confClass = `text-${confClasses[row.original.who_has_paid]}`;
          let tooltip = '';
          switch(row.original.who_has_paid) {
            case 'none':
              tooltip = 'No members paid yet';
              break;
            case 'some':
              tooltip = 'At least one member paid, but not all';
              break;
            default:
              tooltip = 'All team members paid';
          }
          const shiftName = shiftCount > 1 ? value.name : '';
          return (
            <span className={'text-nowrap'}>
              {shiftName}
              <i className={`bi-circle-fill ms-1 ${confClass}`} aria-hidden={true} title={tooltip}/>
              <span className={'visually-hidden'}>{tooltip}</span>
            </span>
          )
        },
      },
      {
        Header: 'Place with Others?',
        accessor: 'place_with_others',
        Cell: ({value}) => {
          const classes = value ? ['text-success', 'bi-check-lg'] : ['text-danger', 'bi-dash-circle'];
          const text = value ? 'Yes' : 'No';
          return (
            <div className={'text-center'}>
              <i className={classes.join(' ')} aria-hidden={true}/>
              <span className={'visually-hidden'}>{text}</span>
            </div>
          );
        },
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

  let list = '';
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
      setFilter('size', 4);
    } else {
      setFilter('size', undefined);
    }
    if (criteria.place_with_others) {
      setFilter('place_with_others', true);
    } else {
      setFilter('place_with_others', undefined);
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
