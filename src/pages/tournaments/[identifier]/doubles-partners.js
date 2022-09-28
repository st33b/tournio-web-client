import {Row, Col} from "react-bootstrap";
import {useRouter} from "next/router";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import DoublesPartners from "../../../components/Registration/DoublesPartners/DoublesPartners";
import {newTeamPartnersChosen} from "../../../store/actions/registrationActions";
import {useEffect, useState} from "react";
import {useClientReady} from "../../../utils";

const Page = () => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  const [partnersChosen, setPartnersChosen] = useState(false);

  useEffect(() => {
    if (!registration || !registration.bowlers) {
      return;
    }
    const theyHavePartners = registration.bowlers.reduce(
      (prev, bowler) => prev || !!bowler.doubles_partner_num,
      registration.bowlers.length < 2
    );
    setPartnersChosen(theyHavePartners);
  }, [registration]);

  const moveOnToReview = () => {
    router.push(`/tournaments/${registration.tournament.identifier}/review-entries`);
  }

  // When a doubles partner is clicked, what needs to happen:
  // - update the double partner assignments in state. (One click is enough to know everyone.)
  //  - Ex: Bowler A clicked on Bowler B
  //  - set A's partner to be B
  //  - set B's partner to be A (reciprocal)
  //  - set C and D to be partners (the remaining two)
  const gimmeNewDoublesPartners = (bowlerNum, partnerNum) => {
    // create a copy of the bowlers array
    const newBowlers = registration.team.bowlers.slice(0);

    // these are index-based, which is position-1

    if (newBowlers[bowlerNum - 1].doubles_partner_num === partnerNum) {
      // Nothing is changing, so...
      return;
    }

    let bowlersLeftToUpdate = [...newBowlers.keys()];
    newBowlers[bowlerNum - 1].doubles_partner_num = partnerNum;
    newBowlers[partnerNum - 1].doubles_partner_num = bowlerNum;

    // Remove those two from the list of bowlers who need to be updated
    bowlersLeftToUpdate = bowlersLeftToUpdate.filter((value) => {
      return value !== bowlerNum - 1 && value !== partnerNum - 1
    });

    // Update the other two (if there are two) to be partners with each other
    if (bowlersLeftToUpdate.length > 1) {
      const left = bowlersLeftToUpdate[0];
      const right = bowlersLeftToUpdate[1];
      newBowlers[left].doubles_partner_num = right + 1;
      newBowlers[right].doubles_partner_num = left + 1;
    } else if (bowlersLeftToUpdate.length === 1) {
      // If there's just one left, then nullify their doubles partner selection
      newBowlers[bowlersLeftToUpdate[0]].doubles_partner_num = null;
    }

    setPartnersChosen(true);
    dispatch(newTeamPartnersChosen(newBowlers));
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
      <Col xs={{ order: 2 }}>
        <Summary tournament={registration.tournament}
                 nextStepClicked={moveOnToReview}
                 nextStepText={'Review Entries'}
                 buttonDisabled={!partnersChosen}
        />
      </Col>
      <Col lg={8} sm={{ order: 2 }}>
        <ProgressIndicator active={'doubles'} />
        <DoublesPartners team={registration.team} partnersChosen={gimmeNewDoublesPartners} />
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