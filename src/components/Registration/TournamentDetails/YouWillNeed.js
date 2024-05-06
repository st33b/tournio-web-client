import classes from './TournamentDetails.module.scss';

const YouWillNeed = () => {
  const USBC_ID_LOOKUP_URL = 'https://webapps.bowl.com/USBCFindA/Home/Member';
  const IGBO_ID_LOOKUP_URL = 'https://tad.igbo.org/';

  return (
    <div className={classes.YouWillNeed}>
      <p className={'lead'}>
        For each bowler, you may need:
      </p>
      <ul>
        <li>
          Names and contact information (email, phone, address)
        </li>
        <li>
          Birthdates (mm/dd/yyyy)
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
