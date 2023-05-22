import {useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {submitJoinTeamRegistration, useClientReady} from "../../../utils";
import {submitJoinTeamCompleted} from "../../../store/actions/registrationActions";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const editBowlerClicked = () => {
    router.push(`/teams/${registration.team.identifier}/edit-joining-bowler`)
  }

  const joinTeamSuccess = (bowlerIdentifier) => {
    const teamIdentifier = registration.team.identifier;
    dispatch(submitJoinTeamCompleted(bowlerIdentifier));
    router.push(`/teams/${teamIdentifier}?success=join`);
  }

  const joinTeamFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = () => {
    submitJoinTeamRegistration(registration.tournament,
      registration.team,
      registration.team.bowlers.slice(-1).pop(),
      joinTeamSuccess,
      joinTeamFailure);
    setProcessing(true);
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration) {
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
    output = (
      <h3 className={'display-6 text-center pt-2'}>Processing, sit tight...</h3>
    )
  } else {
    output = (
      <>
        {errorMessage}
        <ReviewEntries editBowler={editBowlerClicked} context={'join'} />
      </>
    )
  }

  return (
    <Row>
      <Col lg={8}>
        {output}
      </Col>
      <Col>
        <Summary tournament={registration.tournament}
                 nextStepClicked={submitRegistration}
                 nextStepText={'Submit Registration'}
        />
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
