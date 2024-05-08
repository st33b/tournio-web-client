import classes from "./BowlerList.module.scss";
import {useState} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";

//
// @early-discount
// I'd like not to use ReactTable anymore, since bowlers are now displayed in a list
//

const BowlerList = ({tournament, bowlers = [], action = 'bowlerDetail'}) => {
  const router = useRouter();
  const {dispatch} = useRegistrationContext();
  const columnHelper = createColumnHelper();

  const LIST_HIDE_THRESHOLD = 5;

  const columns = [
    // We want the name to be linked, using the identifier
    columnHelper.accessor('identifier', {
      header: 'ID',
      enableGlobalFilter: false,
      enableHiding: true,
    }),
    columnHelper.accessor('firstName', {
      header: 'First Name',
      enableGlobalFilter: true,
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
    // Do we want a link to the team page?
    columnHelper.accessor('teamName', {
      cell: info => info.getValue() ? info.getValue() : 'n/a',
      header: 'Team Name',
      enableGlobalFilter: true,
    }),
    columnHelper.accessor(row => row.doublesPartner ? row.doublesPartner.listName : null, {
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

  const confirmPartnerUp = (event, targetPartner) => {
    event.preventDefault();
    if (confirm(`By proceeding, I affirm that ${targetPartner.fullName} knows that I am partnering up with them.`)) {
      dispatch(partnerUpRegistrationInitiated(targetPartner));
      router.push(`/tournaments/${tournament.identifier}/partner-up-bowler`);
    }
  }

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
                  {action === 'partnerUp' && (
                    <a href={`/bowlers/${row.getValue('identifier')}`}
                       onClick={(e) => confirmPartnerUp(e, row.original)}
                       className={`btn btn-primary`}
                       role={'button'}
                    >
                      Partner Up
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
