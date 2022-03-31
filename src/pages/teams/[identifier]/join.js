import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import Summary from "../../../components/Registration/Summary/Summary";
import {existingTeamBowlerInfoAdded} from "../../../store/actions/registrationActions";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const { entry, dispatch } = useRegistrationContext();

  if (!entry.tournament || !entry.team) {
    return <LoadingMessage message={'Retrieving team details...'} />
  }

  const onNewBowlerAdded = (bowlerInfo) => {
    dispatch(existingTeamBowlerInfoAdded(bowlerInfo));
    router.push(`/teams/${entry.team.identifier}/review-joining-bowler`);
  }

  return (
    <Row>
      <Col lg={8}>
        <BowlerForm bowlerInfoSaved={onNewBowlerAdded} />
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