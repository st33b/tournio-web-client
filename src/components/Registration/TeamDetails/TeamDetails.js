import classes from './TeamDetails.module.scss';
import Link from "next/link";

const TeamDetails = ({tournament, team, successType, context}) => {
  if (!tournament || !team) {
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
      <div className={'alert alert-success p-2 mt-2 mt-md-0'} role={'alert'}>
        <h5 className={'alert-heading'}>
          <i className={'bi-check-circle-fill pe-2'} aria-hidden={true}/>
          Success!
        </h5>
        <p className={classes.SuccessMessage}>
          {content}
        </p>
      </div>
    );
  }

  return (
    <div className={classes.TeamDetails}>
      {successBanner}
      <h3 className={`text-center`}>
        Team: {team.name}
      </h3>
      {team.bowlers.length > 0 && (
        <div className={'table-responsive'}>
          <table className={'table table-striped caption-top'}>
            <thead>
            <tr className={'align-middle'}>
              <th><span className={'d-none d-sm-block'}>Position</span></th>
              <th>Name</th>
              <th>Doubles Partner</th>
            </tr>
            </thead>
            <tbody>
            {team.bowlers.map((b, i) => {
              return (
                <tr key={i}>
                  <td>{b.position}</td>
                  <td>
                    <Link href={`/bowlers/${b.identifier}`}>
                      {b.full_name}
                    </Link>
                  </td>
                  <td>{b.doubles_partner_name}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      )}
      {team.bowlers.length === 0 && context !== 'join' && (
        <h5 className={'text-center'}>
          No bowlers to display.
        </h5>
      )}
    </div>
  );
}

export default TeamDetails;
