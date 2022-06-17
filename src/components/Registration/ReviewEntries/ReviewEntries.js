import {useRegistrationContext} from "../../../store/RegistrationContext";
import BowlerSummary from "./BowlerSummary";

import classes from './ReviewEntries.module.scss';
import {Alert, Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";

const ReviewEntries = ({editBowler, context}) => {
  const {entry} = useRegistrationContext();

  const [bowler, setBowler] = useState();
  const [team, setTeam] = useState();
  const [bowlers, setBowlers]= useState();

  useEffect(() => {
    if (!entry) {
      return;
    }
    setBowler(entry.bowler);
    setTeam(entry.team);
    setBowlers(entry.bowlers);
  }, [entry]);

  if (!bowler && !bowlers && !team) {
    return '';
  }

  let content = '';
  if (context === 'solo' || context === 'partner') {
    content = (
      <Col className={'px-lg-2'}>
        <BowlerSummary bowler={bowler}
                       editClicked={editBowler}
        />
      </Col>
    );
  } else if (context === 'join') {
    content = (
      <Col className={'px-lg-2'}>
        <BowlerSummary bowler={team.bowlers[team.bowlers.length - 1]}
                       editClicked={editBowler}
        />
      </Col>
    );
  } else if (context === 'doubles') {
    content = bowlers.map((bowler, i) => {
      return (
        <Col md={6} className={'px-lg-2'} key={i}>
          <BowlerSummary bowler={bowler} editClicked={bowler => editBowler(bowler, i)}/>
        </Col>
      );
    });
  } else {
    content = team.bowlers.map((bowler, i) => {
      const colSize = team.bowlers.length > 1 ? 6 : 12;
      return (
        <Col md={colSize} className={'px-lg-2'} key={i}>
          <BowlerSummary bowler={bowler}
                         editClicked={editBowler}
          />
        </Col>
      )
    });
  }

  return (
    <div className={classes.ReviewEntries}>
      <h3>
        Let&apos;s Review...
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

export default ReviewEntries;