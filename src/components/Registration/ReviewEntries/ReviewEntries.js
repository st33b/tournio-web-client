import {useEffect, useState} from "react";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import BowlerSummary from "./BowlerSummary";

import classes from './ReviewEntries.module.scss';
import {Alert, Col, Row} from "react-bootstrap";

const reviewEntries = ({editBowler, context}) => {
  const {entry} = useRegistrationContext();

  if (!entry.bowlers) {
    return '';
  }

  let content = '';
  if (context === 'join') {
    content = (
      <Col className={'px-lg-2'}>
        <BowlerSummary bowler={entry.bowlers[entry.bowlers.length - 1]}
                       editClicked={editBowler}
        />
      </Col>
    );
  } else {
    content = entry.bowlers.map((bowler, i) => {
          const colSize = entry.bowlers.length > 1 ? 6 : 12;
          return (
            <Col md={colSize} className={'px-lg-2'} key={i}>
              <BowlerSummary bowler={bowler}
                             editClicked={editBowler}
              />
            </Col>
          )
        })
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
        {content}
      </Row>
    </div>
  );
}

export default reviewEntries;