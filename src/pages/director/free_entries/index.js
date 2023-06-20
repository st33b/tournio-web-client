import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Row, Col, Card} from "react-bootstrap";

import {devConsoleLog} from "../../../utils";
import {directorApiRequest, useDirectorApi, useLoggedIn} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";
import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import FreeEntryListing from "../../../components/Director/FreeEntryListing/FreeEntryListing";
import Breadcrumbs from "../../../components/Director/Breadcrumbs/Breadcrumbs";
import NewFreeEntryForm from "../../../components/Director/NewFreeEntryForm/NewFreeEntryForm";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {
  freeEntryAdded,
  freeEntryDeleted,
} from "../../../store/actions/directorActions";
import SuccessAlert from "../../../components/common/SuccessAlert";
import {useLoginContext} from "../../../store/LoginContext";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const router = useRouter();
  const {state, dispatch} = useDirectorContext();
  const {authToken} = useLoginContext();
  const {success} = router.query;

  const {loading, data: freeEntries, error, onDataUpdate} = useDirectorApi({
    uri: state.tournament ? `/tournaments/${state.tournament.identifier}/free_entries` : null,
    initialData: [],
    },
  );

  const deleteFreeEntrySuccess = (data, freeEntry) => {
    dispatch(freeEntryDeleted(freeEntry));
    onDataUpdate(freeEntries.filter(({identifier}) => freeEntry.identifier !== identifier));
    router.replace(`${router.pathname}?success=deleted`, null, { shallow: true });
  }

  const onDelete = (freeEntry) => {
    const uri = `/free_entries/${freeEntry.identifier}`;
    const requestConfig = {
      method: 'delete',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => deleteFreeEntrySuccess(data, freeEntry),
    });
  }

  const confirmFreeEntrySuccess = (data) => {
    const index = freeEntries.findIndex(t => t.identifier === data.identifier);
    const newFreeEntries = [...freeEntries];
    newFreeEntries[index] = {...freeEntries[index]};
    newFreeEntries[index].confirmed = true;

    router.replace(`${router.pathname}?success=confirm`, null, { shallow: true });
    onDataUpdate(newFreeEntries);
  }

  const onConfirm = (freeEntry) => {
    const uri = `/free_entries/${freeEntry.identifier}`;
    const requestConfig = {
      method: 'patch',
      data: {
        confirm: true,
        bowler_identifier: freeEntry.bowler.identifier,
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => confirmFreeEntrySuccess(data),
    });
  }

  const denyFreeEntrySuccess = (freeEntry) => {
    const index = freeEntries.findIndex(t => t.identifier === freeEntry.identifier);
    const newFreeEntries = [...freeEntries];
    newFreeEntries[index] = {...freeEntries[index]};
    newFreeEntries[index].confirmed = true;

    router.replace(`${router.pathname}?success=denied`, null, { shallow: true });
    onDataUpdate(newFreeEntries);
  }
  const onDeny = (freeEntry) => {
    const uri = `/free_entries/${freeEntry.identifier}`;
    const requestConfig = {
      method: 'patch',
      data: {
        bowler_identifier: null,
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => denyFreeEntrySuccess(data),
    });
  }

  const newFreeEntrySuccess = (data) => {
    dispatch(freeEntryAdded(data));
    const newFreeEntries = freeEntries.concat(data);
    router.replace(`${router.pathname}?success=create`, null, { shallow: true });
    onDataUpdate(newFreeEntries);
  }

  const newFreeEntrySubmitted = (freeEntryCode) => {
    const uri = `/tournaments/${state.tournament.identifier}/free_entries`;
    const requestConfig = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        free_entry: {
          unique_code: freeEntryCode,
        }
      }
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: newFreeEntrySuccess,
    });
  }

  if (!state.tournament || loading) {
    return <LoadingMessage message={'Retrieving free entry data...'} />;
  }

  const successMessages = {
    create: 'Free entry created',
    confirm: 'Free entry confirmed',
    denied: 'Free entry denied',
    deleted: 'Free entry deleted',
  }

  const ladder = [
    {text: 'Tournaments', path: '/director/tournaments'},
  ];
  ladder.push({text: state.tournament.name, path: `/director/tournaments/${state.tournament.identifier}`});

  return (
    <div>
      <Breadcrumbs ladder={ladder} activeText={'Free Entries'}/>
      <Row>
        <Col md={8}>
          {success && successMessages[success] && (
            <SuccessAlert message={successMessages[success]}
                          onClose={() =>router.replace(router.pathname, null, {shallow: true})}/>
          )}
          {error &&
            <ErrorAlert message={error.message} className={'mx-3 mt-3'}/>
          }
          <FreeEntryListing freeEntries={freeEntries}
                            confirmClicked={onConfirm}
                            deleteClicked={onDelete}
                            denyClicked={onDeny}
          />
        </Col>
        <Col md={4}>
          <Card className={'mb-3'}>
            <Card.Header as={'h5'} className={'fw-light'}>
              New Free Entry Code
            </Card.Header>
            <Card.Body>
              <NewFreeEntryForm submitted={newFreeEntrySubmitted}/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Page;
