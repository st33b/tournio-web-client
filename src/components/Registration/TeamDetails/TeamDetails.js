import {useCommerceContext} from "../../../store/CommerceContext";

import classes from './TeamDetails.module.scss';

const TeamDetails = ({tournament, team, successType, enablePayment = true}) => {
  const {commerce} = useCommerceContext();

  if (!tournament || !team) {
    return '';
  }

  if (!commerce) {
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

  return (
    <div className={classes.TeamDetails}>
      {successBanner}
      <div className={'table-responsive'}>
        <table className={'table table-striped caption-top'}>
          <caption>Team: {team.name}</caption>
          <thead>
            <tr className={'align-middle'}>
              <th><span className={'d-none d-sm-block'}>Position</span></th>
              <th>Name</th>
              {/* conditionally display this? */}
              <th>Amount Due</th>
              {enablePayment && <th></th>}
            </tr>
          </thead>
          <tbody>
          {team.bowlers.map((b, i) => {
            let displayed_name = b.first_name;
            if (b.preferred_name) {
              displayed_name = b.preferred_name;
            }
            const name = displayed_name + ' ' + b.last_name;

            // We might've come here from the checkout page, in which case that amount_due
            // is more up-to-date than the one on the team object.
            let amountDue = b.amount_due;
            if (commerce.bowler && commerce.bowler.identifier === b.identifier) {
              amountDue = commerce.bowler.amount_due;
            }
            return (
              <tr key={i}>
                <td>{b.position}</td>
                <td>{name}</td>
                <td>${amountDue}</td>
                {enablePayment && (
                  <td>
                    <a href={`/bowlers/${b.identifier}`}
                       className={'btn btn-sm btn-secondary'}>
                      Choose Events &amp; Pay
                    </a>
                  </td>
                )}
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamDetails;