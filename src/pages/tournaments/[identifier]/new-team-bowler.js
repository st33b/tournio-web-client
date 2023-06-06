import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamBowlerInfoAdded, newTeamPartnersChosen} from "../../../store/actions/registrationActions";
import {useClientReady} from "../../../utils";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  const partnerThePairUp = () => {
    // create a copy of the bowlers array
    const newBowlers = registration.team.bowlers.slice(0);

    // these are index-based, which is position-1
    newBowlers[0].doubles_partner_num = 2;
    newBowlers[1].doubles_partner_num = 1;

    dispatch(newTeamPartnersChosen(newBowlers));
  }

  const onFinishedWithBowlers = () => {
    switch (registration.team.bowlers.length) {
      case 1:
        router.push(`/tournaments/${registration.tournament.identifier}/review-entries`);
        break;
      case 2:
        partnerThePairUp();
        router.push(`/tournaments/${registration.tournament.identifier}/review-entries`);
        break;
      default:
        // Move on to doubles partner selection!
        router.push(`/tournaments/${registration.tournament.identifier}/doubles-partners`);
    }
  }

  const onNewBowlerAdded = (bowlerInfo) => {
    dispatch(newTeamBowlerInfoAdded(bowlerInfo));
    if (bowlerInfo.position === registration.tournament.max_bowlers) {
      // Move on to doubles partner selection
      onFinishedWithBowlers();
    } else {
      // scroll to the top
      window.scrollTo(0,0);
    }
  }

  const ready = useClientReady();
  if (!ready) {
    return null;
  }
  if (!registration) {
    return '';
  }

  return (
    <Row>
      <Col>
        <Summary tournament={registration.tournament}
                 nextStepClicked={onFinishedWithBowlers}
                 nextStepText={'Finished With Bowlers'}
        />
      </Col>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'}/>
        <BowlerForm tournament={registration.tournament}
                    bowlerInfoSaved={onNewBowlerAdded}/>
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
