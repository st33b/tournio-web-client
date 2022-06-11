import {useEffect, useMemo, useRef, useState} from 'react';
import {useTable, useSortBy, useFilters} from 'react-table';
import {List} from 'immutable';

import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";


import classes from './BowlerListing.module.scss';

const BowlerListing = ({caption, bowlers, enablePayment, includeEvents, successType, enablePartnerUp}) => {
  const columnList = [
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
  ];
  if (!enablePartnerUp) {
    columnList.push({
        Header: 'Doubles Partner',
        accessor: 'doubles_partner',
        Cell: ({row, cell}) => !!cell.value ? cell.value.full_name : '',
      });
  }
  const columns = useMemo(() => columnList, [bowlers]);

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
                {enablePartnerUp && (
                  <td className={'text-end'}>
                    <a href={`/bowlers/${row.original.identifier}`}
                       className={'btn btn-sm btn-outline-success'}>
                      Partner Up
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

  let successBanner = '';
  if (successType) {
    let content = '';
    switch (successType) {
      case 'new_pair':
        content = 'Your registration was received! Each bowler may now choose their events and pay their fees.';
        break;
      default:
        content = "Something was successful! I just don't know what.";
        break;
    }

    successBanner = (
      <div className={'alert alert-success'} role={'alert'}>
        <h5 className={'alert-heading'}>
          <i className={'bi-check-circle-fill pe-2'} aria-hidden={true} />
          Success!
        </h5>
        <p className={classes.SuccessMessage}>
          {content}
        </p>
      </div>
    );
  }

  return (
    <div className={classes.BowlerListing}>
      {successBanner}
      {list}
    </div>
  );
}

export default BowlerListing;