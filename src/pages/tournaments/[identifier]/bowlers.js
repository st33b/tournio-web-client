import {useEffect, useState} from "react";
import {Alert, Col, Row} from "react-bootstrap";

import {fetchBowlerList} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import BowlerListing from "../../../components/Registration/BowlerListing/BowlerListing";
import Contacts from "../../../components/Registration/Contacts/Contacts";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();

  const [loading, setLoading] = useState(false);
  const [bowlers, setBowlers] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onBowlerListRetrieved = (data) => {
    setBowlers(data);
    setLoading(false);
  }

  const onBowlerListFailed = (data) => {
    setLoading(false);
    setErrorMessage(data.error);
  }

  // fetch the list of bowlers
  useEffect(() => {
    if (!entry || !entry.tournament) {
      return;
    }
    setLoading(true);
    fetchBowlerList({
      tournamentIdentifier: entry.tournament.identifier,
      onSuccess: onBowlerListRetrieved,
      onFailure: onBowlerListFailed,
    });
  }, [dispatch]);

  if (loading) {
    return <LoadingMessage message={'Retrieving list of bowlers...'}/>
  }

  if (!bowlers || !entry || !entry.tournament) {
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
          <a href={`/tournaments/${entry.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo tournament={entry.tournament}/>
            <h4 className={'text-center py-3'}>{entry.tournament.name}</h4>
          </a>
          <Contacts tournament={entry.tournament}/>
        </Col>
        <Col>
          {error}
          <BowlerListing caption={'Registered Bowlers'} bowlers={bowlers} enablePayment={true}/>
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