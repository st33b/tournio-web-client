import {useState, useEffect, useMemo} from 'react';
import {useRouter} from "next/router";
import axios from "axios";
import {useTable, useSortBy, useFilters} from 'react-table';

import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";
import BowlerFilterForm from "../BowlerFilterForm/BowlerFilterForm";
import {apiHost, doesNotEqual} from "../../../utils";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './BowlerListing.module.scss';

const bowlerListing = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  const {identifier} = router.query;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  let errorMessage = '';
  useEffect(() => {
    if (!identifier) {
      return;
    }

    const requestConfig = {
      method: 'get',
      url: `${apiHost}/director/tournaments/${identifier}/bowlers`,
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      }
    }
    axios(requestConfig)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        errorMessage = error;
        setLoading(false);
      });
  }, [identifier]);

  const columns = useMemo(() => [
      {
        id: 'name',
        Header: ({column}) => <SortableTableHeader text={'Name'} column={column}/>,
        accessor: (props) => props.last_name + ', ' + props.first_name,
        Cell: ({row, cell}) => {
          return (
            <a href={`/director/tournaments/${identifier}/bowlers/${row.original.identifier}`}>
              {cell.value}
            </a>
          )
        }
      },
      {
        Header: 'Preferred Name',
        accessor: 'preferred_name',
        disableSortBy: true,
      },
      {
        Header: ({column}) => <SortableTableHeader text={'Team Name'} column={column}/>,
        accessor: 'team_name',
      },
      {
        Header: 'Position',
        accessor: 'position',
        disableSortBy: true,
      },
      {
        Header: ({column}) => <SortableTableHeader text={'Date Registered'} column={column}/>,
        accessor: 'date_registered',
      },
      {
        Header: 'Free Entry?',
        accessor: 'has_free_entry',
        disableSortBy: true,
        Cell: ({cell: {value}}) => {
          const classes = value ? ['text-success', 'bi-check-lg'] : ['text-danger', 'bi-x-lg'];
          const text = value ? 'Yes' : 'No';
          return (
            <>
              <i className={classes.join(' ')} aria-hidden={true}/>
              <span className={'visually-hidden'}>{text}</span>
            </>
          )
        }
      },
      {
        Header: 'Billed',
        accessor: 'amount_billed',
        disableSortBy: true,
      },
      {
        Header: 'Due',
        accessor: 'amount_due',
        filter: doesNotEqual,
      },
    ], [identifier]);

  // tell react-table which things we want to use (sorting, filtering)
  // and retrieve properties/functions they let us hook into
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable(
    {columns, data},
    useFilters,
    useSortBy,
  );

  let alertMessage = '';
  // if (props.location.state && props.location.state.bowlerDeleteSuccess) {
  //   alertMessage = (
  //     <div className="col-12 alert alert-success alert-dismissible fade show" role="alert">
  //       <span>
  //         <strong>Success!</strong> Bowler deleted.
  //       </span>
  //       <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"/>
  //     </div>
  //   );
  // }

  if (!directorContext.tournament || loading) {
    return (
      <div className={classes.BowlerListing}>
        <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
      </div>
    );
  }
  
  let list = '';
  if (data.length === 0) {
    list = (
      <div className={'display-6 text-center'}>
        No bowlers to display.
      </div>
    );
  } else {
    list = (
      <div className={'table-responsive'}>
        <table className={'table table-striped'} {...getTableProps}>
          <thead className={'table-light'}>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
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

    if (criteria.amount_due) {
      setFilter('amount_due', '$0');
    } else {
      setFilter('amount_due', '');
    }
    setFilter('has_free_entry', criteria.has_free_entry)
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: directorContext.tournament.name, path: `/director/tournaments/${directorContext.tournament.identifier}`},
  ];

  return (
    <div className={classes.BowlerList}>
      <Breadcrumbs ladder={ladder} activeText={'Bowlers'}/>
      <div className={'row'}>
        {alertMessage}
        <div className={'col'}>
          <BowlerFilterForm onFilterApplication={filterThatData}/>
          {list}
        </div>
      </div>
    </div>
  );
};

export default bowlerListing;