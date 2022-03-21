import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerEdited} from "../../../store/actions/registrationActions";
import {useEffect, useState} from "react";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [bowlerNum, setBowlerNum] = useState(null);

  // Validate the 'bowler' query parameter
  useEffect(() => {
    if (!router || !entry) {
      return;
    }
    const { bowler } = router.query;
    const result = parseInt(bowler);
    if (isNaN(result) || result <= 0 || result > entry.bowlers.length) {
      router.push(`/tournaments/${entry.tournament.identifier}`);
    } else {
      setBowlerNum(result);
    }
  }, [router, entry]);

  if (!bowlerNum) {
    return '';
  }

  const onBowlerInfoUpdated = (bowlerInfo) => {
    dispatch(newTeamBowlerEdited(bowlerInfo));
    router.push(`/tournaments/${entry.tournament.identifier}/review-entries`);
  }

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm editBowlerNum={bowlerNum}
                    bowlerInfoSaved={onBowlerInfoUpdated} />
      </Col>
      <Col>
        <Summary nextStepClicked={null}
                 nextStepText={'Finished With Bowlers'}
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