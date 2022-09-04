import {useEffect} from "react";
import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newPairBowlerAdded} from "../../../store/actions/registrationActions";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    if (!registration || !registration.tournament) {
      return;
    }
    if (registration.bowlers.length === 2) {
      onFinishedWithBowlers();
    }
  }, [registration]);

  if (!registration || !registration.tournament) {
    return '';
  }

  const onFinishedWithBowlers = () => {
    // Move on to pair review!
    router.push(`/tournaments/${registration.tournament.identifier}/new-pair-review`);
  }

  const onNewBowlerAdded = (bowlerInfo) => {
    dispatch(newPairBowlerAdded(bowlerInfo));
  }

  const includeShift = registration.tournament.available_shifts && registration.tournament.available_shifts.length > 0;

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm bowlerInfoSaved={onNewBowlerAdded} includeShift={includeShift} />
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