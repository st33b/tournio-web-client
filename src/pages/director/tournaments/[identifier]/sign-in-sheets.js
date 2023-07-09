import React from "react";
import {useRouter} from "next/router";

import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";
import {useDirectorApi} from "../../../../director";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../../components/common/ErrorBoundary";
import {LoginContextProvider} from "../../../../store/LoginContext";

const Page = () => {
  const router = useRouter();
  const {identifier} = router.query;

  const {loading, data: bowlers} = useDirectorApi( {
    uri: identifier ? `/tournaments/${identifier}/bowlers?include_details=true` : null,
  });

  if (loading) {
    return <LoadingMessage message={'Retrieving bowler data...'} />
  }

  return (
    <div className={'container-md'}>
      <ErrorBoundary>
        {
          bowlers && bowlers.map((bowler, i) => <SignInSheet bowler={bowler} key={bowler.identifier} showPrintButton={i === 0}/>)
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
