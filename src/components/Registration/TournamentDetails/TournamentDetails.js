import {useRouter} from "next/router";
import {Card, Col, ListGroup, Row} from "react-bootstrap";

import classes from './TournamentDetails.module.scss';

const USBC_ID_LOOKUP_URL = 'https://webapps.bowl.com/USBCFindA/Home/Member';
const IGBO_ID_LOOKUP_URL = 'http://igbo.org/tournaments/igbots-id-lookup/';

const TournamentDetails = ({tournament}) => {
  const router = useRouter();

  if (!tournament) {
    return '';
  }

  /////////////////////////////////////////////////////
  // State banner, to indicate states other than active

  let stateText = '';
  let stateClasses = ['text-center', 'py-2', 'py-md-5'];
  switch (tournament.state) {
    case 'setup':
      stateText = 'SETUP MODE: registration data is subject to deletion at any time.';
      stateClasses.push('bg-warning');
      break;
    case 'closed':
      stateText = 'Registration for this tournament has closed.';
      stateClasses.push('bg-dark', 'text-light');
      break;
    default:
      stateText = '';
      stateClasses = ['d-none'];
  }
  const stateBanner = (
    <h2 className={stateClasses.join(' ')}>
      {stateText}
    </h2>
  );

  ////////////////////////////////////////////////////

  const dtClass = 'col-6 col-lg-5 col-xl-4 pe-1';
  const ddClass = 'col-6 col-lg-7 col-xl-8 ps-1';

  let early_registration = '';
  if (tournament.early_registration_ends) {
    early_registration = (
      <div className={'row pb-2'}>
        <dt className={dtClass}>
          Early registration deadline:
        </dt>
        <dd className={ddClass}>
          {tournament.early_registration_ends}
        </dd>
        <dt className={dtClass}>
          Early registration discount:
        </dt>
        <dd className={ddClass}>
          ${tournament.early_registration_discount}
        </dd>
      </div>
    )
  }

  let late_fee_date = '';
  if (tournament.late_fee_applies_at) {
    late_fee_date = (
      <div className={'row pb-2'}>
        <dt className={dtClass}>
          Late fee applies:
        </dt>
        <dd className={ddClass}>
          {tournament.late_fee_applies_at}
        </dd>
        <dt className={dtClass}>
          Late registration fee:
        </dt>
        <dd className={ddClass}>
          ${tournament.late_registration_fee}
        </dd>
      </div>
    )
  }

  const dates = (
    <div className={''}>
      <h6>
        Important details:
      </h6>
      <dl>
        <div className={'row pb-2'}>
          <dt className={dtClass}>
            Registration fee:
          </dt>
          <dd className={ddClass}>
            ${tournament.registration_fee}
          </dd>
        </div>
        {early_registration}
        {late_fee_date}
        <div className={'row pb-2'}>
          <dt className={dtClass}>
            Registration deadline:
          </dt>
          <dd className={ddClass}>
            {tournament.registration_deadline}
          </dd>
        </div>
        <div className={'row'}>
          <dt className={dtClass}>
            Start date:
          </dt>
          <dd className={ddClass}>
            {tournament.start_date}
          </dd>
        </div>
      </dl>
    </div>
  );

  //////////////////////////////////////////////////////////

  let website = '';
  if (tournament.website) {
    website = (
      <p className={classes.WebsiteLink}>
        <a href={tournament.website}>
          Tournament website
          <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden="true"/>
        </a>
      </p>
    )
  }

  let registrationLink = '';
  let joinTeamLink = '';
  let soloRegistrationLink = '';
  if (tournament.state === 'testing' || tournament.state === 'active') {
    registrationLink = (
      <ListGroup.Item className={'text-primary'}
                      href={`${router.asPath}/new-team`}
                      action>
        Register a New Team
      </ListGroup.Item>
    );

    joinTeamLink = (
      <ListGroup.Item className={'text-primary'}
                      href={`${router.asPath}/join-a-team`}
                      action>
        Join an Existing Team
      </ListGroup.Item>
    );

    soloRegistrationLink = (
      <ListGroup.Item className={'text-primary'}
                      href={`${router.asPath}/solo-bowler`}
                      action>
        Register as a Solo Bowler
      </ListGroup.Item>
    );
  }

  const payFeeLink = (
    <a href={`${router.asPath}/teams`}
       className={''}>
      Choose Events &amp; Pay
    </a>
  );

  let testingEnvironment = '';
  if (tournament.state === 'testing') {
    testingEnvironment = (
      <div className={classes.TestingEnvironment}>
        <h3>Current test setup</h3>
        <dl>
          {Object.values(tournament.testing_environment.settings).map(setting => {
            return (
              <div key={setting.name} className="row">
                <dt className="col-4 text-end pe-1">
                  {setting.display_name}
                </dt>
                <dd className="col ps-1">
                  {setting.display_value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    );
  }

  const youWillNeed = (
    <div className={'border rounded-sm bg-light p-3'}>
      <h6>
        You will need the following information for each registered bowler:
      </h6>
      <ul className={'mb-1'}>
        <li>
          Names and contact information (email, phone, address)
        </li>
        <li>
          Birth dates (required for IGBO)
        </li>
        <li>
          USBC and IGBO identifiers
          <ul>
            <li>
              <a href={USBC_ID_LOOKUP_URL} target="_new">
                Find a USBC identifier
                <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden="true"/>
              </a>
            </li>
            <li>
              <a href={IGBO_ID_LOOKUP_URL} target="_new">
                Find an IGBO identifier
                <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden="true"/>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );

  return (
    <div className={classes.TournamentDetails}>
      <h2>
        {tournament.name} ({tournament.year})
      </h2>
      {website}
      {stateBanner}
      {testingEnvironment}

      {dates}

      {youWillNeed}

      <Row className={'mt-4'}>
        <Col md={6}>
          <Card>
            <Card.Header as={'h6'}>
              Registration Options
            </Card.Header>
            <ListGroup variant={'flush'}>
              {registrationLink}
              {joinTeamLink}
              {soloRegistrationLink}
            </ListGroup>
          </Card>
        </Col>
        <Col>
          <h6 className="my-2">
            Already registered?
          </h6>
          <ul>
            <li className={'my-2'}>
              {payFeeLink}
            </li>
          </ul>

          <h6 className="mt-4">
            Not an IGBO member yet?
          </h6>
          <ul>
            <li>
              <a href='https://reg.sportlomo.com/club/igbo/igboassociates'
                 target='_new'>
                Apply for Associate Membership
                <i className={classes.ExternalLink + " bi-box-arrow-up-right"} aria-hidden="true"/>
              </a>
            </li>
          </ul>

        </Col>
      </Row>
    </div>
  );
}

export default TournamentDetails;