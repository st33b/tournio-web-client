// The top-level page for bowlers
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import Summary from "../../../components/Registration/Summary/Summary";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import BowlerForm from "../../../components/Registration/BowlerForm/BowlerForm";

const page = () => {
  return (
    <Row>
      <Col lg={8}>
        <ProgressIndicator active={'bowlers'} />
        <BowlerForm />
      </Col>
      <Col>
        <Summary />
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