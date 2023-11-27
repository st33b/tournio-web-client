import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {newPairRegistrationCompleted} from "../../../store/actions/registrationActions";
import {submitDoublesRegistration, useTournament} from "../../../utils";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();
  const {identifier} = router.query;

  const [bowlers, setBowlers] = useState();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const {loading: tournamentLoading, tournament, error: tournamentError} = useTournament(identifier);

  useEffect(() => {
    if (!registration || !registration.bowlers) {
      return;
    }
    setBowlers(registration.bowlers);
  }, [registration]);

  if (!bowlers) {
    return '';
  }

  const editBowlerClicked = (bowler, index) => {
    router.push(`/tournaments/${tournament.identifier}/pair-bowler-edit?index=${index}`);
  }

  const registrationSuccess = (bowlerIdentifier) => {
    dispatch(newPairRegistrationCompleted());
    router.push(`/tournaments/${tournament.identifier}/bowlers?success=new_pair`);
  }

  const registrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = () => {
    submitDoublesRegistration(tournament,
      bowlers,
      registrationSuccess,
      registrationFailure);
    setProcessing(true);
  }

  if (tournamentLoading) {
    return <LoadingMessage message={'Getting things ready...'}/>;
  }

  if (!tournament) {
    return <ErrorAlert message={'Failed to load tournament'}/>;
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
        <Summary tournament={tournament}
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
