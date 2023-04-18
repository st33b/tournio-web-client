import classes from './TournamentDetails.module.scss';

const YouWillNeed = ({tournament}) => {
  const USBC_ID_LOOKUP_URL = 'https://webapps.bowl.com/USBCFindA/Home/Member';
  const IGBO_ID_LOOKUP_URL = 'https://tad.igbo.org/';

  if (!tournament) {
    return '';
  }

  if (!['testing', 'active', 'demo'].includes(tournament.state)) {
    return '';
  }

  return (
    <div className={classes.YouWillNeed}>
      <p className={'lead'}>
        For each bowler, you&apos;ll need:
      </p>
      <ul>
        <li>
          Names and contact information (email, phone, address)
        </li>
        <li>
          Birthdates (mm/dd)
        </li>
        <li>
          {/*USBC and IGBO identifiers*/}
          USBC ID
          {' '}&ndash;{' '}
          <a href={USBC_ID_LOOKUP_URL}
             target="_blank"
             rel={'noreferrer'}>
            look up a USBC identifier
            <i className={`${classes.ExternalLink} bi-box-arrow-up-right ps-2`} aria-hidden="true"/>
          </a>
        </li>
        <li>
          You may also need your{' '}
          <a href={IGBO_ID_LOOKUP_URL}
             target={'_blank'}
             rel={'noreferrer'}>
            IGBO TAD average
            <i className={`${classes.ExternalLink} bi-box-arrow-up-right ps-2`} aria-hidden="true"/>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default YouWillNeed;
