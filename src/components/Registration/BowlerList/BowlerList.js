import classes from "./BowlerList.module.scss";
import {useEffect, useMemo, useRef, useState} from 'react';
import {Link} from 'next';
import {createColumnHelper, getCoreRowModel, useReactTable} from "@tanstack/react-table";

const BowlerList = ({bowlers, caption, includeMenuLink}) => {
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
      cell: props => <Link href={`/bowlers/${props.row.original.identifier}`}>${props.getValue()}</Link>,
      header: 'Name',
    }),
    // Do we want a link to the team page?
    columnHelper.accessor('team', {
      cell: info => info.getValue(),
      header: 'Team Name',
    }),
    columnHelper.accessor('doubles_partner', {
      cell: info => info.getValue(),
      header: 'Doubles Partner',
    }),
    columnHelper.accessor('usbc_id', {
      cell: info => info.getValue(),
      header: 'USBC ID',
    }),
    columnHelper.accessor('registered_on', {
      header: 'Date Registered',
    }),
    // This will give us a link/button to the bowler's menu page
    // columnHelper.display({
    //   id: 'action',
    //   cell: <RowAction row={props.row} />,
    // }),
  ];

  const theTable = useReactTable({
    data: bowlers,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={classes.BowlerList}>
      <div className={`d-md-none`}>
        <ul className={`list-group`}>
          
        </ul>
      </div>
    </div>
  )
}

export default BowlerList;
