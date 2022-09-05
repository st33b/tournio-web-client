import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {fetchTeamDetails, fetchTournamentDetails, useClientReady} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";
import TeamDetails from "../../components/Registration/TeamDetails/TeamDetails";
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import {joinTeamRegistrationInitiated, tournamentDetailsRetrieved} from "../../store/actions/registrationActions";

const Page = () => {
  const router = useRouter();
  const { registration, dispatch } = useRegistrationContext();
  const { identifier, success, context } = router.query;

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [team, setTeam] = useState();

  const onTeamFetchSuccess = (data) => {
    setTeam(data);
    setLoading(false);
  }

  const onTeamFetchFailure = (data) => {
    setLoading(false);
    router.push(`/tournaments/${registration.tournament.identifier}`)
  }

  // fetch the team details
  useEffect(() => {
    if (!identifier) {
      return;
    }

    fetchTeamDetails({
      teamIdentifier: identifier,
      onSuccess: onTeamFetchSuccess,
      onFailure: onTeamFetchFailure,
    });
  }, [identifier]);

  const onTournamentFetchSuccess = (data) => {
    dispatch(tournamentDetailsRetrieved(data));
  }

  const onTournamentFetchFailure = (error) => {
    router.push('/tournaments');
  }

  // ensure that the tournament in context matches the team's
  useEffect(() => {
    if (!identifier || !registration || !team) {
      return;
    }
    if (!registration.tournament || registration.tournament.identifier !== team.tournament.identifier) {
      fetchTournamentDetails(registration.team.tournament.identifier, onTournamentFetchSuccess, onTournamentFetchFailure);
    }
  }, [identifier, registration, team, dispatch]);

  const joinTeamClicked = (event) => {
    dispatch(joinTeamRegistrationInitiated(team));
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration) {
    return '';
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving team details...'} />
  }

  let enablePurchase = true;
  let joinLink = '';
  if (team.size < registration.tournament.max_bowlers && context === 'join') {
    joinLink = (
      <p className={'text-center mt-2'}>
        <a href={`/teams/${team.identifier}/join`}
           onClick={joinTeamClicked}
           className={'btn btn-outline-info'}>
          Join this Team
        </a>
      </p>
    );
    enablePurchase = false;
  }

  return (
    <div>
      <Row className={'g-1 g-md-4 d-flex align-items-center'}>

        <Col xs={3} className={'d-md-none'}>
          <TournamentLogo url={registration.tournament.image_url}/>
        </Col>
        <Col xs={9} className={'d-md-none'}>
          <a href={`/tournaments/${registration.tournament.identifier}`} title={'To tournament page'}>
            <h4>
              {registration.tournament.name}
            </h4>
          </a>
        </Col>

        <Col md={4} className={'d-none d-md-block mt-2'}>
          <a href={`/tournaments/${registration.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo url={registration.tournament.image_url}/>
            <h4 className={'text-center py-3'}>
              {registration.tournament.name}
            </h4>
          </a>
        </Col>

        <Col xs={12} md={8} className={''}>
          <TeamDetails tournament={registration.tournament}
                       successType={success}
                       enablePayment={enablePurchase}
                       context={context}
                       team={team}/>
          {joinLink}

          {errorMessage && (
            <div className={'col-12 alert alert-warning fade show d-flex align-items-center'} role={'alert'}>
              <i className={'bi-exclamation-triangle-fill pe-2'} aria-hidden={true}/>
              <div className={'me-auto'}>
                {errorMessage}
              </div>
            </div>
          )}
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