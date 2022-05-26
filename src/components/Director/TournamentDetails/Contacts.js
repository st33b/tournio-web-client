import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";

import {useDirectorContext} from "../../../store/DirectorContext";
import ContactForm from "../ContactForm/ContactForm";

import classes from './TournamentDetails.module.scss';

const Contacts = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  return (
    <Card className={`${classes.Card} mb-3`}>
      <Card.Header as={'h6'} className={'fw-light'}>
        Contacts
      </Card.Header>
      <ListGroup variant={'flush'}>
        {context.tournament.contacts.map((contact, i) => {
          return (
            <ListGroup.Item key={i}>
              <ContactForm contact={contact}/>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <Card.Body>
        <ContactForm newContact={true} />
      </Card.Body>
    </Card>
  );
}

export default Contacts;