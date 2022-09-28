import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {existingTeamBowlerEdited} from "../../../store/actions/registrationActions";
import {useClientReady} from "../../../utils";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  const onBowlerInfoUpdated = (bowlerInfo) => {
    dispatch(existingTeamBowlerEdited(bowlerInfo));
    router.push(`/teams/${registration.team.identifier}/review-joining-bowler`);
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration || !registration.team) {
    return '';
  }

  const bowlerNum = registration.team.bowlers.length;

  return (
    <Row>
      <Col sm={4} xs={{ order: 2 }}>
        <Summary tournament={registration.tournament}
                 nextStepClicked={null}
                 nextStepText={''}
                 buttonDisabled={true}
        />
      </Col>
      <Col sm={{ span: 8, order: 2 }}>
        <BowlerForm tournament={registration.tournament}
                    bowlerData={registration.team.bowlers[bowlerNum - 1]}
                    bowlerInfoSaved={onBowlerInfoUpdated}
                    cancelHref={`/teams/${registration.team.identifier}/review-joining-bowler`}
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