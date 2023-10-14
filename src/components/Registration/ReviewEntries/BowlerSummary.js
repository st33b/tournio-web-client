import {Row} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './BowlerSummary.module.scss';
import {devConsoleLog} from "../../../utils";

const BowlerSummary = ({bowler, partner = null}) => {
  const {registration} = useRegistrationContext();
  if (!registration.tournament || !bowler) {
    return '';
  }

  const labels = {
    first_name: 'First Name',
    last_name: 'Last Name',
    nickname: 'Preferred Name',
    doubles_partner: 'Doubles Partner',
    usbc_id: 'USBC ID',
    birth_month: 'Birth Month',
    birth_day: 'Birth Day',
    email: 'Email',
    phone: 'Phone',
    address1: 'Address 1',
    address2: 'Address 2',
    city: 'City',
    state: 'State',
    country: 'Country',
    postal_code: 'Postal/ZIP Code',
  };

  const aqLabels = {};

  // Get labels and responses for additional questions, if any
  const aqResponses = {};
  for (let key in registration.tournament.additional_questions) {
    aqLabels[key] = registration.tournament.additional_questions[key].label;
    aqResponses[key] = bowler[key];
  }

  return (
    <div className={classes.BowlerSummary}>
      <dl>
        {bowler.position && (
          <Row className={classes.Position}>
            <dt className={`col-5 pe-2 label`}>
              Position
            </dt>
            <dd className={`col ps-2 value`}>
              {bowler.position}
            </dd>
          </Row>
        )}
        {Object.keys(labels).map(key => {
          let value = bowler[key];
          if (value === null || typeof value ==='undefined') {
            return null;
          }
          if (key === 'doubles_partner' && partner) {
            value = partner.full_name;
          }
          return (
            <Row key={`${key}_${bowler.position}`}>
              <dt className={'col-5 pe-2 label'}>
                {labels[key]}
              </dt>
              <dd className={'col ps-2 value'}>
                {value || 'n/a'}
              </dd>
            </Row>
          );
        })}

        {Object.keys(aqLabels).map(key => {
          let value = aqResponses[key];
          if (!value) {
            return null;
          }
          return (
            <Row key={`${key}_${bowler.position}`}>
              <dt className={'col-5 pe-2 label'}>
                {aqLabels[key]}
              </dt>
              <dd className={'col ps-2 value'}>
                {value}
              </dd>
            </Row>
          );
        })}

      </dl>
    </div>
  );
}

export default BowlerSummary;
