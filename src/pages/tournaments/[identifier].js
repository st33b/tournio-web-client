import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import {devConsoleLog, fetchTournamentDetails, useClientReady, useTournament} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";

import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";
import {tournamentDetailsRetrieved} from "../../store/actions/registrationActions";
import Heading from "../../components/Registration/TournamentDetails/Heading";
import Details from "../../components/Registration/TournamentDetails/Details";
import RegisterButtons from "../../components/Registration/TournamentDetails/RegisterButtons";
import PayButton from "../../components/Registration/TournamentDetails/PayButton";
import Shifts from "../../components/Registration/TournamentDetails/Shifts";
import YouWillNeed from "../../components/Registration/TournamentDetails/YouWillNeed";
import StateBanners from "../../components/Registration/TournamentDetails/StateBanners";
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../components/common/ErrorAlert";

const Page = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const registrationContext = useRegistrationContext();

  const onFetchSuccess = (data) => {
    devConsoleLog("Success. Dispatching to context. But we won't need to for long.");
    registrationContext.dispatch(tournamentDetailsRetrieved(data));
  }

  // const onFetchFailure = (error) => {
  //   devConsoleLog("Failed to fetch", error);
  //   // let's clear the tournaments out of context
  //   router.push('/tournaments');
  // }
  //
  // fetch the tournament details and put the tournament into context
  // useEffect(() => {
  //   if (!identifier || !registrationContext) {
  //     return;
  //   }
  //
  //   const needToFetch = !tournament || tournament.identifier !== identifier;
  //   const registrationMismatch = registrationContext.registration.tournament && registrationContext.registration.tournament.identifier !== identifier;
  //
  //   if (!needToFetch) {
  //     if (registrationMismatch) {
  //       devConsoleLog("Registration context has the wrong tournament, updating it");
  //       registrationContext.dispatch(tournamentDetailsRetrieved(tournament));
  //     }
  //   }
  //
  //   if (needToFetch) {
  //     devConsoleLog("Fetching tournament details");
  //     fetchTournamentDetails(identifier, onFetchSuccess, onFetchFailure);
  //   }
  // }, [identifier, tournament]);

  const {tournament, loading, error} = useTournament(identifier, onFetchSuccess)

  if (loading) {
    return (
      <div>
        <LoadingMessage message={'Loading the tournament'}/>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <ErrorAlert message={error}/>
      </div>
    );
  }

  // const ready = useClientReady();
  // if (!ready) {
  //   return null;
  // }
  // if (!tournament) {
  //   return null;
  // }

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
          <div className={'d-flex justify-content-start align-items-start'}>
            <TournamentLogo url={tournament.image_url}
                            additionalClasses={'col-4 pe-2 d-md-none'}/>
            <Heading tournament={tournament}/>
          </div>

          <div className={'d-flex'}>
            <div className={'flex-fill w-100'}>
              <Details tournament={tournament}/>
            </div>
            <div className={'d-none d-lg-block flex-shrink-1'}>
              <YouWillNeed tournament={tournament}/>
            </div>
          </div>

          <PayButton disabled={!!tournament.config_items.find(({key, value}) => key === 'accept_payments' && !value)} />
          <RegisterButtons tournament={tournament}/>

          <div className={'d-lg-none'}>
            <YouWillNeed tournament={tournament}/>
          </div>
          <div className={'mt-4'}>
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
