import {useRouter} from "next/router";
import {Card, Col, ListGroup, Row, ProgressBar} from "react-bootstrap";
import {format} from "date-fns";

import LoadingMessage from "../../ui/LoadingMessage/LoadingMessage";
import ShiftCapacity from "../../common/ShiftCapacity/ShiftCapacity";
import ProgressBarLegend from "../../common/ShiftCapacity/ProgressBarLegend";
import Details from "./Details";

import classes from './TournamentDetails.module.scss';

const USBC_ID_LOOKUP_URL = 'https://webapps.bowl.com/USBCFindA/Home/Member';
const IGBO_ID_LOOKUP_URL = 'http://igbo.org/tournaments/igbots-id-lookup/';

const TournamentDetails = ({tournament}) => {
  const router = useRouter();

  if (!tournament) {
    return <LoadingMessage message={'Retrieving tournament details...'}/>;
  }

  /////////////////////////////////////////////////////
  // State banner, to indicate states other than active

  let stateHeader = '';
  let stateText = '';
  let stateIcon = '';
  let stateClasses = ['alert'];
  switch (tournament.state) {
    case 'setup':
      stateHeader = 'This tournament is in setup mode.';
      stateText = 'Creating registrations in this state is not permitted.';
      stateIcon = <i className={'bi-bricks pe-3'} aria-hidden={true}/>
      stateClasses.push('alert-warning');
      break;
    case 'testing':
      stateHeader = 'This tournament is in testing mode.';
      stateText = 'You may create registrations and test the payment flow, but data is subject to deletion at any time.';
      stateIcon = <i className={'bi-tools pe-3'} aria-hidden={true}/>
      stateClasses.push('alert-info');
      break;
    case 'demo':
      stateHeader = 'This is a demonstration tournament.'
      stateText = 'You may create registrations and test the payment flow, but data is subject to deletion at any time.';
      stateClasses.push('alert-primary');
      stateIcon = <i className={'bi-clipboard2-check pe-3'} aria-hidden={true}/>
      break;
    case 'closed':
      stateHeader = 'Registration for this tournament has closed.';
      stateIcon = <i className={'bi-door-closed pe-3'} aria-hidden={true}/>
      stateClasses.push('alert-dark');
      break;
    default:
      stateText = '';
      stateClasses = ['d-none'];
  }
  const stateBanner = (
    <div className={stateClasses.join(' ')}>
      <h2 className={'alert-heading'}>
        {stateIcon}
        {stateHeader}
      </h2>
      <p className={'mb-0'}>
        {stateText}
      </p>
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

  let registrationSection = '';
  if (tournament.state === 'testing' || tournament.state === 'active' || tournament.state === 'demo') {
    const shift = tournament.shifts[0];
    const optionTypes = [
      {
        name: 'solo',
        path: 'solo-bowler',
        linkText: 'Register as a Solo Bowler',
      },
      {
        name: 'join_team',
        path: 'join-a-team',
        linkText: 'Join an Existing Team',
      },
      {
        name: 'new_team',
        path: 'new-team',
        linkText: 'Register a New Team',
      },
      {
        name: 'partner',
        path: 'partner-up',
        linkText: 'Partner Up With Someone',
      },
      {
        name: 'new_pair',
        path: 'new-pair',
        linkText: 'Register a Pair of Bowlers',
      },
    ]
    // const eventSelectionEnabled = tournament.purchasable_items.some(item => item.determination === 'event');
    const eventSelectionEnabled = false;
    let registrationOptions = '';
    if (eventSelectionEnabled) {
      // only show what's enabled
      registrationOptions = optionTypes.map(({name, path, linkText}) => {
        if (!shift.registration_types[name]) {
          return '';
        }
        return (
          <ListGroup.Item key={name}
                          className={'text-primary'}
                          href={`${router.asPath}/${path}`}
                          action>
            {linkText}
          </ListGroup.Item>
        );
      });
    } else {
      // show the standard ways, striking them out if disabled
      registrationOptions = optionTypes.map(({name, path, linkText}) => {
        // partnering and a new pair aren't part of a standard tournament
        if (name === 'partner' || name === 'new_pair') {
          return '';
        }
        const className = shift.registration_types[name] ? 'link-primary' : 'text-decoration-line-through';
        const enableLink = shift.registration_types[name];
        return (
          <ListGroup.Item key={name}
                          className={className}
                          href={enableLink ? `${router.asPath}/${path}` : undefined}
                          disabled={!enableLink}
                          action={enableLink}>
            {linkText}
          </ListGroup.Item>
        );
      });
    }
    registrationSection = (
      <Col md={6}>
        <Card>
          <Card.Header as={'h6'}>
            Registration Options
          </Card.Header>
          <ListGroup variant={'flush'}>
            {registrationOptions}
          </ListGroup>
        </Card>
      </Col>
    );
  }

  const payFeeLink = (
    <a href={`${router.asPath}/bowlers`}
       className={''}>
      Choose Events &amp; Pay
    </a>
  );

  let testingEnvironment = '';
  if (tournament.state === 'testing' || tournament.state === 'demo') {
    testingEnvironment = (
      <div className={`${classes.TestingEnvironment} p-2 mb-3`}>
        <h3>Current environment setup</h3>
        <dl className={'mt-2 mb-0 mx-0'}>
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

  let youWillNeed = <hr/>;
  if (tournament.state === 'testing' || tournament.state === 'active' || tournament.state === 'demo') {
    youWillNeed = (
      <div className={'p-3'}>
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
            {/*USBC and IGBO identifiers*/}
            USBC ID
            {' '}&ndash;{' '}
            <a href={USBC_ID_LOOKUP_URL} target="_new">
              find a USBC identifier
              <i className={`${classes.ExternalLink} bi-box-arrow-up-right ps-2`} aria-hidden="true"/>
            </a>
            {/*<ul>*/}
            {/*  <li>*/}
            {/*    <a href={USBC_ID_LOOKUP_URL} target="_new">*/}
            {/*      Find a USBC identifier*/}
            {/*      <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden="true"/>*/}
            {/*    </a>*/}
            {/*  </li>*/}
            {/*  <li>*/}
            {/*    <a href={IGBO_ID_LOOKUP_URL} target="_new">*/}
            {/*      Find an IGBO identifier*/}
            {/*      <i className={`${classes.ExternalLink} bi-box-arrow-up-right`} aria-hidden="true"/>*/}
            {/*    </a>*/}
            {/*  </li>*/}
            {/*</ul>*/}
          </li>
        </ul>
      </div>
    );
  }

  let shiftContent = '';
  const displayCapacity = tournament.display_capacity;
  if (tournament.shifts.length > 1) {
    shiftContent = (
      <div className={`${classes.Shifts} my-3 border rounded-sm p-2 p-sm-3`}>
        <h4 className={'fw-light'}>
          Shift Days/Times
        </h4>
        {tournament.shifts.map((shift, i) => {
          const requestedCount = Math.min(shift.requested_count, shift.capacity - shift.confirmed_count);
          return (
            <div key={i} className={`${classes.ShiftInfo} border rounded-sm p-2 p-sm-3 mb-2 mb-sm-3`}>
              <div className={'row'}>
                <div className={'col-12 col-sm-4'}>
                  <h5>
                    {shift.name}
                  </h5>
                  <p>
                    Capacity: {shift.capacity} bowlers / {shift.capacity / 4} teams
                  </p>
                </div>
                <div className={'col'}>
                  <table className={'table table-sm table-bordered mb-0'}>
                    <thead>
                    <tr>
                      <th>
                        Event
                      </th>
                      <th>
                        Day
                      </th>
                      <th>
                        Time
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {shift.events.map((event, j) => (
                      <tr key={j}>
                        <td>
                          {event.event}
                        </td>
                        <td>
                          {event.day}
                        </td>
                        <td>
                          {event.time}
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {displayCapacity && <ShiftCapacity shift={shift} key={i} />}
            </div>
          )
        })}

        {displayCapacity && <ProgressBarLegend/>}
      </div>
    );
  } else if (tournament.shifts.length === 1) {
    const shift = tournament.shifts[0];
    const requestedCount = Math.min(shift.requested_count, shift.capacity - shift.confirmed_count);
    shiftContent = displayCapacity && (
      <div className={`${classes.ShiftInfo} my-3 border rounded-sm p-2 p-sm-3`}>
        <div>
          <h5 className={'fw-light'}>
            Capacity
          </h5>
          <p>
            The tournament can accommodate up to {shift.capacity} bowlers.
          </p>

          <ShiftCapacity shift={shift} />
        </div>
        <ProgressBarLegend/>
      </div>
    );
  }

  /*
   * @hack To get dates to seem like they're behaving. But they're actually not.
   * @todo Use a JS library for date/time handling that can properly distinguish dates from timestamps
   */
  const start = new Date(`${tournament.start_date}T12:00:00-04:00`);
  const end = new Date(`${tournament.end_date}T12:00:00-04:00`);
  const startMonth = format(start, 'LLLL');
  const endMonth = format(end, 'LLLL');
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  const startDisplayYear = startYear === endYear ? '' : `, ${startYear}`;
  const endDisplayYear = endYear;
  let datesString = '';
  if (startMonth === endMonth) {
    datesString = `${startMonth} ${start.getDate()}${startDisplayYear}-${end.getDate()}, ${endDisplayYear}`;
  } else {
    datesString = `${startMonth} ${start.getDate()}${startDisplayYear}-${endMonth} ${end.getDate()}, ${endDisplayYear}`;
  }

  return (
    <div className={classes.TournamentDetails}>
      <h2 className={'mb-3'}>
        {tournament.name}
      </h2>
      <h5 className={'fst-italic'}>
        {datesString}
      </h5>
      {website}
      {stateBanner}
      {testingEnvironment}

      <Details tournament={tournament}/>

      {shiftContent}

      {youWillNeed}

      <Row className={'mt-3'}>
        {registrationSection}
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