import {Card, ListGroup} from "react-bootstrap";

import ShiftForm from '../ShiftForm/ShiftForm';

import classes from './TournamentInPrep.module.scss';

const Shifts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light mb-3'}>
        Capacity &amp; Registration Options
      </Card.Header>
      <ListGroup variant={'flush'}>
        {!tournament.shifts &&
          <ListGroup.Item>None configured</ListGroup.Item>
        }
        {tournament.shifts && tournament.shifts.length === 0 &&
          <ListGroup.Item>None configured</ListGroup.Item>
        }
        {tournament.shifts && tournament.shifts.length > 0 && tournament.shifts.map((shift, i) => (
          <ListGroup.Item key={i} className={'p-0'}>
            <ShiftForm tournament={tournament} shift={shift}/>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {tournament.shifts.length === 0 && <ShiftForm tournament={tournament} />}
    </Card>
  )
}

export default Shifts;