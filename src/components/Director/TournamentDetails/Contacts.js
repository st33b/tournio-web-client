import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import classes from './TournamentDetails.module.scss';

const contacts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h4'}>
        Contacts
      </Card.Header>
      <ListGroup variant={'flush'}>
        {tournament.contacts.map((contact, i) => {
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