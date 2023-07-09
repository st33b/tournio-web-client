// import classes from '';

import classes from "./TournamentDetails.module.scss";

const StateBanners = ({tournament}) => {
  /////////////////////////////////////////////////////
  // State banner, to indicate states other than active

  let stateHeader = false;
  let stateText = '';
  let stateIcon = '';
  let stateClasses = [classes.StateBanner, 'bg-opacity-25'];
  // TODO: Change these with Bootstrap 5.3, to either the subtle backgrounds, or something else for color modes
  switch (tournament.state) {
    case 'setup':
      stateHeader = 'This tournament is in setup mode.';
      stateText = 'Creating registrations in this state is not permitted.';
      stateIcon = <i className={'bi-bricks pe-3'} aria-hidden={true}/>
      stateClasses.push('bg-warning');
      break;
    case 'testing':
      stateHeader = 'This tournament is in testing mode.';
      stateText = 'You may create registrations and test the payment flow, but data is subject to deletion at any time.';
      stateIcon = <i className={'bi-tools pe-3'} aria-hidden={true}/>
      stateClasses.push('bg-info');
      break;
    case 'demo':
      stateHeader = 'This is a demonstration tournament.'
      stateText = 'You may create registrations and test the payment flow, but data is subject to deletion at any time.';
      stateClasses.push('bg-primary');
      stateIcon = <i className={'bi-clipboard2-check pe-3'} aria-hidden={true}/>
      break;
    case 'closed':
      stateHeader = 'Registration for this tournament has closed.';
      stateIcon = <i className={'bi-door-closed pe-3'} aria-hidden={true}/>
      stateClasses.push('bg-secondary');
      break;
    default:
      stateText = '';
      stateClasses = ['d-none'];
  }
  const stateBanner = (
    <div className={stateClasses.join(' ')}>
      <h4>
        {stateIcon}
        {stateHeader}
      </h4>
      <p className={'mb-0'}>
        {stateText}
      </p>
    </div>
  );

  //////////////////////////////////////////////////////////

  let testingEnvironment = '';
  if (tournament.state === 'testing' || tournament.state === 'demo') {
    testingEnvironment = (
      <div className={`${classes.TestingEnvironment} mb-3`}>
        <h4 className={'p-2 mb-0'}>
          <i className={'bi-search pe-3'} aria-hidden={true}/>
          {tournament.testing_environment.settings.registration_period.display_name}:{' '}
          <strong>
            {tournament.testing_environment.settings.registration_period.display_value}
          </strong>
        </h4>
      </div>
    );
  }

  return (
    <div>
      {stateHeader && stateBanner}
      {testingEnvironment}
    </div>
  );
}

export default StateBanners;
