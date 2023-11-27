import {useRegistrationContext} from "../../../store/RegistrationContext";
import BowlerSummary from "./BowlerSummary";

import classes from './ReviewEntries.module.scss';
import {Alert, Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";

const ReviewEntries = ({editBowler, context, tournament}) => {
  const {registration} = useRegistrationContext();

  const [bowler, setBowler] = useState();
  const [team, setTeam] = useState();
  const [bowlers, setBowlers]= useState();

  useEffect(() => {
    if (!registration) {
      return;
    }
    setBowler(registration.bowler);
    setTeam(registration.team);
    setBowlers(registration.bowlers);
  }, [registration]);

  if (!bowler && !bowlers && !team) {
    return '';
  }

  if (!tournament) {
    return '';
  }

  let content = '';
  if (context === 'solo' || context === 'partner') {
    content = (
      <Col className={'px-lg-2'}>
        <BowlerSummary bowler={bowler}
                       editClicked={editBowler}
                       tournament={tournament}
        />
      </Col>
    );
  } else if (context === 'doubles') {
    content = bowlers.map((bowler, i) => {
      return (
        <Col md={6} className={'px-lg-2'} key={i}>
          <BowlerSummary bowler={bowler}
                         index={i}
                         editClicked={bowler => editBowler(bowler, i)}
                         tournament={tournament}
          />
        </Col>
      );
    });
  } else {
    content = team.bowlers.map((bowler, i) => {
      const colSize = team.bowlers.length > 1 ? 6 : 12;
      return (
        <Col md={colSize} className={'px-lg-2'} key={i}>
          <BowlerSummary allBowlers={team.bowlers}
                         index={i}
                         editClicked={editBowler}
                         tournament={tournament}
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
