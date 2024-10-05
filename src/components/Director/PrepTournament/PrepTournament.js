import classes from './PrepTournament.module.scss';

const PrepTournament = ({tournament, stateChanged}) => {

  return (
    <div className={classes.Tournament}>
      <div className={'row'}>
        {/* On small devices: one column.
            On devices medium-large (up to 1399px wide): two columns
            On XXL devices (>= 1400px wide): three columns.
            - column 3 has the least important stuff
        */}
        <div className={'col-12 col-md-6 col-xxl-4'}>
          {/* #1 */}
        </div>
        <div className={'col-12 col-md-6 col-xxl-4'}>
          {/* #2 */}
        </div>
        <div className={'col-12 col-md-6 col-xxl-4'}>
          {/* #3 */}
        </div>
        {/* Setup/Testing

    AQ toggles & configs
    Fee configs & add/remove
    PI configs & add/remove
    Contact configs & add
    Clear test data
    Test/Open registration

    */}
        {/* All tournaments

    Links with counts:
    - bowlers
    - teams (if applicable)
    - free entries (if any)
    Download buttons (CSVs, IGBO-TS, sign-in sheets)
    Toggles for registration options (solo, team)
    Configuration toggles
    Shift full/not toggle

     */}
      </div>
    </div>

  );
}

export default PrepTournament;
