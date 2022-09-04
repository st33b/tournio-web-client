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
import {joinTeamRegistrationInitiated} from "../../store/actions/registrationActions";

const Page = () => {
  const router = useRouter();
  const { registration, dispatch } = useRegistrationContext();
  const { identifier, success } = router.query;

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [enablePurchase, setEnablePurchase] = useState(true);
  const [team, setTeam] = useState();

  const onTeamFetchSuccess = (data) => {
    setTeam(data);
    setLoading(false);
  }

  const onTeamFetchFailure = (data) => {
    setLoading(false);
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

  // ensure that the tournament in context matches the team's
  useEffect(() => {
    if (!identifier || !registration || !team) {
      return;
    }
    if (!registration.tournament || registration.tournament.identifier !== team.tournament.identifier) {
      fetchTournamentDetails(registration.team.tournament.identifier, dispatch);
    }
  }, [identifier, registration, team, dispatch]);

  const joinTeamClicked = (event) => {
    // event.preventDefault();
    dispatch(joinTeamRegistrationInitiated(team));
    // router.push(`/teams/${team.identifier}/join`);
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration) {
    return '';
  }

  if (loading || !registration || !team) {
    return <LoadingMessage message={'Retrieving team details...'} />
  }

  let joinLink = '';
  if (team.size < registration.tournament.max_bowlers && !success) {
    joinLink = (
      <p className={'text-center mt-2'}>
        <a href={`/teams/${team.identifier}/join`}
           onClick={joinTeamClicked}
           className={'btn btn-outline-info'}>
          Join this Team
        </a>
      </p>
    );
  }

  return (
    <div>
      <Row>
        <Col md={4} className={'d-none d-md-block'}>
          <a href={`/tournaments/${registration.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo tournament={registration.tournament}/>
            <h4 className={'text-center py-3'}>
              {registration.tournament.name}
            </h4>
          </a>
          <Contacts tournament={registration.tournament}/>
        </Col>
        <Col xs={12} className={'d-md-none'}>
          <a href={`/tournaments/${registration.tournament.identifier}`} title={'To tournament page'}>
            <h4 className={'text-center'}>
              {registration.tournament.name}
            </h4>
          </a>
        </Col>
        <Col>
          <TeamDetails tournament={registration.tournament}
                       successType={success}
                       enablePayment={enablePurchase}
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