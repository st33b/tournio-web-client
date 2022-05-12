import {useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {submitJoinTeamRegistration} from "../../../utils";
import {submitJoinTeamCompleted} from "../../../store/actions/registrationActions";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const editBowlerClicked = () => {
    router.push(`/teams/${entry.team.identifier}/edit-joining-bowler`)
  }

  const joinTeamSuccess = (bowlerIdentifier) => {
    const teamIdentifier = entry.team.identifier;
    dispatch(submitJoinTeamCompleted(bowlerIdentifier));
    router.push(`/teams/${teamIdentifier}?success=join`);
  }

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const joinTeamFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = () => {
    submitJoinTeamRegistration(entry.tournament,
      entry.team,
      entry.team.bowlers.slice(-1).pop(),
      joinTeamSuccess,
      joinTeamFailure);
    setProcessing(true);
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
      <>
        <h3 className={'display-6 text-center pt-2'}>Processing, sit tight...</h3>
      </>
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
        <Summary nextStepClicked={submitRegistration}
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