import {useEffect, useMemo, useRef, useState} from 'react';
import {useTable, useSortBy, useFilters} from 'react-table';
import {List} from 'immutable';

import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";


import classes from './BowlerListing.module.scss';

const BowlerListing = ({caption, bowlers, enablePayment, includeEvents}) => {
  const columns = useMemo(() => [
    {
      id: 'full_name',
      Header: ({column}) => <SortableTableHeader text={'Name'} column={column}/>,
      accessor: 'full_name',
      Cell: ({row, cell}) => <a href={`/bowlers/${row.original.identifier}`}>{cell.value}</a>,
    },
    {
      Header: ({column}) => <SortableTableHeader text={'Date Registered'} column={column}/>,
      accessor: 'date_registered',
    },
  ], [bowlers]);

  const [data, setData] = useState(List());
  useEffect(() => {
    if (!bowlers) {
      return;
    }
    setData(List(bowlers));
  }, [bowlers]);

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

  /////////////////////////////////////////////////

  let list = (
    <div className={'display-6 text-center'}>
      No bowlers to display.
    </div>
  );
  if (data.size > 0) {
    list = (
      <div className={'table-responsive'}>
        <table className={'table table-striped table-hover table-sm caption-top'} {...getTableProps}>
          <caption>
            {caption}
          </caption>
          <thead className={'table-light'}>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th key={j} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                </th>
              ))}
              {enablePayment && <th />}
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
                {enablePayment && (
                  <td className={'text-end'}>
                    <a href={`/bowlers/${row.original.identifier}`}
                       className={'btn btn-sm btn-secondary'}>
                      Choose Events &amp; Pay
                    </a>
                  </td>
                )}
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={classes.BowlerListing}>
      {list}
    </div>
  );
}

export default BowlerListing;