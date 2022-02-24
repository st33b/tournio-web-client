import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {apiHost} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import {teamDetailsRetrieved} from "../../store/actions/registrationActions";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";
import TeamDetails from "../../components/Registration/TeamDetails/TeamDetails";

const page = () => {
  const router = useRouter();
  const { entry, dispatch } = useRegistrationContext();
  const { identifier, success } = router.query;

  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(null);

  // fetch the team details
  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    if (entry.team) {
      console.log("Getting team out of tournament context");
      setTeam(entry.team);
    } else {
      console.log("Retrieving team deets from server");
      const requestConfig = {
        method: 'get',
        url: `${apiHost}/teams/${identifier}`,
        headers: {
          'Accept': 'application/json',
        }
      }
      axios(requestConfig)
        .then(response => {
          dispatch(teamDetailsRetrieved(response.data));
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          // Display some kind of error message
        });
    }
  }, [identifier]);

  if (loading) {
    return (
      <div>
        <p>
          Retrieving team details...
        </p>
      </div>
    );
  }

  if (!team) {
    return '';
  }

  if (!entry) {
    return '';
  }

  return (
    <div>
      <Row>
        <Col md={4} className={'d-none d-md-block'}>
          <a href={`/tournaments/${entry.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo />
          </a>
          <Contacts />
        </Col>
        <Col>
          <TeamDetails successType={success}/>
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