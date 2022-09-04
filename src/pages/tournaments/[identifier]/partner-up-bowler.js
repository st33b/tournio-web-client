import {useEffect} from "react";
import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {
  newSoloRegistrationInitiated,
  partnerUpBowlerAdded,
  soloBowlerInfoAdded
} from "../../../store/actions/registrationActions";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    if (!registration || !registration.tournament) {
      return;
    }
    const shift = registration.tournament.shifts[0];
    if (shift && !shift.registration_types.partner) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
    }
  }, [registration]);

  if (!registration || !registration.tournament) {
    return '';
  }

  const onCompletion = (bowler) => {
    dispatch(partnerUpBowlerAdded(bowler));
    router.push(`/tournaments/${registration.tournament.identifier}/partner-up-bowler-review`);
  }

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm tournament={registration.tournament}
                    bowlerInfoSaved={onCompletion} />
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