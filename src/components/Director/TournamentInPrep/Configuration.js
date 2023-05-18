import Card from 'react-bootstrap/Card';

import classes from './TournamentInPrep.module.scss';
import ConfigItemForm from "../ConfigItemForm/ConfigItemForm";
import ErrorBoundary from "../../common/ErrorBoundary";

const Configuration = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <ErrorBoundary>
      <Card className={`${classes.Card} ${classes.Configuration}`}>
        <Card.Header as={'h5'} className={'fw-light'}>
          Configuration
        </Card.Header>
        <Card.Body className={'px-1'}>
          <dl>
            {tournament.config_items.map((item) => {
              return (
                <ConfigItemForm item={item} key={item.key} editable={true} />
              )
            })}
          </dl>
        </Card.Body>
      </Card>
    </ErrorBoundary>
  );
}

export default Configuration;
