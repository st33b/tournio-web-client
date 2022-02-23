import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded} from "../../../store/actions/registrationActions";

const page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const onFinishedWithBowlers = () => {
    // Move on to doubles partner selection!
    router.push(`/tournaments/${entry.tournament.identifier}/doubles-partners`);
  }

  const onNewBowlerAdded = (bowlerInfo) => {
    dispatch(newTeamBowlerInfoAdded(bowlerInfo));
    if (bowlerInfo.position === entry.tournament.max_bowlers) {
      // Move on to doubles partner selection
      onFinishedWithBowlers();
    }
  }

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm bowlerInfoAdded={onNewBowlerAdded} />
      </Col>
      <Col>
        <Summary nextStepClicked={onFinishedWithBowlers}
                 nextStepText={'Finished With Bowlers'}
                 />
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