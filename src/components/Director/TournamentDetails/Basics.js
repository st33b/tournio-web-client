import Card from 'react-bootstrap/Card';

import classes from './TournamentDetails.module.scss';

const basics = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h4'}>
        Basics
      </Card.Header>
      <Card.Body>
        <dl>
          <div className={'row'}>
            <dt className={'col-4'}>Name</dt>
            <dd className={'col'}>{tournament.name}</dd>
          </div>
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

export default basics;