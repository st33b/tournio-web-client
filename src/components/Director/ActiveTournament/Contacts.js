import {useTournament} from "../../../director";

// import ContactForm from "../ContactForm/ContactForm";

import classes from './ActiveTournament.module.scss';
import CardHeader from "./CardHeader";
import ContactForm from "./ContactForm";

const Contacts = ({tournament}) => {
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
            <li className={`list-group-item ${classes.Contact}`}>
              <ContactForm contact={contact} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
// <Card className={`${classes.Card} mb-3`}>
//   <Card.Header as={'h6'} className={'fw-light'}>
//     Contacts
//   </Card.Header>
//   <ListGroup variant={'flush'}>
//     {tournament.contacts.map((contact, i) => {
//       return (
//         <ListGroup.Item key={i} className={`${classes.ContactItem} p-0`}>
//           <ContactForm contact={contact}/>
//         </ListGroup.Item>
//       );
//     })}
//     <ListGroup.Item className={`${classes.ContactItem} p-0`}>
//       <ContactForm newContact={true}/>
//     </ListGroup.Item>
//   </ListGroup>
// </Card>

export default Contacts;
