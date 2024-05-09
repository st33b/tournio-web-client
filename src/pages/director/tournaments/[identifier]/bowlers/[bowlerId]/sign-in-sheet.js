import React from "react";
import {useRouter} from "next/router";

import {Col, Row} from "react-bootstrap";

import {useBowler, useModernTournament, useTournament} from "../../../../../../director";
import SignInSheet from "../../../../../../components/Director/SignInSheet/SignInSheet";
import {LoginContextProvider} from "../../../../../../store/LoginContext";
import LoadingMessage from "../../../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../../../../components/common/ErrorAlert";
import {devConsoleLog} from "../../../../../../utils";

const Page = () => {
  const router = useRouter();

  const {bowler, loading, error} = useBowler();
  const {tournament, loading: tournamentLoading, error: tournamentError} = useModernTournament();

  if (loading) {
    return <LoadingMessage message={'Retrieving bowler details...'}/>
  }
  if (tournamentLoading) {
    return <LoadingMessage message={'Retrieving tournament details...'}/>
  }

  return (
    <div className={'container-md'}>
      {error && (
        <Row>
          <Col>
            <ErrorAlert message={error}/>
          </Col>
        </Row>
      )}
      {tournamentError && (
        <Row>
          <Col>
            <ErrorAlert message={tournamentError}/>
          </Col>
        </Row>
      )}
      <SignInSheet bowler={bowler}
                   tournament={tournament}
                   showPrintButton={true}/>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <LoginContextProvider>
      {page}
    </LoginContextProvider>
  );
}

export default Page;
