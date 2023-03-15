import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import {devConsoleLog, fetchTournamentDetails, useClientReady} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";

import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";
import {useCommerceContext} from "../../store/CommerceContext";
import {tournamentDetailsRetrieved} from "../../store/actions/registrationActions";
import Heading from "../../components/Registration/TournamentDetails/Heading";
import Details from "../../components/Registration/TournamentDetails/Details";
import RegisterButtons from "../../components/Registration/TournamentDetails/RegisterButtons";
import PayButton from "../../components/Registration/TournamentDetails/PayButton";
import Shifts from "../../components/Registration/TournamentDetails/Shifts";
import YouWillNeed from "../../components/Registration/TournamentDetails/YouWillNeed";
import StateBanners from "../../components/Registration/TournamentDetails/StateBanners";

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
        <Col xs={12}>
          <StateBanners tournament={tournament}/>
        </Col>
      </Row>
      <Row>
        <Col xs={{order: 2}} md={{span: 4, order: 1}}>
          <div className={'d-none d-md-flex justify-content-center'}>
            <TournamentLogo url={tournament.image_url}/>
          </div>
          <Contacts tournament={tournament}/>
        </Col>
        <Col xs={{order: 1}} md={{span: 8, order: 2}}>
          <Heading tournament={tournament}/>
          <div className={'d-flex'}>
            <div className={'flex-fill w-100'}>
              <Details tournament={tournament}/>
            </div>
            <div className={'d-none d-xl-block flex-shrink-1'}>
              <YouWillNeed tournament={tournament}/>
            </div>
          </div>
          <PayButton />
          <RegisterButtons tournament={tournament}/>
          <div className={'d-xl-none mb-4'}>
            <YouWillNeed tournament={tournament}/>
          </div>
          <div className={''}>
            <Shifts tournament={tournament}/>
          </div>
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
