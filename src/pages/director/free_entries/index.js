import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import FreeEntryListing from "../../../components/Director/FreeEntryListing/FreeEntryListing";
import {apiHost} from "../../../utils";
import axios from "axios";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import NewFreeEntryForm from "../../../components/Director/NewFreeEntryForm/NewFreeEntryForm";
import {Row, Col, Card} from "react-bootstrap";

const page = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [freeEntries, setFreeEntries] = useState(null);
  const [loading, setLoading] = useState(true);

  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }

  // Ensure we're logged in, with appropriate permission
  useEffect(() => {
    if (!identifier) {
      return;
    }
    if (!directorContext.isLoggedIn) {
      router.push('/director/login');
    }
    if (directorContext.user.role !== 'superuser' && !directorContext.user.tournaments.some(t => t.identifier === identifier)) {
      router.push('/director');
    }
  }, [identifier]);

  // Fetch the free entries from the backend
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
      }
    }
    axios(requestConfig)
      .then(response => {
        setFreeEntries(response.data);
        setLoading(false);
      })
      .catch(error => {
        setErrorMessage(error);
        setLoading(false);
      });
  }, [identifier]);

  // Do we have a success query parameter?
  useEffect(() => {
    const {success} = router.query;
    if (success === 'deleted') {
      setSuccessMessage('The free entry has been deleted.');
    }
  });

  let success = '';
  let error = '';
  if (successMessage) {
    success = (
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mb-3'}
           role={'alert'}>
        <i className={'bi-check-circle-fill pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          <strong>
            Success!
          </strong>
          {' '}{successMessage}
        </div>
        <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"}/>
      </div>
    );
  }
  if (errorMessage) {
    error = (
      <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center mb-3'}
           role={'alert'}>
        <i className={'bi-exclamation-circle-fill pe-2'} aria-hidden={true}/>
        <div className={'me-auto'}>
          <strong>
            Oh no!
          </strong>
          {' '}{errorMessage}
        </div>
        <button type={"button"} className={"btn-close"} data-bs-dismiss={"alert"} aria-label={"Close"}/>
      </div>
    );
  }

  const onDelete = (freeEntry) => {
    const requestConfig = {
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token
      },
      url: `${apiHost}/director/free_entries/${freeEntry.id}`,
    }
    axios(requestConfig)
      .then(response => {
        setSuccessMessage('Free entry deleted!');
        const newFreeEntries = [...freeEntries];
        const index = newFreeEntries.indexOf(freeEntry);
        newFreeEntries.splice(index, 1);
        setFreeEntries(newFreeEntries);
      })
      .catch(error => {
        setErrorMessage('Failed to delete that free entry. Why? ' + error);
      });
  }

  const onConfirm = (freeEntry) => {
    const requestConfig = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Authorization': directorContext.token
      },
      url: `${apiHost}/director/free_entries/${freeEntry.id}/confirm`,
    }
    axios(requestConfig)
      .then(response => {
        setSuccessMessage('Free entry confirmed!');
        const newFreeEntries = freeEntries.splice(0);
        const index = newFreeEntries.indexOf(freeEntry);
        newFreeEntries[index].confirmed = true;
        setFreeEntries(newFreeEntries);
      })
      .catch(error => {
        setErrorMessage('Failed to delete that free entry. Why? ' + error);
      });
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
        const newFreeEntries = [...freeEntries];
        newFreeEntries.push(response.data);
        setFreeEntries(newFreeEntries);
      })
      .catch(error => {
        setErrorMessage('Failed to create a free entry. Why? ' + error);
      });
  }

  const newFreeEntry = (
    <Card className={'mb-3'}>
      <Card.Header as={'h5'} className={'fw-light'}>
        New Free Entry
      </Card.Header>
      <Card.Body>
        <NewFreeEntryForm submitted={newFreeEntrySubmitted}/>
      </Card.Body>
    </Card>
  );

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
  ];
  if (directorContext.tournament) {
    ladder.push({text: directorContext.tournament.name, path: `/director/tournaments/${identifier}`});
  }

  if (loading) {
    return (
      <div>
        <h3 className={'display-6 text-center pt-2'}>Loading, sit tight...</h3>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={'Free Entries'}/>
      <Row>
        <Col md={8}>
          {success}
          {error}
          <FreeEntryListing freeEntries={freeEntries}
                            confirmClicked={onConfirm}
                            deleteClicked={onDelete}
          />
        </Col>
        <Col md={4}>
          {newFreeEntry}
        </Col>
      </Row>
    </div>
  );

}

page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default page;