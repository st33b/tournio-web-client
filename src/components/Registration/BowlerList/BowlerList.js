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
    columnHelper.accessor('name', {
      // cell: props => <a href={`/bowlers/${props.row.original.identifier}`}>{props.getValue()}</a>,
      // cell: props => <Link href={`/bowlers/${props.row.original.identifier}`}>${props.getValue()}</Link>,
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
      cell: info => info.getValue(),
      header: 'Team Name',
      enableGlobalFilter: true,
    }),
    columnHelper.accessor('doublesPartner', {
      cell: info => info.getValue(),
      header: 'Doubles Partner',
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('registeredOn', {
      header: 'Date Registered',
      enableGlobalFilter: false,
    }),
    // This will give us a link/button to the bowler's menu page
    // columnHelper.display({
    //   id: 'action',
    //   cell: <RowAction row={props.row} />,
    // }),
  ];

  const [globalFilter, setGlobalFilter] = useState('');

  const theTable = useReactTable({
    data: bowlers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={classes.BowlerList}>
      <form noValidate>
        <fieldset>
          <legend>
            Search!
          </legend>
          <div className={`row mb-3`}>
            <label className={`col-form-label col-3`} htmlFor={`searchField`}>
              Look for:
            </label>
            <div className={`col-9`}>
              <input type={'text'}
                     className={`form-control`}
                     id={`searchField`}
                     placeholder={`name, USBC id, ...`}
                     onChange={(e) => setGlobalFilter(e.target.value)}
                     value={globalFilter}
              />
            </div>
          </div>
        </fieldset>
      </form>

      <div className={`d-md-none`}>
        <ul className={`list-group list-group-flush`}>
          {theTable.getRowModel().rows.map(row => (
            <li className={`list-group-item ${classes.Bowler}`} key={row.id}>
              <p className={`${classes.Name}`}>
                <a href={`/bowlers/${row.original.identifier}`}>
                  {row.getValue('name')}
                </a>
              </p>
              <dl>
                {row.getVisibleCells().filter(({column}) => column.id !== 'name').map(cell => (
                  <div className={`row`} key={cell.id}>
                    <dt className={`col-5 text-end`}>
                      {cell.column.columnDef.header}
                    </dt>
                    <dd className={`col-7`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </dd>
                  </div>
                  ))}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BowlerList;
