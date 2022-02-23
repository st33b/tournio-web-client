import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import ReviewEntries from "../../../components/Registration/ReviewEntries/ReviewEntries";

const page = () => {
  const {entry, dispatch} = useRegistrationContext();
  const router = useRouter();

  const editBowlerClicked = (bowler) => {
    console.log("Oh now you want to change something?");
    // use the router to go to the page for editing a bowler
  }

  const submitRegistration = () => {
    console.log("Now to submit it all");
  }

  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'review'} />
        <ReviewEntries editBowler={editBowlerClicked} />
      </Col>
      <Col>
        <Summary nextStepClicked={submitRegistration}
                 nextStepText={'Submit Registration'}
        />
      </Col>
    </Row>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;