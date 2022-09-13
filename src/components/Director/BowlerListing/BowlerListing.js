import {useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from "next/router";
import {useTable, useSortBy, useFilters} from 'react-table';
import {List} from 'immutable';
import {Overlay, Popover} from "react-bootstrap";

import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";
import BowlerFilterForm from "../BowlerFilterForm/BowlerFilterForm";
import {directorApiRequest, doesNotEqual, isOrIsNot, equals} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './BowlerListing.module.scss';

const IgboMemberCell = ({
                          value: initialValue,
                          row: {index, original},
                          column: {id},
                          updateTheData,
                        }) => {
  const [checked, setChecked] = useState(initialValue);
  const [showPopover, setShowPopover] = useState(false);
  const target = useRef(null);
  const context = useDirectorContext();
  const router = useRouter();

  const onChangeSuccess = (checked, data) => {
    updateTheData(index, id, checked);

    // trigger the popover
    setShowPopover(true);
  }

  const onChangeFailure = (data) => {
    console.log("Failure", data);
  }

  const submitStatusChange = (newStatus) => {
    const uri = `/director/bowlers/${original.identifier}`;
    const requestConfig = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        bowler: {
          verified_data: {
            igbo_member: newStatus,
          }
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: (data) => onChangeSuccess(newStatus, data),
      onFailure: onChangeFailure,
    });
  }

  const igboMemberBoxChanged = (event) => {
    const isCheckedNow = event.target.checked;
    setChecked(isCheckedNow);
    submitStatusChange(isCheckedNow);
  }

  useEffect(() => {
    setChecked(initialValue);
  }, [initialValue]);

  return (
    <div className={classes.IgboMember}>
      <input type={'checkbox'}
             className={'form-check-input'}
             checked={checked}
             onChange={igboMemberBoxChanged}
             ref={target}
      />
      <Overlay target={target.current}
               rootClose={true}
               onHide={() => { setShowPopover(false)}}
               show={showPopover}
               placement={'right'}>
        {(props) => (
          <Popover id={`popover-${id}`} {...props}>
            <Popover.Body>
              Saved
            </Popover.Body>
          </Popover>
        )}
      </Overlay>
    </div>
  );
}

const BowlerListing = ({bowlers}) => {
  const columns = useMemo(() => [
    {
      id: 'name',
      Header: ({column}) => <SortableTableHeader text={'Name'} column={column}/>,
      // accessor: (props) => props.last_name + ', ' + props.first_name,
      accessor: 'full_name',
      Cell: ({row, cell}) => {
        return (
          <a href={`/director/bowlers/${row.original.identifier}`}>
            {cell.value}
          </a>
        )
      }
    },
    {
      id: 'email',
      Header: 'Email',
      accessor: 'email',
    },
    // {
    //   Header: 'Preferred Name',
    //   accessor: 'preferred_name',
    //   disableSortBy: true,
    // },
    {
      Header: ({column}) => <SortableTableHeader text={'Team Name'} column={column}/>,
      accessor: 'team_name',
      Cell: ({row, cell}) => {
        return row.original.team === null ? 'n/a' : (
          <a
            href={`/director/teams/${row.original.team.identifier}`}>
            {row.original.team.name}
          </a>
          )
      },
      disableSortBy: true,
      filter: equals,
    },
    // {
    //   Header: 'Position',
    //   accessor: 'position',
    //   disableSortBy: true,
    //   Cell: ({value}) => (
    //     <div className={'text-center'}>
    //       {value}
    //     </div>
    //   )
    // },
    {
      Header: ({column}) => <SortableTableHeader text={'Date Registered'} column={column}/>,
      accessor: 'date_registered',
    },
    {
      Header: 'IGBO Member?',
      accessor: 'igbo_member',
      Cell: IgboMemberCell,
      disableSortBy: true,
      filter: isOrIsNot,
    },
    {
      Header: 'Free Entry?',
      accessor: 'has_free_entry',
      disableSortBy: true,
      Cell: ({cell: {value}}) => {
        const classes = value ? ['text-success', 'bi-check-lg'] : ['text-danger', 'bi-x-lg'];
        const text = value ? 'Yes' : 'No';
        return (
          <div className={'text-center'}>
            <i className={classes.join(' ')} aria-hidden={true}/>
            <span className={'visually-hidden'}>{text}</span>
          </div>
        );
      }
    },
    {
      Header: 'Billed',
      accessor: 'amount_billed',
      disableSortBy: true,
      filter: equals,
      Cell: ({value}) => `$${value}`,
    },
    {
      Header: 'Due',
      accessor: 'amount_due',
      filter: doesNotEqual,
      Cell: ({value}) => `$${value}`,
    },
  ], []);

  let data = [];
  if (bowlers) {
    data = bowlers;
  }

  const updateTheData = (rowIndex, columnId, isChecked) => {
    const oldRow = data.get(rowIndex);
    const newRow = {...oldRow, [columnId]: isChecked};
    const newData = data.set(rowIndex, newRow);
    setData(newData);
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
    {columns, data, updateTheData},
    useFilters,
    useSortBy,
  );

  let list = '';
  if (data.size === 0) {
    list = (
      <div className={'display-6 text-center'}>
        No bowlers to display.
      </div>
    );
  } else {
    list = (
      <div className={'table-responsive'}>
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
    setFilter('name', criteria.name);
    setFilter('email', criteria.email);

    if (criteria.amount_due) {
      setFilter('amount_due', 0);
    } else {
      setFilter('amount_due', undefined);
    }
    if (criteria.amount_billed) {
      setFilter('amount_billed', 0);
    } else {
      setFilter('amount_billed', undefined);
    }
    setFilter('has_free_entry', criteria.has_free_entry)
    setFilter('igbo_member', criteria.igbo_member);
    if (criteria.no_team) {
      setFilter('team_name', 'n/a');
    } else {
      setFilter('team_name', undefined);
    }
  }

  const resetThoseFilters = () => {
    setAllFilters([]);
  }

  return (
    <div className={classes.BowlerListing}>
      {data.length > 0 && <BowlerFilterForm onFilterApplication={filterThatData} onFilterReset={resetThoseFilters}/>}
      {list}
    </div>
  );
};

export default BowlerListing;