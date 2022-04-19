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
        {context.tournament.shifts.length === 0 &&
          <ListGroup.Item>None configured</ListGroup.Item>
        }
        {context.tournament.shifts.length > 0 && context.tournament.shifts.map((shift, i) => (
          <ListGroup.Item key={i}>
            <dl>
              <div className={'row'}>
                <dt className={'col-5'}>
                  Display Order
                </dt>
                <dd className={'col'}>
                  {shift.display_order}
                </dd>
              </div>
              <div className={'row'}>
                <dt className={'col-5'}>
                  Name
                </dt>
                <dd className={'col'}>
                  {shift.name}
                </dd>
              </div>
              <div className={'row'}>
                <dt className={'col-5'}>
                  Description
                </dt>
                <dd className={'col'}>
                  {shift.description}
                </dd>
              </div>
              <div className={'row'}>
                <dt className={'col-5'}>
                  Capacity
                </dt>
                <dd className={'col'}>
                  {shift.capacity} teams
                </dd>
              </div>
              <div className={'row'}>
                <dt className={'col-5'}>
                  Confirmed teams
                </dt>
                <dd className={'col'}>
                  {shift.confirmed_count}
                </dd>
              </div>
              <div className={'row'}>
                <dt className={'col-5'}>
                  Requested teams
                </dt>
                <dd className={'col'}>
                  {shift.requested_count}
                </dd>
              </div>

            </dl>
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
      <ShiftForm />
    </Card>
  )
}

export default Shifts;