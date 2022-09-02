import Card from 'react-bootstrap/Card';
import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentInPrep.module.scss';

const Basics = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Basics
      </Card.Header>
      <Card.Body>
        <dl>
          <div className={'row'}>
            <dt className={'col-4'}>Name</dt>
            <dd className={'col'}>{tournament.name}</dd>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className={'row'}>
              <dt className={'col-4'}>ID</dt>
              <dd className={'col'}>{tournament.id}</dd>
            </div>
          )}
          <div className={'row'}>
            <dt className={'col-4'}>Year</dt>
            <dd className={'col'}>{tournament.year}</dd>
          </div>
          <div className={'row'}>
            <dt className={'col-4'}>Start Date</dt>
            <dd className={'col mb-0'}>{tournament.start_date}</dd>
          </div>
        </dl>
      </Card.Body>
    </Card>
  );
}

export default Basics;