import {useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {submitNewTeamRegistration} from "../../../utils";
import {teamDetailsRetrieved, newTeamEntryCompleted} from "../../../store/actions/registrationActions";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const editBowlerClicked = (bowler) => {
    router.push(`/tournaments/${entry.tournament.identifier}/edit-new-team-bowler?bowler=${bowler.position}`)
  }

  const newTeamRegistrationSuccess = (teamData) => {
    dispatch(teamDetailsRetrieved(teamData));
    dispatch(newTeamEntryCompleted());
    router.push(`/teams/${teamData.identifier}?success=new_team`);
  }

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const newTeamRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = (event) => {
    event.preventDefault();

    if (event.target.elements) {
      // got a partial team with a checkbox in a form
      entry.team.placeWithOthers = event.target.elements.placeWithOthers.checked;
    }

    submitNewTeamRegistration(entry.tournament,
      entry.team,
      newTeamRegistrationSuccess,
      newTeamRegistrationFailure);
    setProcessing(true);
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
      <>
        <ProgressIndicator active={'review'} />
        {errorMessage}
        <ReviewEntries editBowler={editBowlerClicked} />
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