import {useEffect} from "react";
import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newSoloRegistrationInitiated, soloBowlerInfoAdded} from "../../../store/actions/registrationActions";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    if (!registration || !registration.tournament) {
      return;
    }
    const shift = registration.tournament.shifts[0];
    if (shift && !shift.registration_types.solo) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
    }
  }, [registration]);

  useEffect(() => {
    dispatch(newSoloRegistrationInitiated());
  }, [dispatch]);

  const onCompletion = (bowler) => {
    dispatch(soloBowlerInfoAdded(bowler));
    router.push(`/tournaments/${registration.tournament.identifier}/solo-bowler-review`);
  }

  if (!registration || !registration.tournament) {
    return '';
  }

  const includeShift = registration.tournament.available_shifts && registration.tournament.available_shifts.length > 0;

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm bowlerInfoSaved={onCompletion} includeShift={includeShift} />
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