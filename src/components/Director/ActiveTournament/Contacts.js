import CardHeader from "./CardHeader";
import ContactForm from "./ContactForm";

import classes from './ActiveTournament.module.scss';

const Contacts = ({tournament, onFormSubmit}) => {
  if (!tournament) {
    return '';
  }

  return (
    <div className={classes.Contacts}>
      <div className="card mb-3">
        <CardHeader headerText={'Contacts'}
                    titleText={'These are displayed on the front, and used for communication about the tournament'}
                    id={'contacts--tooltip'}/>
        <ul className={'list-group list-group-flush'}>
          {tournament.contacts.map((contact, i) => (
            <li key={`contact-${i}`} className={`list-group-item ${classes.Contact}`}>
              <ContactForm contact={contact} onSubmit={onFormSubmit} />
            </li>
          ))}
          <li className={`list-group-item ${classes.Contact}`}>
            <ContactForm newContact={true} onSubmit={onFormSubmit} />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Contacts;
