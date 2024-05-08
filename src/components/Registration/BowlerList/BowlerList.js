import classes from "./BowlerList.module.scss";
import {useState, useEffect} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";

// @tournament Used only to determine whether to display team name and/or doubles partner
// @bowlers List of bowlers
const BowlerList = ({tournament, bowlers = [], action = 'bowlerDetail'}) => {
  const columnHelper = createColumnHelper();

  const LIST_HIDE_THRESHOLD = 5;

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
    columnHelper.accessor(row => row.team ? row.team.name : null, {
      cell: info => info.getValue() ? info.getValue() : 'n/a',
      id: 'teamName',
      header: 'Team Name',
      enableGlobalFilter: true,
    }),
    columnHelper.accessor(row => row.doublesPartner ? row.doublesPartner.listName : null, {
      cell: info => info.getValue() ? info.getValue() : 'n/a',
      id: 'doublesPartner',
      header: 'Doubles Partner',
      enableGlobalFilter: false,
    }),
  ];

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({
    identifier: false,
    listName: false, // we display this as a heading, so no need to display it in the property list
    teamName: false,
    doublesPartner: false,
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

  useEffect(() => {
    if (!tournament) {
      return;
    }

    // Hide these columns if the tournament doesn't have corresponding events
    const cvControls = {...columnVisibility};
    if (!tournament.events.find(event => event.rosterType === 'double')) {
      cvControls.doublesPartner = false;
    }
    if (!tournament.events.find(event => event.rosterType === 'team')) {
      cvControls.teamName = false;
    }
    setColumnVisibility(cvControls);
  }, [tournament]);

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
              <li className={`list-group-item ${classes.Bowler}`} key={row.id}>
                <p className={` ${classes.Name}`}>
                  {action === 'bowlerDetail' && (
                    <a href={`/bowlers/${row.getValue('identifier')}`}>
                      {row.getValue('listName')}
                    </a>
                  )}
                  {action !== 'bowlerDetail' && row.getValue('listName')}
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
                  {action === 'bowlerDetail' && (
                    <a href={`/bowlers/${row.getValue('identifier')}`}
                       className={`btn btn-success`}
                       role={'button'}
                    >
                      Fees &amp; Extras
                      <i className={`bi bi-arrow-right ps-2`}
                         aria-hidden={true} />
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
