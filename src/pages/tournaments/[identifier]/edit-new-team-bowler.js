import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerEdited} from "../../../store/actions/registrationActions";

const page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();
  const { bowler } = router.query;

  const onBowlerInfoUpdated = (bowlerInfo) => {
    dispatch(newTeamBowlerEdited(bowlerInfo));
    router.push(`/tournaments/${entry.tournament.identifier}/review-entries`);
  }

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm editBowlerNum={bowler}
                    bowlerInfoSaved={onBowlerInfoUpdated} />
      </Col>
      <Col>
        <Summary nextStepClicked={null}
                 nextStepText={'Finished With Bowlers'}
                 buttonDisabled={true}
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