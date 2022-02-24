import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './TeamDetails.module.scss';
import {Row} from "react-bootstrap";

const teamDetails = ({successType}) => {
  const router = useRouter();
  const {entry} = useRegistrationContext();

  if (!entry.tournament || !entry.team) {
    return '';
  }

  let successBanner = '';
  if (successType) {
    let content = '';
    if (successType === 'new_team') {
      content = (
        <p className={classes.SuccessMessage}>
          Your registration was received. Each bowler may now pay their fees and choose additional events.
        </p>
      );
    }

    successBanner = (
      <div className={'alert alert-success'} role={'alert'}>
        <h5 className={'alert-heading'}>
          <i className={'bi-check-circle-fill pe-2'} aria-hidden={true} />
          Success!
        </h5>
        {content}
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