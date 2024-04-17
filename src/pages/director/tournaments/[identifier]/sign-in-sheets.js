import React from "react";

import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";
import {useModernTournament, useBowlers} from "../../../../director";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../../components/common/ErrorBoundary";
import {LoginContextProvider} from "../../../../store/LoginContext";

const Page = () => {
  const {loading, bowlers} = useBowlers();
  const {loading: tournamentLoading, tournament} = useModernTournament();

  if (tournamentLoading) {
    return <LoadingMessage message={'Retrieving the tournament, one moment please...'} />
  }
  if (loading) {
    return <LoadingMessage message={'Retrieving all the bowlers, one moment please...'} />
  }

  return (
    <div className={'container-md'}>
      <ErrorBoundary>
        {
          bowlers && bowlers.map((bowler, i) => <SignInSheet
            tournament={tournament}
            bowler={bowler}
            key={bowler.identifier}
            showPrintButton={i === 0}/>)
        }
      </ErrorBoundary>
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
