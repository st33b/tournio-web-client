import {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";

import {fetchTeamList} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import TeamListing from "../../../components/Registration/TeamListing/TeamListing";
import Contacts from "../../../components/Registration/Contacts/Contacts";

const Page = () => {
  const { entry, dispatch } = useRegistrationContext();

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState(null);

  const onTeamListRetrieved = (data) => {
    setTeams(data);
    setLoading(false);
  }

  const onTeamListFailed = (data) => {
    setLoading(false);
    // error!
  }

  // fetch the list of teams
  useEffect(() => {
    if (!entry || !entry.tournament) {
      return;
    }
    setLoading(true);
    fetchTeamList({
      tournamentIdentifier: entry.tournament.identifier,
      dispatch: dispatch,
      onSuccess: onTeamListRetrieved,
      onFailure: onTeamListFailed,
    });
  }, []);

  if (loading) {
    return (
      <div>
        <p>
          Retrieving list of teams...
        </p>
      </div>
    );
  }

  if (!teams || !entry || !entry.tournament) {
    return '';
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
          <a href={`/tournaments/${entry.tournament.identifier}`} title={'To tournament page'}>
            <h4 className={'d-md-none text-center'}>
              {entry.tournament.name}
            </h4>
          </a>
          <TeamListing caption={'First, find your team...'} teams={teams} />
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