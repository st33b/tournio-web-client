import {Row} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";
import * as constants from "../../../constants";

import classes from './BowlerSummary.module.scss';

const BowlerSummary = ({allBowlers=[], bowler, editClicked, index}) => {
  const {registration} = useRegistrationContext();
  if (!registration.tournament) {
    return '';
  }

  const labels = {
    first_name: 'First Name',
    last_name: 'Last Name',
    nickname: 'Preferred Name',
    position: 'Position',
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
    doublesPartnerIndex: 'Doubles Partner',
  };

  const aqLabels = {};

  // Get labels and responses for additional questions, if any
  const aqResponses = {};
  for (let key in registration.tournament.additional_questions) {
    aqLabels[key] = registration.tournament.additional_questions[key].label;
    aqResponses[key] = registration.tournament.additional_questions[key].elementConfig.value;
  }

  const editClickHandler = (event) => {
    event.preventDefault();
    editClicked(index);
  }

  const theBowler = allBowlers[index] || bowler;

  return (
    <div className={classes.BowlerSummary}>
      <div className={`d-flex justify-content-between py-2 ps-2 ${classes.Heading}`}>
        <h4 className={'m-0'}>
          Bowler {String.fromCharCode(constants.A_CHAR_CODE + index)}
        </h4>
        <p className={'m-0 pe-2'}>
          <a href={'#'}
             onClick={editClickHandler}>
            edit
          </a>
        </p>
      </div>
      <dl>
        {Object.keys(labels).map(key => {
          let value = theBowler[key];
          if (value === null || typeof value ==='undefined') {
            return null;
          }
          if (key === 'doublesPartnerIndex') {
            const partner = allBowlers[theBowler.doublesPartnerIndex];
            const firstName = partner.nickname ? partner.nickname : partner.first_name;
            value = firstName + ' ' + partner.last_name;
          }
          if (key === 'position' && value === '') {
            value = 'n/a';
          }
          return (
            <Row key={`${key}_${theBowler.position}`}>
              <dt className={'col-5 pe-2 label'}>
                {labels[key]}
              </dt>
              <dd className={'col ps-2 value'}>
                {value}
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
            <Row key={`${key}_${theBowler.position}`}>
              <dt className={'col-5 pe-2 label'}>
                {labels[key]}
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
