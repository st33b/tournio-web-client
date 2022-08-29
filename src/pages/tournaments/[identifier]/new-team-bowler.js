import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded, newTeamPartnersChosen} from "../../../store/actions/registrationActions";

const Page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const partnerThePairUp = () => {
    // create a copy of the bowlers array
    const newBowlers = entry.team.bowlers.slice(0);

    // these are index-based, which is position-1

    newBowlers[0].doubles_partner_num = 2;
    newBowlers[1].doubles_partner_num = 1;

    dispatch(newTeamPartnersChosen(newBowlers));
  }

  const onFinishedWithBowlers = () => {
    switch (entry.team.bowlers.length) {
      case 1:
        router.push(`/tournaments/${entry.tournament.identifier}/review-entries`);
        break;
      case 2:
        partnerThePairUp();
        router.push(`/tournaments/${entry.tournament.identifier}/review-entries`);
        break;
      default:
        // Move on to doubles partner selection!
        router.push(`/tournaments/${entry.tournament.identifier}/doubles-partners`);
    }
  }

  const onNewBowlerAdded = (bowlerInfo) => {
    dispatch(newTeamBowlerInfoAdded(bowlerInfo));
    if (bowlerInfo.position === entry.tournament.max_bowlers) {
      // Move on to doubles partner selection
      onFinishedWithBowlers();
    }
  }

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'}/>
        <BowlerForm bowlerInfoSaved={onNewBowlerAdded}/>
      </Col>
      <Col>
        <Summary nextStepClicked={onFinishedWithBowlers}
                 nextStepText={'Finished With Bowlers'}
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