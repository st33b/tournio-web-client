import {useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {newTeamEntryCompleted, teamDetailsRetrieved} from "../../../store/actions/registrationActions";
import {submitNewTeamRegistration} from "../../../utils";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const editBowlerClicked = () => {
    router.push(`/tournaments/${entry.tournament.identifier}/solo-bowler-edit`);
  }

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const soloRegistrationSuccess = (teamData) => {
    dispatch(teamDetailsRetrieved(teamData));
    dispatch(newTeamEntryCompleted());
    router.push(`/teams/${teamData.identifier}?success=solo`);
  }

  const soloRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = () => {
    const newTeam = {...entry.team};
    newTeam.name = 'A Solo Bowler';
    submitNewTeamRegistration(entry.tournament,
      newTeam,
      soloRegistrationSuccess,
      soloRegistrationFailure);
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