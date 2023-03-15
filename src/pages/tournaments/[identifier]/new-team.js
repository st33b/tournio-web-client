import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationInitiated, teamInfoAdded} from "../../../store/actions/registrationActions";
import {useEffect} from "react";
import {useClientReady} from "../../../utils";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!registration.tournament) {
      return;
    }
    const shift = registration.tournament.shifts[0];
    if (shift && !registration.tournament.registration_options.new_team) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
    }
  }, [registration]);

  useEffect(() => {
    dispatch(newTeamRegistrationInitiated());
  }, [dispatch]);

  const onTeamFormCompleted = (teamName, shift) => {
    dispatch(teamInfoAdded(teamName, shift));
    router.push(`/tournaments/${registration.tournament.identifier}/new-team-bowler`);
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration.tournament) {
    return '';
  }

  return (
    <Row>
      <Col>
        <Summary tournament={registration.tournament}/>
      </Col>
      <Col lg={8}>
        <ProgressIndicator active={'team'} />
        <TeamForm tournament={registration.tournament} teamFormCompleted={onTeamFormCompleted} />
      </Col>
    </Row>
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
