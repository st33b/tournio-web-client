import {Card, ListGroup} from "react-bootstrap";

import ShiftForm from '../ShiftForm/ShiftForm';

import classes from './TournamentInPrep.module.scss';
import {useTournament} from "../../../director";

const Shifts = () => {
  const {loading, tournament} = useTournament();
  if (loading) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Capacity &amp; Shift Options
      </Card.Header>

      <ListGroup variant={'flush'}>
        {tournament.shifts.map((shift, i) => (
            <ListGroup.Item key={i} className={'p-0'}>
              <ShiftForm shift={shift}/>
            </ListGroup.Item>
          ))
        }
        <ListGroup.Item className={'p-0'}>
          <ShiftForm/>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default Shifts;
