// The top-level page for bowlers
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import ProgressSummary from "../../../components/Registration/Summary/Summary";

const page = () => {
  return (
    <Row>
      <Col lg={8}>
        <TeamForm />
      </Col>
      <Col>
        <ProgressSummary />
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