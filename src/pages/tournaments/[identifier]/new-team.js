import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationInitiated, teamInfoAdded} from "../../../store/actions/registrationActions";
import {useEffect} from "react";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    if (!entry || !entry.tournament) {
      return;
    }
    const shift = entry.tournament.shifts[0];
    if (shift && !shift.registration_types.new_team) {
      router.push(`/tournaments/${entry.tournament.identifier}`);
    }
  }, [entry]);

  useEffect(() => {
    dispatch(newTeamRegistrationInitiated());
  }, [dispatch]);

  const onTeamFormCompleted = (teamName, shift) => {
    dispatch(teamInfoAdded(teamName, shift));
    router.push(`/tournaments/${entry.tournament.identifier}/new-team-bowler`);
  }

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'team'} />
        <TeamForm teamFormCompleted={onTeamFormCompleted} />
      </Col>
      <Col>
        <Summary />
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