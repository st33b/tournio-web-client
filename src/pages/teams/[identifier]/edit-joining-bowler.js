import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {existingTeamBowlerEdited} from "../../../store/actions/registrationActions";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  if (!registration || !registration.team) {
    return'';
  }

  const bowlerNum = registration.team.bowlers.length;
  const onBowlerInfoUpdated = (bowlerInfo) => {
    dispatch(existingTeamBowlerEdited(bowlerInfo));
    router.push(`/teams/${registration.team.identifier}/review-joining-bowler`);
  }

  return (
    <Row>
      <Col lg={8}>
        <BowlerForm bowlerData={registration.team.bowlers[bowlerNum - 1]}
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

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;