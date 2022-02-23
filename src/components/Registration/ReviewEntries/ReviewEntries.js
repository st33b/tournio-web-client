import {useEffect, useState} from "react";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import BowlerSummary from "./BowlerSummary";

import classes from './ReviewEntries.module.scss';
import {Alert, Col, Row} from "react-bootstrap";

const reviewEntries = ({editBowler}) => {
  const context = useRegistrationContext();

  const [bowlers, setBowlers] = useState(null);
  useEffect(() => {
    setBowlers(context.state.bowlers);
  });

  if (!bowlers) {
    return '';
  }

  return (
    <div className={classes.ReviewEntries}>
      <h3>
        Let's Review...
      </h3>
      <Alert variant={'info'}>
        Please check everything over for correctness. Clicking the <strong>Submit Registration</strong> button will
        complete your registration.
      </Alert>
      <Row>
        {bowlers.map((bowler, i) => {
          const colSize = bowlers.length > 1 ? 6 : 12;
          return (
            <Col md={colSize} className={'px-lg-2'} key={i}>
              <BowlerSummary bowler={bowler}
                             bowlerCount={bowlers.length}
                             editClicked={editBowler}
              />
            </Col>
          )
        })}
      </Row>
    </div>
  );
}

export default reviewEntries;