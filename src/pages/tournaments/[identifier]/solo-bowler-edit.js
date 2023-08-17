import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {soloBowlerInfoUpdated} from "../../../store/actions/registrationActions";
import {useEffect, useState} from "react";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [bowler, setBowler] = useState();
  const [tournament, setTournament] = useState();
  useEffect(() => {
    if (!registration) {
      return;
    }
    setBowler(registration.bowler);
    setTournament(registration.tournament);
  }, [registration]);

  if (!bowler) {
    return'';
  }

  const onBowlerInfoUpdated = (bowlerInfo) => {
    dispatch(soloBowlerInfoUpdated(bowlerInfo));
    router.push(`/tournaments/${tournament.identifier}/solo-bowler-review`);
  }

  return (
    <Row>
      <Col>
        <Summary tournament={registration.tournament}
                 nextStepClicked={null}
        />
      </Col>
      <Col lg={8}>
        <BowlerForm tournament={registration.tournament}
                    bowlerData={bowler}
                    solo={true}
                    bowlerInfoSaved={onBowlerInfoUpdated}
                    cancelHref={`/tournaments/${tournament.identifier}/solo-bowler-review`}
                    includeShift={true}
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
