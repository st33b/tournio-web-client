import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerEdited} from "../../../store/actions/registrationActions";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [bowlerNum, setBowlerNum] = useState(null);

  // Validate the 'bowler' query parameter
  useEffect(() => {
    if (!router || !registration) {
      return;
    }
    const { bowler } = router.query;
    const result = parseInt(bowler);
    if (isNaN(result) || result <= 0 || result > registration.team.bowlers.length) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
    } else {
      setBowlerNum(result);
    }
  }, [router, registration]);

  if (!bowlerNum || !registration) {
    return '';
  }

  const bowlerIndex = bowlerNum - 1;

  const onBowlerInfoUpdated = (bowlerInfo) => {
    dispatch(newTeamBowlerEdited(bowlerInfo));
    router.push(`/tournaments/${registration.tournament.identifier}/review-entries`);
  }

  return (
    <Row>
      <Col xs={{ order: 2 }}>
        <Summary tournament={registration.tournament}
                 nextStepClicked={null}
                 nextStepText={'Finished With Bowlers'}
                 buttonDisabled={true}
        />
      </Col>
      <Col lg={8} sm={{ order: 2 }}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm bowlerData={registration.team.bowlers[bowlerIndex]}
                    bowlerInfoSaved={onBowlerInfoUpdated}
                    tournament={registration.tournament}
                    cancelHref={`/tournaments/${registration.tournament.identifier}/review-entries`}
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