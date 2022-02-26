import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './TeamDetails.module.scss';

const teamDetails = ({successType}) => {
  const {entry} = useRegistrationContext();

  if (!entry.tournament || !entry.team) {
    return '';
  }

  let successBanner = '';
  if (successType) {
    let content = '';
    switch (successType) {
      case 'new_team':
        content = 'Your registration was received. Each bowler may now pay their fees and choose additional events.';
        break;
      case 'join':
        content = 'You have successfully joined this team! You may now pay your fees and choose additional events.';
        break;
      case 'solo':
        content = 'Your registration was received. You may now pay your fees and choose additional events.';
        break;
      default:
        break;
    }

    successBanner = (
      <div className={'alert alert-success'} role={'alert'}>
        <h5 className={'alert-heading'}>
          <i className={'bi-check-circle-fill pe-2'} aria-hidden={true} />
          Success!
        </h5>
        <p className={classes.SuccessMessage}>
          {content}
        </p>
      </div>
    );
  }

  let joinTeamText = '';
  // TODO: add support for joining a partial team from here.

  return (
    <div className={classes.TeamDetails}>
      {successBanner}
      <div className={'table-responsive'}>
        <table className={'table table-striped caption-top'}>
          <caption>{entry.team.name}</caption>
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              {/* conditionally display this? */}
              <th>Amount Due</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {entry.team.bowlers.map((b, i) => {
            let displayed_name = b.first_name;
            if (b.preferred_name) {
              displayed_name = b.preferred_name;
            }
            const name = displayed_name + ' ' + b.last_name;
            return (
              <tr key={i}>
                <td>{b.position}</td>
                <td>{name}</td>
                <td>{b.amount_due}</td>
                <td>(Choose Events &amp; Pay)</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default teamDetails;