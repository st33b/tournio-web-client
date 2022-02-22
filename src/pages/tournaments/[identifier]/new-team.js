// The top-level page for bowlers
import {Row, Col} from "react-bootstrap";

import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import ProgressSummary from "../../../components/Registration/ProgressSummary/ProgressSummary";

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