import {ListGroup} from "react-bootstrap";

import classes from './Contacts.module.scss';

const contacts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <div className={classes.Contacts}>
      <h5 className={'mt-2'}>
        Contacts
      </h5>
      <ListGroup variant={'flush'}>
        {tournament.contacts.map((c, i) => {
          return (
            <ListGroup.Item className={classes.ContactItem} key={i}>
              <p className={classes.Name}>
                {c.name}
              </p>
              <p className={classes.Role}>
                {c.role}
              </p>
              <p className={classes.Email}>
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