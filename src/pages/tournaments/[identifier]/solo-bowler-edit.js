import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {soloBowlerInfoUpdated} from "../../../store/actions/registrationActions";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  if (!entry || !entry.bowlers) {
    return'';
  }

  const bowlerNum = 1;
  const onBowlerInfoUpdated = (bowlerInfo) => {
    dispatch(soloBowlerInfoUpdated(bowlerInfo));
    router.push(`/tournaments/${entry.tournament.identifier}/solo-bowler-review`);
  }

  return (
    <Row>
      <Col lg={8}>
        <BowlerForm editBowlerNum={bowlerNum}
                    bowlerInfoSaved={onBowlerInfoUpdated}
                    includeShiftSelection={true} />
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