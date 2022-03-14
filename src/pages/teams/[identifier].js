import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {fetchTeamDetails, retrieveTournamentDetails} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";
import TeamDetails from "../../components/Registration/TeamDetails/TeamDetails";

const page = () => {
  const router = useRouter();
  const { entry, dispatch, commerceDispatch } = useRegistrationContext();
  const { identifier, success } = router.query;

  const [loading, setLoading] = useState(false);

  const onTeamFetchSuccess = (data) => {
    setLoading(false);
  }

  const onTeamFetchFailure = (data) => {
    setLoading(false);
  }

  // fetch the team details
  useEffect(() => {
    if (identifier === undefined || !entry) {
      return;
    }

    if (!entry.team || entry.team.identifier !== identifier) {
      fetchTeamDetails({
        teamIdentifier: identifier,
        onSuccess: onTeamFetchSuccess,
        onFailure: onTeamFetchFailure,
        dispatches: [dispatch, commerceDispatch],
      })
    }
  }, [identifier, entry]);

  // ensure that the tournament in context matches the team's
  useEffect(() => {
    if (identifier === undefined || !entry) {
      return;
    }
    if (!entry.team || !entry.tournament) {
      return;
    }
    if (entry.team.tournament.identifier !== entry.tournament.identifier) {
      retrieveTournamentDetails(entry.team.tournament.identifier, dispatch, commerceDispatch);
    }
  }, [identifier, entry]);

  if (loading || !entry || !entry.team) {
    return (
      <div>
        <p>
          Retrieving team details...
        </p>
      </div>
    );
  }

  let joinLink = '';
  if (entry.team.size < entry.tournament.max_bowlers && !success) {
    joinLink = (
      <p className={'text-center mt-2'}>
        <a href={`/teams/${entry.team.identifier}/join`}
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
          <a href={`/tournaments/${entry.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo tournament={entry.tournament}/>
            <h4 className={'text-center py-3'}>
              {entry.tournament.name}
            </h4>
          </a>
          <Contacts tournament={entry.tournament}/>
        </Col>
        <Col xs={12} className={'d-md-none'}>
          <a href={`/tournaments/${entry.tournament.identifier}`} title={'To tournament page'}>
            <h4 className={'text-center'}>
              {entry.tournament.name}
            </h4>
          </a>
        </Col>
        <Col>
          <TeamDetails successType={success}/>
          {joinLink}
        </Col>
      </Row>
    </div>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;