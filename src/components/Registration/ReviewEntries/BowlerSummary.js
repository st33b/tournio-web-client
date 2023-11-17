import {Row} from "react-bootstrap";

import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './BowlerSummary.module.scss';

const BowlerSummary = ({bowler, tournament, partner = null}) => {
  const {registration} = useRegistrationContext();
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
    city: 'City',
    state: 'State',
    country: 'Country',
    postal_code: 'Postal/ZIP Code',
  };

  const bowlerFieldsItem = registration.tournament.config_items.find(({key}) => key === 'bowler_form_fields');
  const optionalFields = !!bowlerFieldsItem ? bowlerFieldsItem.value : [];

  const aqLabels = {};

  // Get labels and responses for additional questions, if any
  const aqResponses = {};
  for (let key in tournament.additional_questions) {
    aqLabels[key] = tournament.additional_questions[key].label;
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

        {Object.keys(minimumLabels).map(key => {
          let value = bowler[key];
          if (value === null || typeof value ==='undefined') {
            return null;
          }
          return (
            <Row key={`${key}_${bowler.position}`}>
              <dt className={'col-5 pe-2 label'}>
                {minimumLabels[key]}
              </dt>
              <dd className={'col ps-2 value'}>
                {value || 'n/a'}
              </dd>
            </Row>
          );
        })}

        {optionalFields.map(key => {
          let value = bowler[key];
          if (value === null || typeof value ==='undefined') {
            return null;
          }
          return (
            <Row key={`${key}_${bowler.position}`}>
              <dt className={'col-5 pe-2 label'}>
                {potentialLabels[key]}
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

        {partner && (
          <Row key={`${doublesPartner}_${bowler.position}`}>
            <dt className={'col-5 pe-2 label'}>
              Doubles Partner
            </dt>
            <dd className={'col ps-2 value'}>
              {partner.full_name}
            </dd>
          </Row>
        )}
      </dl>
    </div>
  );
}

export default BowlerSummary;
