import Card from 'react-bootstrap/Card';

import classes from './TournamentDetails.module.scss';

const configuration = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h4'}>
        Configuration
      </Card.Header>
      <Card.Body>
        <dl>
          {tournament.config_items.map((item) => {
            return (
              <div className={'row'} key={item.key}>
                <dt className={'col-4'}>{item.label}</dt>
                <dd className={'col-8'}>{item.value}</dd>
              </div>
            )
          })}
        </dl>
      </Card.Body>
    </Card>
  );
}

export default configuration;