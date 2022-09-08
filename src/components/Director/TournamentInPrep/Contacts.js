import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import ContactForm from "../ContactForm/ContactForm";

import classes from './TournamentInPrep.module.scss';

const Contacts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <Card className={`${classes.Card} mb-3`}>
      <Card.Header as={'h6'} className={'fw-light'}>
        Contacts
      </Card.Header>
      <ListGroup variant={'flush'}>
        {tournament.contacts.map((contact, i) => {
          return (
            <ListGroup.Item key={i} className={classes.ContactItem}>
              <ContactForm contact={contact}/>
            </ListGroup.Item>
          );
        })}
        <ListGroup.Item className={classes.ContactItem}>
          <ContactForm newContact={true}/>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

export default Contacts;