import {Card, ListGroup} from "react-bootstrap";

import ShiftForm from '../ShiftForm/ShiftForm';

import classes from './TournamentInPrep.module.scss';

const Shifts = ({tournament}) => {
  let content = '';
  if (!tournament) {
    content = (
      <Card.Body>
        <div className={'d-flex justify-content-center'}>
          <div className={'spinner-border text-light'}
               style={'width: 3rem; height: 3rem'}
               role={'status'}>
            <span className={'visually-hidden'}>Loading...</span>
          </div>
        </div>
      </Card.Body>
    );
  } else {
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
            <ShiftForm tournament={tournament} shift={shift}/>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Capacity &amp; Registration Options
      </Card.Header>
      {content}
      {tournament.shifts.length === 0 && <ShiftForm tournament={tournament} />}
    </Card>
  )
}

export default Shifts;