// The top-level page for bowlers
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationInitiated, teamInfoAdded} from "../../../store/actions/registrationActions";
import {useEffect} from "react";

const page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    dispatch(newTeamRegistrationInitiated());
  }, [])

  const onTeamFormCompleted = (teamName) => {
    dispatch(teamInfoAdded(teamName));
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

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;