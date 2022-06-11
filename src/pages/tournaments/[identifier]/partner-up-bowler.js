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
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    if (!entry || !entry.tournament) {
      return;
    }
    const shift = entry.tournament.shifts[0];
    if (shift && !shift.registration_types.partner) {
      router.push(`/tournaments/${entry.tournament.identifier}`);
    }
  }, [entry]);

  if (!entry || !entry.tournament) {
    return '';
  }

  const onCompletion = (bowler) => {
    dispatch(partnerUpBowlerAdded(bowler));
    router.push(`/tournaments/${entry.tournament.identifier}/partner-up-bowler-review`);
  }

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm bowlerInfoSaved={onCompletion} />
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