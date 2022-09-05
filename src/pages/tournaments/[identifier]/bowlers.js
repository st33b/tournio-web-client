import {useEffect, useState} from "react";
import {Alert, Col, Row} from "react-bootstrap";
import {useRouter} from "next/router";

import {fetchBowlerList, useClientReady} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import BowlerListing from "../../../components/Registration/BowlerListing/BowlerListing";
import Contacts from "../../../components/Registration/Contacts/Contacts";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const {registration, dispatch} = useRegistrationContext();
  const { success } = router.query;

  const [loading, setLoading] = useState(false);
  const [bowlers, setBowlers] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onBowlerListRetrieved = (data) => {
    setBowlers(data);
    setLoading(false);
  }

  const onBowlerListFailed = (data) => {
    setLoading(false);
    setBowlers([]);
    setErrorMessage(data.error);
  }

  // fetch the list of bowlers
  useEffect(() => {
    if (!registration || !registration.tournament) {
      return;
    }
    setLoading(true);
    fetchBowlerList({
      tournamentIdentifier: registration.tournament.identifier,
      onSuccess: onBowlerListRetrieved,
      onFailure: onBowlerListFailed,
    });
  }, [dispatch]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving list of bowlers...'}/>
  }

  if (!bowlers || !registration || !registration.tournament) {
    return <LoadingMessage message={'Retrieving list of bowlers...'}/>
  }

  let error = '';
  if (errorMessage) {
    error = (
      <Alert variant={'danger'}>
        <h3 className={'display-6 text-center text-danger'}>Uh oh...</h3>
        <p className={'text-center'}>{error}</p>
      </Alert>
    );
  }

  return (
    <div>
      <Row>
        <Col md={4} className={'d-none d-md-block'}>
          <a href={`/tournaments/${registration.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo url={registration.tournament.image_url}/>
            <h4 className={'text-center py-3'}>{registration.tournament.name}</h4>
          </a>
        </Col>
        <Col>
          {error}
          <BowlerListing caption={'Registered Bowlers'}
                         bowlers={bowlers}
                         enablePayment={true}
                         successType={success}
          />
        </Col>
      </Row>
    </div>
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