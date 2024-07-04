import classes from './ProgressIndicator.module.scss';
import {Col, Row} from "react-bootstrap";

const ProgressIndicator = ({
                             steps = ['team', 'bowlers', 'doubles', 'review'],
                             completed = [],
                             active,
                           }) => {
  const STEP_LABELS = {
    team: 'Team',
    bowlers: 'Bowlers',
    doubles: 'Doubles',
    bowler: 'Bowler',
    review: 'Review',
  };

  if (!steps) {
    return '';
  }

  return (
    <Row className={classes.ProgressIndicator}>
      {steps.map((step) => {
        const containerClasses = [classes.Step];
        if (active === step) {
          containerClasses.push(classes.Active);
        }
        return (
          <Col className={containerClasses.join(' ')} key={step}>
            <p className={'text-center py-2 py-sm-3 m-0'}>
              {STEP_LABELS[step]}
            </p>
          </Col>
        )
      })}
    </Row>
  );
}

export default ProgressIndicator;
