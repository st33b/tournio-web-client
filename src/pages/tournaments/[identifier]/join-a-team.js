import {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";

import {fetchTeamList, useClientReady} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import TeamListing from "../../../components/Registration/TeamListing/TeamListing";
import Contacts from "../../../components/Registration/Contacts/Contacts";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {useRouter} from "next/router";

const Page = () => {
  const { registration, dispatch } = useRegistrationContext();
  const router = useRouter();

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

  // back to tournament home page if joining a team is disabled
  useEffect(() => {
    if (!registration || !registration.tournament) {
      return;
    }
    const shift = registration.tournament.shifts[0];
    if (shift && !shift.registration_types.join_team) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
    }
  }, [registration]);

  // fetch the team details
  useEffect(() => {
    if (!registration || !registration.tournament) {
      return;
    }

    fetchTeamList({
      tournamentIdentifier: registration.tournament.identifier,
      dispatch: dispatch,
      onSuccess: onTeamListRetrieved,
      onFailure: onTeamListFailed,
      incomplete: true,
    })
  }, []);

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration) {
    return '';
  }

  if (!registration || !registration.tournament || !teams) {
    return <LoadingMessage message={'Retrieving list of available teams...'} />
  }

  if (loading) {
    return <LoadingMessage message={'Retrieving list of available teams...'} />
  }

  const includeShift = registration.tournament.shifts && registration.tournament.shifts.length > 1;

  return (
    <div>
      <Row>
        <Col md={4} className={'d-none d-md-block'}>
          <a href={`/tournaments/${registration.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo url={registration.tournament.image_url}/>
            <h4 className={'text-center py-3'}>{registration.tournament.name}</h4>
          </a>
        </Col>
        <Col>
          <TeamListing
            caption={'Teams Available to Join'}
            teams={teams}
            context={'join'}
            includeShift={includeShift} />
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