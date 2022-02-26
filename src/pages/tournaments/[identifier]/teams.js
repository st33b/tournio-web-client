import {useEffect, useState} from "react";
import axios from "axios";
import {Col, Row} from "react-bootstrap";

import {apiHost} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import TeamListing from "../../../components/Registration/TeamListing/TeamListing";
import {joinTeamRegistrationInitiated} from "../../../store/actions/registrationActions";

const page = () => {
  const { entry, dispatch } = useRegistrationContext();

  if (!entry.tournament) {
    return '';
  }

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState(null);

  // fetch the list of teams
  useEffect(() => {
    // dispatch(joinTeamRegistrationInitiated());
    const requestConfig = {
      method: 'get',
      url: `${apiHost}/tournaments/${entry.tournament.identifier}/teams`,
      headers: {
        'Accept': 'application/json',
      }
    }
    axios(requestConfig)
      .then(response => {
        setTeams(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        // Display some kind of error message
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

  if (!teams) {
    return '';
  }

  return (
    <div>
      <Row>
        <Col md={4} className={'d-none d-md-block'}>
          <a href={`/tournaments/${entry.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo />
          </a>
          <h4 className={'text-center'}>{entry.tournament.name}</h4>
        </Col>
        <Col>
          <TeamListing caption={'First, find your team...'} teams={teams} />
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