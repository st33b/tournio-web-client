import {ListGroup} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './Contacts.module.scss';

const contacts = () => {
  const {entry} = useRegistrationContext();

  if (!entry.tournament) {
    return '';
  }

  return (
    <div className={classes.Contacts}>
      <h5 className={'mt-4'}>
        Contacts
      </h5>
      <ListGroup variant={'flush'}>
        {entry.tournament.contacts.map((c, i) => {
          return (
            <ListGroup.Item className={classes.ContactItem} key={i}>
              <p className={'lead'}>
                {c.name}
              </p>
              <p>
                {c.role}
              </p>
              <p>
                <a href={`mailto:${c.email}`} title={'Tournament inquiry'}>
                  {c.email}
                </a>
              </p>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}

export default contacts;