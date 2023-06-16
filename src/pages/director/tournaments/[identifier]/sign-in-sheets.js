import React from "react";
import {useRouter} from "next/router";

import SignInSheet from "../../../../components/Director/SignInSheet/SignInSheet";
import {useDirectorApi} from "../../../../director";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorBoundary from "../../../../components/common/ErrorBoundary";
import {useLoginContext} from "../../../../store/LoginContext";

const Page = () => {
  const router = useRouter();
  const {ready} = useLoginContext();

  const {identifier} = router.query;

  const {loading, data: bowlers, error} = useDirectorApi({
    uri: identifier ? `/tournaments/${identifier}/bowlers?include_details=true` : null,
    onSuccess: (t) => {},
    onFailure: (err) => {},
  });

  // Are we ready?
  if (!ready) {
    return '';
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving bowler data...'} />
  }

  return (
    <div className={'container-md'}>
      <ErrorBoundary>
        {
          bowlers.map((bowler, i) => <SignInSheet bowler={bowler} key={bowler.identifier} showPrintButton={i === 0}/>)
        }
      </ErrorBoundary>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return page;
}

export default Page;
