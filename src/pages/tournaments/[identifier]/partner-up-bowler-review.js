import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Alert, Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";
import {partnerUpRegistrationCompleted} from "../../../store/actions/registrationActions";
import {submitPartnerRegistration} from "../../../utils";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [bowler, setBowler] = useState();
  const [partner, setPartner] = useState();
  const [tournament, setTournament] = useState();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!entry || !entry.tournament || !entry.bowler) {
      return;
    }
    setTournament(entry.tournament);
    setBowler(entry.bowler);
    setPartner(entry.partner);
  }, [entry]);

  if (!tournament || !bowler) {
    return '';
  }

  const editBowlerClicked = () => {
    router.push(`/tournaments/${tournament.identifier}/partner-up-bowler-edit`);
  }

  const registrationSuccess = (newBowler) => {
    dispatch(partnerUpRegistrationCompleted());
    router.push(`/bowlers/${newBowler.identifier}?success=register`);
  }

  const registrationFailure = (errorMessage) => {
    setProcessing(false);
    setError(errorMessage);
  }

  const submitRegistration = () => {
    submitPartnerRegistration(tournament,
      bowler,
      partner,
      registrationSuccess,
      registrationFailure);
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
        <ReviewEntries editBowler={editBowlerClicked} context={'partner'} />
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