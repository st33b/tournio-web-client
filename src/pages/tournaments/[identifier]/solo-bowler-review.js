import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {soloBowlerRegistrationCompleted} from "../../../store/actions/registrationActions";
import {submitSoloRegistration, useClientReady} from "../../../utils";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const editBowlerClicked = () => {
    router.push(`/tournaments/${registration.tournament.identifier}/solo-bowler-edit`);
  }

  const soloRegistrationSuccess = (bowler) => {
    dispatch(soloBowlerRegistrationCompleted());
    router.push(`/bowlers/${bowler.identifier}?success=register`);
  }

  const soloRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = () => {
    submitSoloRegistration(registration.tournament,
      registration.bowler,
      soloRegistrationSuccess,
      soloRegistrationFailure);
    setProcessing(true);
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  if (!registration || !registration.tournament || !registration.bowler) {
    return '';
  }

  let errorMessage = '';
  let output = '';
  if (error) {
    errorMessage = (
      <Alert variant={'danger'}>
        <h3 className={'display-6 text-center text-danger'}>Uh oh...</h3>
        <p className={'text-center'}>{error}</p>
      </Alert>
    );
  }
  if (processing) {
    output = <LoadingMessage message={'Submitting registration...'} />;
  } else {
    output = (
      <>
        <ProgressIndicator active={'review'} />
        {errorMessage}
        <ReviewEntries editBowler={editBowlerClicked} context={'solo'} />
      </>
    )
  }

  return (
    <Row>
      <Col>
        <Summary tournament={registration.tournament}
                 nextStepClicked={submitRegistration}
                 nextStepText={'Submit Registration'}
        />
      </Col>
      <Col lg={8}>
        {output}
      </Col>
    </Row>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;