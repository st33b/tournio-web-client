import {ListGroup} from "react-bootstrap";

import classes from './Contacts.module.scss';

const Contacts = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const roles = {
    'co-director': 'Co-Director',
    'director': 'Director',
    'fundraising': 'Fundraising',
    'secretary': 'Secretary',
    'secretary-treasurer': 'Secretary/Treasurer',
    'statistician': 'Statistician',
    'treasurer': 'Treasurer',
    'registration': 'Registration',
    'igbo-representative': 'IGBO Representative',
    'technologist': 'Technologist',
    'member-at-large': 'Member At Large',
    'operations': 'Director of Operations',
  };

  return (
    <div className={`${classes.Contacts}`} >
      <h5 className={'mt-2'}>
        Contacts
      </h5>
      <ListGroup variant={'flush'}>
        {tournament.contacts.map((c, i) => {
          return (
            <ListGroup.Item className={classes.ContactItem} key={i} action>
              <p className={classes.Name}>
                {c.name}
              </p>
              <p className={classes.Role}>
                {roles[c.role]}
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

export default Contacts;
