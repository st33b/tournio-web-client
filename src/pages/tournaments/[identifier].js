import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Row} from "react-bootstrap";

import {devConsoleLog, fetchTournamentDetails, useClientReady} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentDetails from "../../components/Registration/TournamentDetails/TournamentDetails";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";

import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";
import {useCommerceContext} from "../../store/CommerceContext";
import {tournamentDetailsRetrieved} from "../../store/actions/registrationActions";
import ErrorBoundary from "../../components/common/ErrorBoundary";

const Page = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const registrationContext = useRegistrationContext();
  const commerceContext = useCommerceContext();
  const [tournament, setTournament] = useState();

  const onFetchSuccess = (data) => {
    devConsoleLog("Success. Dispatching to contexts");
    setTournament(data);
    registrationContext.dispatch(tournamentDetailsRetrieved(data));
    commerceContext.dispatch(tournamentDetailsRetrieved(data));
  }

  const onFetchFailure = (error) => {
    devConsoleLog("Failed to fetch", error);
    // let's clear the tournaments out of context
    router.push('/tournaments');
  }

  // fetch the tournament details and put the tournament into context
  useEffect(() => {
    if (!identifier || !registrationContext || !commerceContext) {
      return;
    }

    const needToFetch = !tournament || tournament.identifier !== identifier;

    const registrationMismatch = registrationContext.registration.tournament && registrationContext.registration.tournament.identifier !== identifier;
    const commerceMismatch = commerceContext.commerce.tournament && commerceContext.commerce.tournament.identifier !== identifier;

    if (!needToFetch) {
      if (registrationMismatch) {
        devConsoleLog("Registration context has the wrong tournament, updating it");
        registrationContext.dispatch(tournamentDetailsRetrieved(tournament));
      }
      if (commerceMismatch) {
        devConsoleLog("Commerce context has the wrong tournament, updating it");
        commerceContext.dispatch(tournamentDetailsRetrieved(tournament));
      }
    }

    devConsoleLog("Need to fetch?", needToFetch);
    if (needToFetch) {
      devConsoleLog("Fetching");
      fetchTournamentDetails(identifier, onFetchSuccess, onFetchFailure);
    }
  }, [identifier, tournament]);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!tournament) {
    return null;
  }

  return (
    <div className={classes.TournamentDetails}>
      <Row>
        <div className={'d-none d-md-block col-md-4'}>
          <TournamentLogo url={tournament.image_url}/>
          <Contacts tournament={tournament}/>
        </div>
        <div className={'col-12 col-md-8'}>
          <ErrorBoundary>
            <TournamentDetails tournament={tournament} />
          </ErrorBoundary>
        </div>
        <div className={'col-12 d-md-none mt-3'}>
          <Contacts tournament={tournament}/>
        </div>
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
