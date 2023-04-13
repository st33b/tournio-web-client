import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";
import {useDirectorContext} from "../../../../store/DirectorContext";
import {directorApiRequest, useLoggedIn} from "../../../../director";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../../components/common/ErrorBoundary";
import ReactPDF from "@react-pdf/renderer";
import SignInSheetPdf from "../../../../components/Director/SignInSheetPdf";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const directorState = context.directorState;

  const {identifier} = router.query;

  const [loading, setLoading] = useState(false);
  const [bowlers, setBowlers] = useState();

  // Make sure we're logged in
  const loggedInState = useLoggedIn();
  if (!loggedInState) {
    router.push('/director/login');
  }

  // Ensure we're logged in with appropriate permission
  useEffect(() => {
    if (!identifier || !directorState.user) {
      return;
    }
    if (directorState.user.role !== 'superuser' && !directorState.user.tournaments.some(t => t.identifier === identifier)) {
      router.push('/director');
    }
  }, [identifier, router, directorState.user]);

  // Ensure that the tournament in context matches the one identified in the URL
  useEffect(() => {
    if (!identifier || !directorState.tournament) {
      return;
    }
    if (directorState.tournament.identifier !== identifier) {
      router.push('/director');
    }
  }, [identifier, directorState.tournament]);

  const onFetchBowlersSuccess = (data) => {
    setBowlers(data);
    setLoading(false);
  }

  const onFetchBowlersFailure = (data) => {
    setLoading(false);
    setBowlers([]);
  }

  // Fetch the bowlers from the backend
  useEffect(() => {
    if (!identifier) {
      return;
    }
    const uri = `/director/tournaments/${identifier}/bowlers?include_details=true`;
    const requestConfig = {
      method: 'get',
    }
    setLoading(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: onFetchBowlersSuccess,
      onFailure: onFetchBowlersFailure,
    })
  }, [identifier]);

  // Are we ready?
  const ready = loggedInState >= 0;
  if (!ready || !directorState.bowlers) {
    return '';
  }

  if (loading || !bowlers) {
    return <LoadingMessage message={'Retrieving bowler data...'} />
  }

  return (
    ReactPDF.render(<SignInSheetPdf tournament={t} />)
  );
}

Page.getLayout = function getLayout(page) {
  return page;
}

export default Page;
