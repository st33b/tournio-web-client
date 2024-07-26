import {Row} from "react-bootstrap";

import classes from './BowlerSummary.module.scss';

const BowlerSummary = ({tournament, bowler, fieldNames, partner = null, labelClass = 'col-5 col-md-3'}) => {
  if (!bowler || !tournament) {
    return '';
  }

  const labels = {
    firstName: 'First Name',
    lastName: 'Last Name',
    nickname: 'Preferred Name',
    email: 'Email',
    phone: 'Phone',
    usbcId: 'USBC ID',
    dateOfBirth: 'Date of Birth',
    address1: 'Mailing Address',
    address2: 'Unit/Apt No.',
    city: 'City',
    state: 'State',
    country: 'Country',
    postalCode: 'Postal/ZIP Code',
    paymentApp: 'Payment App',
    doublesPartner: 'Doubles Partner',
    position: 'Position',
    shiftIdentifier: 'Shift Preference',
    shiftIdentifiera: 'Shift Preferences',
  };

  // Get labels and responses for additional questions, if any
  const aqLabels = {};
  const aqResponses = {};
  tournament.additionalQuestions.forEach(aq => {
    const key = aq.name;
    aqLabels[key] = aq.label;
    aqResponses[key] = bowler[key];
  });

  // Solo registrations may have a shift identifier.
  let shiftNames = '';
  if (tournament.shifts.length > 1) {
    const shifts = bowler.shiftIdentifiers.map(sId => tournament.shifts.find(({identifier}) => identifier === sId));
    shiftNames = shifts.map(shift => `${shift.name} (${shift.description})`);
  }

  let partnerFullName;
  if (partner) {
    partnerFullName = (partner.nickname ? partner.nickname : partner.firstName) + ' ' + partner.lastName;
  }

  return (
    <div className={classes.BowlerSummary}>
      <dl>
        {fieldNames.map((field) => {
          let value = bowler[field];
          if (value === null || typeof value ==='undefined') {
            return null;
          }
          // elements that should be treated differently:
          // - dateOfBirth
          // - paymentApp
          const label = labels[field];
          switch (field) {
            case 'dateOfBirth':
              value = `${bowler.birthMonth} / ${bowler.birthDay} / ${bowler.birthYear}`;
              break;
            case 'paymentApp':
              value = bowler.paymentApp ? `${bowler.paymentAccount} (${bowler.paymentApp})` : 'n/a';
              break;
            default:
              break;
          }
          return (
            <Row key={`summary_${field}`}>
              <dt className={labelClass}>
                {label}
              </dt>
              <dd className={'col'}>
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
            <Row key={`${key}`}>
              <dt className={labelClass}>
                {aqLabels[key]}
              </dt>
              <dd className={'col'}>
                {value}
              </dd>
            </Row>
          );
        })}

        {partnerFullName && (
          <Row>
            <dt className={labelClass}>
              Doubles Partner
            </dt>
            <dd className={'col'}>
              {partnerFullName}
            </dd>
          </Row>
        )}

        {shiftNames && (
          <Row>
            <dt className={labelClass}>
              {shiftNames.length === 1 && labels.shiftIdentifier}
              {shiftNames.length > 1 && labels.shiftIdentifiers}
            </dt>
            <dd className={'col'}>
              {shiftNames.map(s => (
                <span className={'d-block'} key={s}>
                  {s}
                </span>
              ))}
            </dd>
          </Row>
        )}
      </dl>
    </div>
  );
}

export default BowlerSummary;
