import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import Summary from "../../../components/Registration/Summary/Summary";
import {existingTeamBowlerInfoAdded} from "../../../store/actions/registrationActions";
import {useClientReady} from "../../../utils";

const Page = () => {
  const router = useRouter();
  const { registration, dispatch } = useRegistrationContext();

  const onNewBowlerAdded = (bowlerInfo) => {
    dispatch(existingTeamBowlerInfoAdded(bowlerInfo));
    router.push(`/teams/${registration.team.identifier}/review-joining-bowler`);
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration) {
    return '';
  }

  return (
    <Row>
      <Col>
        <Summary tournament={registration.tournament} />
      </Col>
      <Col lg={8}>
        <BowlerForm tournament={registration.tournament}
                    bowlerInfoSaved={onNewBowlerAdded}
                    includeShift={registration.team.bowlers.length === 0}
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
