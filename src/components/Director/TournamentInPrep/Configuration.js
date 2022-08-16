import Card from 'react-bootstrap/Card';

import classes from './TournamentInPrep.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";
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
        <Card.Body>
          <dl>
            {tournament.config_items.map((item) => {
              return (
                <ConfigItemForm item={item} key={item.key} />
              )
            })}
          </dl>
        </Card.Body>
      </Card>
    </ErrorBoundary>
  );
}

export default Configuration;