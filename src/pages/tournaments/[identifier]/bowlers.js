import {useEffect, useState} from "react";
import {Alert, Col, Row} from "react-bootstrap";
import {useRouter} from "next/router";

import {devConsoleLog, fetchBowlerList, fetchTournamentDetails, useClientReady} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import BowlerListing from "../../../components/Registration/BowlerListing/BowlerListing";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {tournamentDetailsRetrieved} from "../../../store/actions/registrationActions";
import BowlerList from "../../../components/Registration/BowlerList/BowlerList";

const Page = () => {
  const router = useRouter();
  const {registration, dispatch} = useRegistrationContext();
  const { identifier, success } = router.query;

  const [loading, setLoading] = useState(false);
  const [bowlers, setBowlers] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onBowlerListRetrieved = (data) => {
    const bowlerComparison = (left, right) => {
      return left.name.toLocaleLowerCase().localeCompare(right.name.toLocaleLowerCase());
    }
    setBowlers(data.sort(bowlerComparison)); // sort this!
    setLoading(false);
  }

  const onBowlerListFailed = (data) => {
    setLoading(false);
    setBowlers([]);
    setErrorMessage(data.error);
  }

  const onTournamentFetchSuccess = (data) => {
    devConsoleLog("Dispatching tournament details retrieved");
    dispatch(tournamentDetailsRetrieved(data));
  }

  // fetch the list of bowlers
  useEffect(() => {
    if (!registration || !identifier) {
      return;
    }
    const tournamentIdentifier = identifier;
    if (!registration.tournament || registration.tournament.identifier !== tournamentIdentifier) {
      devConsoleLog("Need to fetch the identified tournament");
      fetchTournamentDetails(
        tournamentIdentifier,
        onTournamentFetchSuccess,
        (data) => { console.log("Failed to load tournament", data)}
      );
      setLoading(true);
      return;
    }
    setLoading(true);
    fetchBowlerList({
      tournamentIdentifier: tournamentIdentifier,
      onSuccess: onBowlerListRetrieved,
      onFailure: onBowlerListFailed,
    });
  }, [identifier, registration]);

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
          <BowlerList bowlers={bowlers}
                      caption={'Tournament Bowlers'}
                      includeMenuLink={true} />
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
