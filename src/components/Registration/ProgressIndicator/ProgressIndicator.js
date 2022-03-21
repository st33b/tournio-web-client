import classes from './ProgressIndicator.module.scss';
import {Col, Row} from "react-bootstrap";

const ProgressIndicator = ({active}) => {
  const steps = [
    {
      id: 'team',
      text: 'Team',
    },
    {
      id: 'bowlers',
      text: 'Bowlers',
    },
    {
      id: 'doubles',
      text: 'Doubles',
    },
    {
      id: 'review',
      text: 'Review',
    },
  ];


  return (
    <Row className={classes.ProgressIndicator}>
      {steps.map((step, i) => {
        const containerClasses = active === step.id
          ? 'bg-primary text-white ' + classes.Step
          : 'bg-light text-dark ' + classes.Step;
        const itemClass = active === step.id ? classes.Active : '';
        return (
          <Col className={containerClasses} key={i}>
            <p className={'text-center py-3 m-0'}>
              <span className={itemClass}>{step.text}</span>
            </p>
          </Col>
        )
      })}
    </Row>
  );
}

export default ProgressIndicator;
