import {Card, ListGroup, Placeholder} from "react-bootstrap";
import ShiftForm from '../ShiftForm/ShiftForm';

import classes from './VisibleTournament.module.scss';

const RegistrationOptions = ({tournament}) => {
  let content = (
    <Placeholder animation={'glow'}>
      <Placeholder xs={3} />{' '}
      <Placeholder xs={8} />
      <Placeholder xs={4} />{' '}
      <Placeholder xs={7} />
      <Placeholder xs={3} />{' '}
      <Placeholder xs={8} />
      <Placeholder xs={4} />{' '}
      <Placeholder xs={7} />
    </Placeholder>
  )
  if (tournament) {
    content = (
      <ListGroup variant={'flush'}>
        {!tournament.shifts &&
          <ListGroup.Item>None configured</ListGroup.Item>
        }
        {tournament.shifts && tournament.shifts.length === 0 &&
          <ListGroup.Item>None configured</ListGroup.Item>
        }
        {tournament.shifts && tournament.shifts.length > 0 && tournament.shifts.map((shift, i) => (
          <ListGroup.Item key={i} className={'p-0'}>
            <ShiftForm shift={shift} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }

  return (
    <Card className={classes.RegistrationOptions}>
      <Card.Header as={'h6'} className={'fw-light mb-3'}>
        Registration Options
      </Card.Header>
      {content}
    </Card>
  )
}

export default RegistrationOptions;