import classes from "./BowlerList.module.scss";
import {useEffect, useMemo, useRef, useState} from 'react';
import {Link} from 'next';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import {devConsoleLog} from "../../../utils";

const BowlerList = ({bowlers = [], caption, includeMenuLink}) => {
  // identifier
  // name
  // team_name
  // doubles_partner (name)
  // usbc_id
  // registered_on

  const columnHelper = createColumnHelper();

  const columns = [
    // We want the name to be linked, using the identifier
    columnHelper.accessor('identifier', {
      header: 'ID',
      enableGlobalFilter: false,
      enableHiding: true,
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      enableGlobalFilter: true,
    }),
    columnHelper.accessor('usbcId', {
      cell: info => info.getValue(),
      header: 'USBC ID',
      enableGlobalFilter: true,
    }),
    // Do we want a link to the team page?
    columnHelper.accessor('teamName', {
      cell: info => info.getValue() ? info.getValue() : 'n/a',
      header: 'Team Name',
      enableGlobalFilter: true,
    }),
    columnHelper.accessor('doublesPartner', {
      cell: info => info.getValue() ? info.getValue() : 'n/a',
      header: 'Doubles Partner',
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('registeredOn', {
      header: 'Date Registered',
      enableGlobalFilter: false,
    }),
  ];

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({ identifier: false, name: false })

  const theTable = useReactTable({
    data: bowlers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const matchingBowlerCount = theTable.getRowModel().rows.length;
  return (
    <div className={classes.BowlerList}>
      <form noValidate>
        <div className={`mb-3 d-flex flex-wrap`}>
          <label className={`col-form-label pe-2`} htmlFor={`searchField`}>
            Find&nbsp;by:
          </label>
          <div className={`flex-grow-1`}>
            <input type={'text'}
                   className={`form-control`}
                   id={`searchField`}
                   onChange={(e) => setGlobalFilter(e.target.value)}
                   value={globalFilter}
            />
            <div className={`form-text`}>
              Name, USBC id, team name, ...
            </div>
          </div>
        </div>
      </form>

      {matchingBowlerCount === bowlers.length && (
        <p className={`${classes.MatchCount}`}>
          Matching bowlers will appear here.
        </p>
      )}
      {matchingBowlerCount < bowlers.length && (
        <>
          <p className={`${classes.MatchCount}`}>
            {matchingBowlerCount} matching bowlers
          </p>

          <ul className={`list-group list-group-flush ${classes.Bowlers}`}>
            {theTable.getRowModel().rows.map(row => (
              <li className={`list-group-item ${classes.Bowler}`} key={row.id}>
                <p className={` ${classes.Name}`}>
                  <a href={`/bowlers/${row.getValue('identifier')}`}>
                    {row.getValue('name')}
                  </a>
                </p>
                <dl className={`mb-1`}>
                  {row.getVisibleCells().map(cell => (
                    <div className={`row g-3`} key={cell.id}>
                      <dt className={`col-5 col-sm-6 text-end ps-0`}>
                        {cell.column.columnDef.header}
                      </dt>
                      <dd className={`col pe-0`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className={`d-flex justify-content-end pb-2`}>
                  <a href={`/bowlers/${row.getValue('identifier')}`}
                     className={`btn btn-success`}
                     role={'button'}
                  >
                    Fees &amp; Extras
                    <i className={`bi bi-arrow-right ps-2`}
                       aria-hidden={true} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default BowlerList;
