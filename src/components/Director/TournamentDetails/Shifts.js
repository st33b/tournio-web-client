import {Card, ListGroup} from "react-bootstrap";
import ShiftForm from '../ShiftForm/ShiftForm';
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentDetails.module.scss';

const Shifts = () => {
  const context = useDirectorContext();

  let content = '';
  if (!context || !context.tournament) {
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
        {!context.tournament.shifts &&
          <ListGroup.Item>None configured</ListGroup.Item>
        }
        {context.tournament.shifts && context.tournament.shifts.length === 0 &&
          <ListGroup.Item>None configured</ListGroup.Item>
        }
        {context.tournament.shifts && context.tournament.shifts.length > 0 && context.tournament.shifts.map((shift, i) => (
          <ListGroup.Item key={i} className={'p-0'}>
            <ShiftForm shift={shift}/>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Shifts
      </Card.Header>
      {content}
      {context.tournament.shifts.length === 0 && <ShiftForm />}
    </Card>
  )
}

export default Shifts;