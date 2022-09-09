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
        const containerClasses = [classes.Step];
        if (active === step.id) {
          containerClasses.push(classes.Active);
        }
        return (
          <Col className={containerClasses.join(' ')} key={i}>
            <p className={'text-center py-2 py-sm-3 m-0'}>
              {step.text}
            </p>
          </Col>
        )
      })}
    </Row>
  );
}

export default ProgressIndicator;
