import {useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {submitNewTeamRegistration} from "../../../utils";
import {useTournamentContext} from "../../../store/TournamentContext";
import {teamDetailsRetrieved, tournamentDetailsRetrieved} from "../../../store/actions/tournamentActions";
import {newTeamEntryCompleted} from "../../../store/actions/registrationActions";


const page = () => {
  const registrationContext = useRegistrationContext();
  const tournamentContext = useTournamentContext();
  const router = useRouter();

  const editBowlerClicked = (bowler) => {
    router.push(`/tournaments/${registrationContext.entry.tournament.identifier}/edit-new-team-bowler?bowler=${bowler.position}`)
  }

  const newTeamRegistrationSuccess = (teamData) => {
    tournamentContext.dispatch(tournamentDetailsRetrieved(registrationContext.entry.tournament));
    tournamentContext.dispatch(teamDetailsRetrieved(teamData));
    registrationContext.dispatch(newTeamEntryCompleted());
    router.push(`/teams/${teamData.identifier}`);
  }

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const newTeamRegistrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = () => {
    submitNewTeamRegistration(registrationContext.entry.tournament,
      registrationContext.entry.teamName,
      registrationContext.entry.bowlers,
      newTeamRegistrationSuccess,
      newTeamRegistrationFailure);
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
        <ProgressIndicator active={'review'} />
        <h1 className={'display-6 text-center'}>Processing, sit tight...</h1>
      </>
    )
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