import {Row} from "react-bootstrap";

import classes from './BowlerSummary.module.scss';
import {devConsoleLog} from "../../../utils";

const BowlerSummary = ({tournament, bowler, partner = null}) => {
  if (!bowler) {
    return '';
  }

  const minimumLabels = {
    first_name: 'First Name',
    last_name: 'Last Name',
    nickname: 'Preferred Name',
    email: 'Email',
    phone: 'Phone',
  }

  const potentialLabels = {
    usbc_id: 'USBC ID',
    date_of_birth: 'Date of Birth',
    address1: 'Mailing Address',
    address2: 'Unit/Apt No.',
    city: 'City',
    state: 'State',
    country: 'Country',
    postal_code: 'Postal/ZIP Code',
    payment_app: 'Payment App',
    doubles_partners: 'Doubles Partner',
    position: 'Position',
    shift_identifier: 'Shift Preference',
  };

  const optionalFields = tournament.config.bowler_form_fields.split(' ');

  const aqLabels = {};

  // Get labels and responses for additional questions, if any
  const aqResponses = {};
  tournament.additionalQuestions.forEach(aq => {
    const key = aq.name;
    aqLabels[key] = aq.label;
    aqResponses[key] = bowler[key];
  });

  // Solo registrations may have a shift identifier.
  let shiftName = '';
  if (tournament.shifts.length > 1 && bowler.shift_identifier) {
    shiftName = tournament.shifts.find(({identifier}) => identifier === bowler.shift_identifier).name;
  }

  let partnerFullName;
  if (partner) {
    partnerFullName = (partner.nickname ? partner.nickname : partner.first_name) + ' ' + partner.last_name;
  }

  return (
    <div className={classes.BowlerSummary}>
      <dl>
        {Object.keys(minimumLabels).map(key => {
          let value = bowler[key];
          if (value === null || typeof value ==='undefined') {
            return null;
          }
          return (
            <Row key={`${key}`}>
              <dt className={'col-5 col-md-3 pe-2 label'}>
                {minimumLabels[key]}
              </dt>
              <dd className={'col ps-2 value'}>
                {value || 'n/a'}
              </dd>
            </Row>
          );
        })}

        {optionalFields.map(key => {
          let displayedValue = bowler[key];
          if (key === 'date_of_birth') {
            displayedValue = `${bowler.birth_month} / ${bowler.birth_day} / ${bowler.birth_year}`;
          } else if (key === 'payment_app') {
            displayedValue = bowler.payment_app.app_name ? `${bowler.payment_app.account_name} (${bowler.payment_app.app_name})` : 'n/a';
          }
          return (
            <Row key={`${key}`}>
              <dt className={'col-5 col-md-3 pe-2 label'}>
                {potentialLabels[key]}
              </dt>
              <dd className={'col ps-2 value'}>
                {displayedValue || 'n/a'}
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
            <Row key={`${key}`}>
              <dt className={'col-5 col-md-3 pe-2 label'}>
                {aqLabels[key]}
              </dt>
              <dd className={'col ps-2 value'}>
                {value}
              </dd>
            </Row>
          );
        })}

        {partnerFullName && (
          <Row key={`partner`}>
            <dt className={'col-5 col-md-3 pe-2 label'}>
              Doubles Partner
            </dt>
            <dd className={'col ps-2 value'}>
              {partnerFullName}
            </dd>
          </Row>
        )}

        {shiftName && (
          <Row key={'shift'}>
            <dt className={'col-5 col-md-3 pe-2 label'}>
              Shift Preference
            </dt>
            <dd className={'col ps-2 value'}>
              {shiftName}
            </dd>
          </Row>
        )}
      </dl>
    </div>
  );
}

export default BowlerSummary;
