import {useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {submitJoinTeamRegistration} from "../../../utils";
import {submitJoinTeamCompleted} from "../../../store/actions/registrationActions";

const page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const editBowlerClicked = (bowler) => {
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
      entry.bowlers[entry.bowlers.length - 1],
      joinTeamSuccess,
      joinTeamFailure);
    setProcessing(true);
  }

  let errorMessage = '';
  let output = '';
  if (error) {
    errorMessage = (
      <Alert variant={'danger'}>
        <h1 className={'display-6 text-center text-danger'}>Well, shit...</h1>
        <p className={'text-center'}>{error}</p>
      </Alert>
    );
  }
  if (processing) {
    output = (
      <>
        <h1 className={'display-6 text-center'}>Processing, sit tight...</h1>
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

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;