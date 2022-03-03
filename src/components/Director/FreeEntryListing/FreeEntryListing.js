import {useState, useEffect, useMemo} from 'react';
import {useRouter} from "next/router";
import {useTable, useSortBy} from 'react-table';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";

import {useDirectorContext} from "../../../store/DirectorContext";
import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";
import NewFreeEntryForm from "../NewFreeEntryForm/NewFreeEntryForm";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import {apiHost} from "../../../utils";

import classes from './FreeEntryListing.module.scss';

const freeEntryListing = () => {
  const directorContext = useDirectorContext();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const {identifier} = router.query;

  useEffect(() => {
    if (!identifier) {
      return;
    }

    const requestConfig = {
      method: 'get',
      url: `${apiHost}/director/tournaments/${identifier}/free_entries`,
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token,
      },
    }

    axios(requestConfig)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, [identifier]);

  const usedBy = (row, rowIndex) => {
    if (row.bowler === null) {
      return '--'
    }
    return row.bowler.last_name + ', ' + row.bowler.first_name;
  }

  const columns = useMemo(() => [
      {
        Header: ({column}) => <SortableTableHeader text={'Unique Code'} column={column}/>,
        accessor: 'unique_code',
      },
      {
        id: 'used_by',
        Header: ({column}) => <SortableTableHeader text={'Used By'} column={column}/>,
        accessor: usedBy,
      },
      {
        Header: () => <div className={'text-center'}>Confirmed?</div>,
        accessor: 'confirmed',
        disableSortBy: true,
        Cell: ({cell: {value}}) => {
          const classes = value ? ['text-success', 'bi-check-lg'] : ['text-danger', 'bi-x-lg'];
          const text = value ? 'Yes' : 'No';
          return (
            <div className={'text-center'}>
              <i className={classes.join(' ')} aria-hidden={true}/>
              <span className={'visually-hidden'}>{text}</span>
            </div>
          )
        }
      },
      {
        Header: () => <div className={'text-center'}>Actions</div>,
        id: 'actions',
        Cell: ({row}) => {
          let deleteButton = (
            <Button variant={'outline-secondary'}
                    size={'sm'}
                    className={classes.ActionButton}
                    title='Cannot delete a confirmed free entry'
                    disabled={true}>
              Delete
            </Button>
          );
          let confirmButton = '';
          if (!row.values.confirmed) {
            deleteButton = (
              <Button variant={'outline-danger'}
                      size={'sm'}
                      className={classes.ActionButton}
                      title='Delete this free entry'
                      disabled={false}
                      onClick={(event) => props.freeEntryDeleted(row.original, onSuccessfulDeletion)}
              >
                Delete
              </Button>
            );
            if (row.values.used_by !== '--') {
              confirmButton = (
                <Button variant={'outline-success'}
                        size={'sm'}
                        className={classes.ActionButton}
                        title={'Confirm this free entry for the given bowler'}
                        onClick={(event) => props.freeEntryConfirmed(row.original, onSuccessfulConfirmation)}
                >
                  Confirm
                </Button>
              );
            }
          }
          return (
            <div className={'text-center'}>
              {confirmButton}
              {deleteButton}
            </div>
          );
        }
      },
    ],
    [data]
  );

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

  let list = '';
  if (!directorContext.tournament || loading) {
    return (
      <div className={classes.FreeEntryListing}>
        <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
      </div>
    );
  }

  if (data.length === 0) {
    list = (
      <div className={'display-6 text-center'}>
        No free entries to display.
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

  const onSuccessfulDeletion = (freeEntry) => {
    const newData = [...data];
    const index = newData.indexOf(freeEntry);
    newData.splice(index, 1);
    setData(newData);
  }

  const onSuccessfulConfirmation = (freeEntry) => {
    const newData = [...data];
    const index = newData.findIndex((elem) => {
      return elem.unique_code === freeEntry.unique_code
    });
    newData[index] = freeEntry;
    setData(newData);
  }

  const newFreeEntrySubmitted = (freeEntryCode) => {
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': directorContext.token
      },
      url: `${apiHost}/director/tournaments/${identifier}/free_entries`,
      data: {
        free_entry: {
          unique_code: freeEntryCode,
        }
      }
    }
    axios(requestConfig)
      .then(response => {
        setSuccessMessage('Free entry created!');
        const newData = [...data];
        newData.push(response.data);
        setData(newData);
      })
      .catch(error => {
        setErrorMessage('Failed to create a free entry. Why? ' + error);
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

  const newFreeEntry = (
    <Card className={classes.Card}>
      <Card.Header as={'h4'}>
        New Free Entry
      </Card.Header>
      <Card.Body>
        <NewFreeEntryForm submitted={newFreeEntrySubmitted} />
        {success}
        {error}
      </Card.Body>
    </Card>
  );

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
    {text: directorContext.tournament.name, path: `/director/tournaments/${identifier}`}
  ];

  return (
    <div className={classes.FreeEntryListing}>
      <Breadcrumbs ladder={ladder} activeText={'Free Entries'} />
      <div className={'row'}>
        <div className={'order-2 order-md-1 col'}>
          {list}
        </div>
        <div className={'order-1 order-md-2 col-12 col-md-4'}>
          {newFreeEntry}
        </div>
      </div>
    </div>
  );
}

export default freeEntryListing;