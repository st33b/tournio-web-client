// The top-level page for bowlers
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {teamInfoAdded} from "../../../store/actions/registrationActions";

const page = () => {
  const context = useRegistrationContext();
  const router = useRouter();
  const onTeamFormCompleted = (teamName) => {
    context.dispatch(teamInfoAdded(teamName));
    router.push(`/tournaments/${context.tournament.identifier}/new-team-bowler`);
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