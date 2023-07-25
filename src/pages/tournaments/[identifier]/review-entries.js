import {useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {submitNewTeamRegistration, useClientReady} from "../../../utils";
import {newTeamEntryCompleted} from "../../../store/actions/registrationActions";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const editBowlerClicked = (bowlerIndex) => {
    router.push(`/tournaments/${registration.tournament.identifier}/edit-new-team-bowler?bowler=${bowlerIndex+1}`)
  }

  const newTeamRegistrationSuccess = (teamData) => {
    dispatch(newTeamEntryCompleted());
    router.push(`/teams/${teamData.identifier}?success=new_team`);
  }

  const newTeamRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = (event) => {
    event.preventDefault();

    if (event.target.elements) {
      // got a partial team with a checkbox in a form
      registration.team.placeWithOthers = event.target.elements.placeWithOthers.checked;
    }

    submitNewTeamRegistration(registration.tournament,
      registration.team,
      newTeamRegistrationSuccess,
      newTeamRegistrationFailure);
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
        <h1 className={'display-6 text-center text-danger'}>Well, that was unexpected...</h1>
        <p className={'text-center'}>{error}</p>
      </Alert>
    );
  }
  if (processing) {
    output = <LoadingMessage message={'Submitting registration...'} />;
  } else {
    output = (
      <div className={'border-bottom mb-3 mb-sm-0'}>
        <ProgressIndicator active={'review'} />
        {errorMessage}
        <ReviewEntries editBowler={editBowlerClicked} />
      </div>
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
                 enableDoublesEdit={true}
                 finalStep={true}
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
