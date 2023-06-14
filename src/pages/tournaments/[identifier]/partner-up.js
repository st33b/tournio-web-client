import {useEffect, useState} from "react";
import {Alert, Col, Row} from "react-bootstrap";

import {fetchBowlerList} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import BowlerList from "../../../components/Registration/BowlerList/BowlerList";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();

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
    if (!registration || !registration.tournament) {
      return;
    }
    setLoading(true);
    fetchBowlerList({
      tournamentIdentifier: registration.tournament.identifier,
      onSuccess: onBowlerListRetrieved,
      onFailure: onBowlerListFailed,
      unpartneredOnly: true,
    });
  }, [dispatch]);

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
      <div className={`row`}>
        <div className={'col-4 d-md-none'}>
          <TournamentLogo url={registration.tournament.image_url}/>
        </div>
        <div className={`col-8 d-md-none d-flex flex-column justify-content-around`}>
          <h4 className={'text-start'}>
            <a href={`/tournaments/${registration.tournament.identifier}`} title={'To tournament page'}>
              {registration.tournament.name}
            </a>
          </h4>
          <h5 className={`m-0`}>
            Registered Bowlers
          </h5>
        </div>
        <div className={'col-4 d-none d-md-block'}>
          <a href={`/tournaments/${registration.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo url={registration.tournament.image_url}/>
            <h4 className={'text-center py-3'}>{registration.tournament.name}</h4>
          </a>
        </div>
        <div className={`col`}>
          <h5 className={`d-none d-md-block`}>
            Registered Bowlers
          </h5>
          {error}
          <BowlerList tournament={registration.tournament}
                      bowlers={bowlers}
                      action={'partnerUp'}
          />
        </div>
      </div>
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
