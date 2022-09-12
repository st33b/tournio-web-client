import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

import {devConsoleLog, directorApiRequest, fetchTournamentDetails, useClientReady} from "../../../../utils";
import {useDirectorContext} from "../../../../store/DirectorContext";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import {Col, Row} from "react-bootstrap";
import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";

const Page = () => {
  const router = useRouter();
  const context = useDirectorContext();
  const directorState = context.directorState;

  const {identifier} = router.query;

  // Ensure we're logged in, with appropriate permission
  useEffect(() => {
    if (!identifier || !context) {
      return;
    }
    if (!context.isLoggedIn) {
      router.push('/director/login');
    }
    if (context.user.role !== 'superuser' && !context.user.tournaments.some(t => t.identifier === identifier)) {
      router.push('/director');
    }
  }, [identifier, router, context]);

  // Ensure that the tournament in context matches the one identified in the URL
  useEffect(() => {
    if (!identifier || !directorState.tournament) {
      return;
    }
    if (directorState.tournament.identifier !== identifier) {
      router.push('/director');
    }
  }, [identifier, directorState.tournament]);

  const ready = useClientReady();
  if (!ready) {
    return '';
  }

  if (!context || !directorState.bowlers) {
    return '';
  }

  return (
    <div className={'container-md'}>
      {
        directorState.bowlers.map((bowler, i) => <SignInSheet tournament={directorState.tournament} bowler={bowler} key={bowler.identifier} showPrintButton={i === 0}/>)
      }
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return page;
}

export default Page;