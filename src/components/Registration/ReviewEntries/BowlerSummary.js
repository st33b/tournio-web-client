import {useEffect, useState} from "react";
import {Row} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './BowlerSummary.module.scss';

const BowlerSummary = ({bowler, editClicked}) => {
  const {registration} = useRegistrationContext();
  if (!bowler || !registration.tournament) {
    return '';
  }

  const labels = {
    first_name: 'First Name',
    last_name: 'Last Name',
    nickname: 'Preferred Name',
    usbc_id: 'USBC ID',
    // igbo_id: 'IGBO ID',
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
    doubles_partner_num: 'Doubles Partner',
  };

  // Get labels and responses for additional questions, if any
  const aqResponses = {};
  for (let key in registration.tournament.additional_questions) {
    labels[key] = registration.tournament.additional_questions[key].label;
    aqResponses[key] = registration.tournament.additional_questions[key].elementConfig.value;
  }

  const editClickHandler = (event) => {
    event.preventDefault();
    editClicked(bowler);
  }

  return (
    <div className={classes.BowlerSummary}>
      <div className={`d-flex justify-content-between py-2 ps-2 ${classes.Heading}`}>
        <h4 className={'m-0'}>
          Bowler #{bowler.position}
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
          let value = bowler[key] || aqResponses[key];
          if (!value) {
            return null;
          }
          if (key === 'doubles_partner_num') {
            value = `Bowler #${value}`;
          }
          return (
            <Row key={`${key}_${bowler.position}`}>
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
