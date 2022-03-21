import Card from 'react-bootstrap/Card';

import classes from './TournamentDetails.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";

const Configuration = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }


  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Configuration
      </Card.Header>
      <Card.Body>
        <dl>
          {context.tournament.config_items.map((item) => {
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

export default Configuration;