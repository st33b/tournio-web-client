import {useMemo} from 'react';
import {useTable, useSortBy} from 'react-table';
import Button from "react-bootstrap/Button";

import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";

import classes from './FreeEntryListing.module.scss';

const FreeEntryListing = ({freeEntries, confirmClicked, deleteClicked}) => {
  const usedBy = (row) => {
    if (row.bowler === null) {
      return '--'
    }
    return row.bowler.last_name + ', ' + row.bowler.first_name;
  }

  const data = freeEntries;
  const columns = useMemo(() => [
      {
        Header: ({column}) => <SortableTableHeader text={'Unique Code'} column={column}/>,
        accessor: 'unique_code',
      },
      {
        id: 'used_by',
        Header: ({column}) => <SortableTableHeader text={'Used By'} column={column}/>,
        accessor: usedBy,
      },
      {
        Header: () => <div className={'text-center'}>Confirmed?</div>,
        accessor: 'confirmed',
        disableSortBy: true,
        Cell: ({cell: {value}}) => {
          const classes = value ? ['text-success', 'bi-check-lg'] : ['text-danger', 'bi-x-lg'];
          const text = value ? 'Yes' : 'No';
          return (
            <div className={'text-center'}>
              <i className={classes.join(' ')} aria-hidden={true}/>
              <span className={'visually-hidden'}>{text}</span>
            </div>
          )
        }
      },
      {
        Header: () => <div className={'text-center'}>Actions</div>,
        id: 'actions',
        Cell: ({row}) => {
          let deleteButton = (
            <Button variant={'outline-secondary'}
                    size={'sm'}
                    className={classes.ActionButton}
                    title='Cannot delete a confirmed free entry'
                    disabled={true}>
              Delete
            </Button>
          );
          let confirmButton = '';
          if (!row.values.confirmed) {
            deleteButton = (
              <Button variant={'outline-danger'}
                      size={'sm'}
                      className={classes.ActionButton}
                      title='Delete this free entry'
                      disabled={false}
                      onClick={(event) => deleteClicked(row.original)}
              >
                Delete
              </Button>
            );
            if (row.values.used_by !== '--') {
              confirmButton = (
                <Button variant={'outline-success'}
                        size={'sm'}
                        className={classes.ActionButton}
                        title={'Confirm this free entry for the given bowler'}
                        onClick={(event) => confirmClicked(row.original)}
                >
                  Confirm
                </Button>
              );
            }
          }
          return (
            <div className={'text-center'}>
              {confirmButton}
              {deleteButton}
            </div>
          );
        }
      },
    ],
    [data]
  );

  // tell react-table which things we want to use (sorting, filtering)
  // and retrieve properties/functions they let us hook into
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {columns, data},
    useSortBy,
  );

  if (data.length === 0) {
    return (
      <div className={'display-6 text-center'}>
        No free entries to display.
      </div>
    );
  }

  return (
    <div className={`${classes.FreeEntryListing} table-responsive`}>
      <table className={`table table-striped table-hover`} {...getTableProps}>
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

export default FreeEntryListing;