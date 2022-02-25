import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {existingTeamBowlerEdited} from "../../../store/actions/registrationActions";

const page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  if (!entry || !entry.team) {
    return'';
  }

  const bowlerNum = entry.bowlers.length;
  const onBowlerInfoUpdated = (bowlerInfo) => {
    dispatch(existingTeamBowlerEdited(bowlerInfo));
    router.push(`/teams/${entry.team.identifier}/review-joining-bowler`);
  }

  return (
    <Row>
      <Col lg={8}>
        <BowlerForm editBowlerNum={bowlerNum}
                    bowlerInfoSaved={onBowlerInfoUpdated} />
      </Col>
      <Col>
        <Summary nextStepClicked={null}
                 nextStepText={'Submit Registration'}
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