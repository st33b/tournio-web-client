import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {soloBowlerRegistrationCompleted} from "../../../store/actions/registrationActions";
import {submitSoloRegistration} from "../../../utils";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [bowlers, setBowlers] = useState();
  const [tournament, setTournament] = useState();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!entry || !entry.tournament || !entry.bowlers) {
      return;
    }
    setTournament(entry.tournament);
    setBowlers(entry.bowlers);
  }, [entry]);

  if (!tournament || !bowlers) {
    return '';
  }

  const editBowlerClicked = (bowler, index) => {
    router.push(`/tournaments/${tournament.identifier}/pair-bowler-edit?index=${index}`);
  }

  const registrationSuccess = (bowlerIdentifier) => {
    // dispatch(soloBowlerRegistrationCompleted());
    router.push(`/tournaments/${tournament.identifier}/bowlers?success=register`);
  }

  const registrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = () => {
    // submitSoloRegistration(tournament,
    //   bowler,
    //   soloRegistrationSuccess,
    //   soloRegistrationFailure);
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
        <ReviewEntries editBowler={editBowlerClicked} context={'doubles'} />
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