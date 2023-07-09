import React from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {useDirectorApi} from "../../../../../../director";
import SignInSheet from "../../../../../../components/Director/SignInSheet/SignInSheet";
import {LoginContextProvider} from "../../../../../../store/LoginContext";
import LoadingMessage from "../../../../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../../../../components/common/ErrorAlert";

const Page = () => {
  const router = useRouter();
  let {bowlerId} = router.query;

  const {loading, data: bowler, error} = useDirectorApi({
    uri: bowlerId ? `/bowlers/${bowlerId}` : null,
  });

  if (loading || !bowler) {
    return <LoadingMessage message={'Retrieving bowler details...'}/>
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
      <SignInSheet bowler={bowler}
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
