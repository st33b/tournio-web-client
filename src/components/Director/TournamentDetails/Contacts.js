import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import classes from './TournamentDetails.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";

const contacts = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Contacts
      </Card.Header>
      <ListGroup variant={'flush'}>
        {context.tournament.contacts.map((contact, i) => {
          return (
            <ListGroup.Item key={i}>
              <p className={'fw-bold m-0'}>
                {contact.name}
              </p>
              <p className={'small m-0'}>
                {contact.role}
              </p>
              <p className={'m-0'}>
                {contact.email}
              </p>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}

export default contacts;