import classes from "./BowlerList.module.scss";
import {useState} from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";

// @tournament Used only to determine whether to display team name and/or doubles partner
// @bowlers List of bowlers
const BowlerList = ({bowlers = [], action = 'bowlerDetail'}) => {
  const columnHelper = createColumnHelper();

  const LIST_HIDE_THRESHOLD = 10;

  const columns = [
    // We want the name to be linked, using the identifier
    columnHelper.accessor('identifier', {
      header: 'ID',
      enableGlobalFilter: false,
      enableHiding: true,
    }),
    columnHelper.accessor('listName', {
      header: 'Name',
      enableGlobalFilter: true,
    }),
    columnHelper.accessor('usbcId', {
      cell: info => info.getValue(),
      header: 'USBC ID',
      enableGlobalFilter: true,
    }),
  ];

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({
    identifier: false,
    listName: false, // we display this as a heading, so no need to display it in the property list
  });

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

  const displayBowlers = bowlers.length < LIST_HIDE_THRESHOLD && bowlers.length > 0 || matchingBowlerCount < bowlers.length;

  return (
    <div className={classes.BowlerList}>
      <form noValidate onSubmit={(e) => {
        // Ignore the Enter/Return key
        e.preventDefault();
      }}>
        <div className={`mb-3 d-flex flex-wrap`}>
          <label className={`col-form-label pe-2`} htmlFor={`searchField`}>
            Find&nbsp;by:
          </label>
          <div className={`flex-grow-1`}>
            <input type={'text'}
                   className={`form-control`}
                   id={`searchField`}
                   onChange={(e) => setGlobalFilter(e.target.value)}
                   placeholder={'Name, USBC id, team name, ...'}
                   value={globalFilter}
            />
          </div>
        </div>
      </form>

      {!displayBowlers && (
        <p className={`mt-5 text-secondary ${classes.MatchCount}`}>
          Search results will appear here.
        </p>
      )}
      {displayBowlers && (
        <>
          <p className={`${classes.MatchCount}`}>
            {matchingBowlerCount} result{matchingBowlerCount !== 1 ? 's' : ''} found
          </p>

          <ul className={`list-group list-group-flush ${classes.Bowlers}`}>
            {theTable.getRowModel().rows.map(row => (
              <li className={`row d-flex align-items-lg-center mb-2 mb-lg-0 py-lg-3 ${classes.Bowler}`} key={row.id}>
                <div className={`col-12 col-lg-5 overflow-x-hidden ${classes.Name}`}>
                  {action === 'bowlerDetail' && (
                    <a href={`/bowlers/${row.getValue('identifier')}`}>
                      {row.getValue('listName')}
                    </a>
                  )}
                  {action !== 'bowlerDetail' && row.getValue('listName')}
                </div>
                <div className={`col-12 col-lg-3 my-2`}>
                  <span className={`fw-bold pe-1`}>
                    USBC ID:
                  </span>
                  {row.getValue('usbcId')}
                </div>
                <div className={`col-12 col-lg-4 text-lg-end pb-2 pb-lg-0`}>
                  {action === 'bowlerDetail' && (
                    <a href={`/bowlers/${row.getValue('identifier')}`}
                       className={`btn btn-success`}
                       role={'button'}
                    >
                      Fees &amp; Extras
                      <i className={`bi bi-arrow-right ps-2`} aria-hidden={true}/>
                    </a>
                  )}
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
