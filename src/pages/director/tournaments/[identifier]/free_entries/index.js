import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Card, Col, Row} from "react-bootstrap";

import {directorApiRequest, useDirectorApi, useTournament} from "../../../../../director";
import DirectorLayout from "../../../../../components/Layout/DirectorLayout/DirectorLayout";
import FreeEntryListing from "../../../../../components/Director/FreeEntryListing/FreeEntryListing";
import Breadcrumbs from "../../../../../components/Director/Breadcrumbs/Breadcrumbs";
import LoadingMessage from "../../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../../../components/common/ErrorBoundary";
import SuccessAlert from "../../../../../components/common/SuccessAlert";
import ErrorAlert from "../../../../../components/common/ErrorAlert";
import NewFreeEntryForm from "../../../../../components/Director/NewFreeEntryForm/NewFreeEntryForm";
import {updateObject} from "../../../../../utils";
import {useLoginContext} from "../../../../../store/LoginContext";

const FreeEntriesIndex = () => {
  const {authToken} = useLoginContext();
  const router = useRouter();
  const {identifier, success} = router.query;
  const [currentPath, setCurrentPath] = useState();

  const {loading: tournamentLoading, tournament, tournamentUpdatedQuietly} = useTournament();
  const {loading: freeEntriesLoading, data: freeEntries, error, onDataUpdate: freeEntriesUpdated} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/free_entries` : null,
    initialData: [],
  });

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setCurrentPath({
      pathname: router.pathname,
      query: { identifier: identifier },
    });
  }, [router.isReady]);

  const successPathFor = (successType) => {
    return {
      ...currentPath,
      query: {
        ...currentPath.query,
        success: successType,
      }
    }
  }

  const deleteFreeEntrySuccess = (freeEntry) => {
    const remainingFreeEntries = freeEntries.filter(({identifier}) => identifier !== freeEntry.identifier);

    const modifiedTournament = updateObject(tournament, {
      free_entry_count: tournament.free_entry_count - 1,
    });
    router.replace(successPathFor('deleted'), null, { shallow: true });
    freeEntriesUpdated(remainingFreeEntries);
    tournamentUpdatedQuietly(modifiedTournament);
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
      onSuccess: () => deleteFreeEntrySuccess(freeEntry),
    });
  }

  const confirmFreeEntrySuccess = (data) => {
    const index = freeEntries.findIndex(t => t.identifier === data.identifier);
    const newFreeEntries = [...freeEntries];
    newFreeEntries[index] = {...freeEntries[index]};
    newFreeEntries[index].confirmed = true;

    freeEntriesUpdated(newFreeEntries);

    router.replace(successPathFor(`confirm`), null, { shallow: true });
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
    newFreeEntries[index].bowler = null;

    freeEntriesUpdated(newFreeEntries);

    router.replace(successPathFor('denied'), null, { shallow: true });
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
    const newFreeEntries = freeEntries.concat(data);
    freeEntriesUpdated(newFreeEntries);
    router.replace(successPathFor('create'), null, { shallow: true });
  }

  const newFreeEntrySubmitted = (freeEntryCode) => {
    const uri = `/tournaments/${identifier}/free_entries`;
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
  ////////////////////

  if (tournamentLoading || freeEntriesLoading) {
    return <LoadingMessage message={'Retrieving free entry data...'} />
  }

  if (!tournament || !freeEntries) {
    return <LoadingMessage message={'Making sense of free entry data...'} />
  }

  const successMessages = {
    create: 'Free entry created',
    confirm: 'Free entry confirmed',
    denied: 'Free entry denied',
    deleted: 'Free entry deleted',
  }

  const ladder = [{text: 'Tournaments', path: '/director'}];
  ladder.push({text: tournament.name, path: `/director/tournaments/${identifier}`});

  return (
    <ErrorBoundary>
      <Breadcrumbs ladder={ladder} activeText={'Free Entries'}/>
      <Row>
        <Col>
          {success && successMessages[success] && (
            <SuccessAlert message={successMessages[success]}
                          onClose={() => router.replace(currentPath, null, {shallow: true})}/>
          )}
          {error && (
            <ErrorAlert message={error.message} className={'mx-3 mt-3'}/>
          )}
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
    </ErrorBoundary>
  );
}

FreeEntriesIndex.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default FreeEntriesIndex;
