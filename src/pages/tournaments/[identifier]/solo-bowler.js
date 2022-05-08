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
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    dispatch(newSoloRegistrationInitiated());
  }, [dispatch]);

  const onCompletion = (bowler) => {
    dispatch(soloBowlerInfoAdded(bowler));
    router.push(`/tournaments/${entry.tournament.identifier}/solo-bowler-review`);
  }

  if (!entry || !entry.tournament) {
    return '';
  }

  const includeShift = entry.tournament.available_shifts && entry.tournament.available_shifts.length > 0;

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