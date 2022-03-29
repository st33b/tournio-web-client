import {useState} from "react";
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

  // const [showNewContactForm, setShowNewContactForm] = useState(false);
  //
  // const toggleNewForm = () => {
  //   setShowNewContactForm(!showNewContactForm);
  // }

  return (
    <Card className={classes.Card}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Contacts
      </Card.Header>
      <ListGroup variant={'flush'}>
        {context.tournament.contacts.map((contact, i) => {
          // const notifications = [];
          // if (contact.notify_on_payment) {
          //   notifications.push('payments');
          // }
          // if (contact.notify_on_registration) {
          //   notifications.push('registrations');
          // }
          // const notificationStyle = contact.notification_preference === 'daily_summary' ? 'daily summary' : 'individually';
          return (
            <ListGroup.Item key={i}>
              <ContactForm contact={contact}/>
              {/*<p className={'fw-bold m-0'}>*/}
              {/*  {contact.name}*/}
              {/*</p>*/}
              {/*<p className={'m-0'}>*/}
              {/*  {contact.role}*/}
              {/*</p>*/}
              {/*<p className={'small m-0'}>*/}
              {/*  {contact.email}*/}
              {/*</p>*/}
              {/*<p className={'small m-0 fst-italic'}>*/}
              {/*  Notifications: {notifications.join(', ') || 'none'}*/}
              {/*  {notifications.length > 0 && ` (${notificationStyle})`}*/}
              {/*</p>*/}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <Card.Body>
        <ContactForm newContact={true} />
        {/*{showNewContactForm && <ContactForm newContact={true}/>}*/}
        {/*{!showNewContactForm &&*/}
        {/*  <button className={'btn btn-outline-primary'}*/}
        {/*          type={'button'}*/}
        {/*          onClick={toggleNewForm}>*/}
        {/*    <i className={'bi-plus-lg pe-2'} aria-hidden={true}/>*/}
        {/*    Add*/}
        {/*  </button>*/}
        {/*}*/}
        {/*{showNewContactForm &&*/}
        {/*  <button className={'btn btn-outline-danger'}*/}
        {/*          type={'button'}*/}
        {/*          onClick={toggleNewForm}>*/}
        {/*    <i className={'bi-x-lg pe-2'} aria-hidden={true}/>*/}
        {/*    Cancel*/}
        {/*  </button>*/}
        {/*}*/}
      </Card.Body>
    </Card>
  );
}

export default Contacts;