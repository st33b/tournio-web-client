import {useRouter} from "next/router";
import {useEffect, useState, useMemo} from "react";
import axios from "axios";
import {useFilters, useSortBy, useTable} from "react-table";
import {Card} from "react-bootstrap";

import {apiHost, lessThan} from "../../../utils";
import {useDirectorContext} from "../../../store/DirectorContext";
import TeamFilterForm from "../TeamFilterForm/TeamFilterForm";
import NewTeamForm from "../NewTeamForm/NewTeamForm";
import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

import classes from './TeamListing.module.scss';

const teamListing = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  const {identifier} = router.query;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!identifier) {
      return;
    }

    const requestConfig = {
      method: 'get',
      url: `${apiHost}/director/tournaments/${identifier}/teams`,
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
        setErrorMessage(error);
        setLoading(false);
      });
  }, [identifier]);

  const columns = useMemo(() => [
      {
        Header: ({column}) => <SortableTableHeader text={'Team Name'} column={column}/>,
        accessor: 'name',
        Cell: ({row, value}) => (
          <a href={`/director/tournaments/${identifier}/teams/${row.original.identifier}`}>
            {value}
          </a>
        )
      },
      {
        Header: ({column}) => <SortableTableHeader text={'Initially Created'} column={column}/>,
        accessor: 'date_registered',
      },
      {
        Header: 'Size',
        accessor: 'size',
        disableSortBy: true,
        filter: lessThan,
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
    setAllFilters,
  } = useTable(
    {columns, data},
    useFilters,
    useSortBy,
  );

  if (!directorContext.tournament || loading) {
    return (
      <div className={classes.TeamListing}>
        <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
      </div>
    );
  }

  let list = '';
  if (data.length === 0) {
    list = (
      <div className={'display-6 text-center'}>
        No teams to display.
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
    if (criteria.incomplete) {
      setFilter('size', 4);
    } else {
      setAllFilters([]);
    }
  }

  const newTeamSubmitted = (teamName) => {
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': directorContext.token
      },
      url: `${apiHost}/director/tournaments/${identifier}/teams`,
      data: {
        team: {
          name: teamName,
        }
      }
    }
    axios(requestConfig)
      .then(response => {
        setSuccessMessage('New team created!');
        const newData = [...data];
        newData.push(response.data);
        setData(newData);
      })
      .catch(error => {
        setErrorMessage('Failed to create a new team. Why? ' + error);
      });
  }

  let success = '';
  let error = '';
  if (successMessage) {
    success = (
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-check-circle-fill pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          <strong>
            Success!
          </strong>
          {' '}{successMessage}
        </div>
      </div>
    );
  }
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          <strong>
            Oh no!
          </strong>
          {' '}{errorMessage}
        </div>
      </div>
    );
  }

  const newTeam = (
    <Card className={classes.Card}>
      <Card.Header as={'h4'}>
        New Team
      </Card.Header>
      <Card.Body>
        <NewTeamForm submitted={newTeamSubmitted} />
        {success}
        {error}
      </Card.Body>
    </Card>
  );

  const ladder = [{text: 'Tournaments', path: '/director/tournaments'}];
  if (directorContext.tournament) {
    ladder.push({text: directorContext.tournament.name, path: `/director/tournaments/${identifier}`});
  }

  return (
    <div className={classes.TeamListing}>
      <Breadcrumbs ladder={ladder} activeText={'Teams'}/>
      <div className={'row'}>
        <div className={'order-2 order-md-1 col'}>
          <TeamFilterForm onFilterApplication={filterThatData}/>
          {list}
        </div>
        <div className={'order-1 order-md-2 col-12 col-md-4'}>
          {newTeam}
        </div>
      </div>
    </div>
  );
}

export default teamListing;