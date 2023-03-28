import {useDirectorContext} from "../../../store/DirectorContext";
import classes from './SignInSheet.module.scss';

const SignInSheet = ({tournament, bowler, showPrintButton}) => {
  if (!bowler || !tournament) {
    return '';
  }

  let bowlerFirstName = bowler.first_name;
  if (bowler.preferred_name && bowler.preferred_name.length > 0) {
    bowlerFirstName = bowler.preferred_name;
  }

  return (
    <div className={classes.SignInSheetHtml}>
      <div className={'d-flex align-items-center justify-content-center pb-3 pt-4'}>
        <img className={`${classes.Logo} img-fluid`}
             src={tournament.image_url}
             alt={'Tournament logo'}/>
        <h2 className={'ps-2'}>
          {tournament.name} {tournament.year}
        </h2>
      </div>

      <div className={'d-flex justify-content-end py-3 border-top border-bottom border-1'}>
        <h3 className={'me-auto'}>
          {bowler.last_name}, {bowlerFirstName}
        </h3>
        {showPrintButton && (
          <button className={`${classes.PrintButton} btn btn-sm btn-outline-secondary`}
                  role={'button'}
                  onClick={() => window.print()}>
            <i className={'bi-printer pe-2'} aria-hidden={true} />
            Print
          </button>
        )}
      </div>

      <div className={'row py-3 border-bottom border-1'}>
        <div className={'col-6'}>
          <address className={classes.Address}>
            <span>
              {bowler.address1}
            </span>
            {bowler.address2 && <span>{bowler.address2}</span>}
            <span>
              {bowler.city}, {bowler.state}
            </span>
            <span>
              {bowler.postal_code}
            </span>
            <span>
              {bowler.country}
            </span>
          </address>

          {Object.values(bowler.additional_question_responses).map(r => (
            <div key={r.name}>
              {r.label}: {r.response}
            </div>
          ))}
        </div>

        <div className={'col-6'}>
          <div>
            Birthday: {bowler.birth_month} / {bowler.birth_day}
          </div>
          <div>
            Phone: {bowler.phone}
          </div>
          <div>
            Email: {bowler.email}
          </div>
          <div>
            USBC Number: {bowler.usbc_id}
          </div>
          <div className={'pt-2'}>
            IGBO Member:{' '}
            <strong>
              {bowler.igbo_member ? 'Yes' : 'No'}
            </strong>
          </div>
        </div>
      </div>

      <div className={`row py-3 border-bottom border-1`}>
        <div className={'col-5'}>
          <div className={'row'}>
            <div className={'col-8 text-end pe-2'}>
              Tournament Average
            </div>
            <div className={'col fw-bold'}>
              {bowler.verified_average}
            </div>
          </div>
          <div className={'row'}>
            <div className={'col-8 text-end pe-2'}>
              Tournament Handicap
            </div>
            <div className={'col fw-bold'}>
              {bowler.handicap}
            </div>
          </div>
        </div>
        <div className={'col-7'}>
          {bowler.team && (
            <div className={'row'}>
              <div className={'col-5 text-end pe-2'}>
                Team Name
              </div>
              <div className={'col fw-bold'}>
                {bowler.team.name}
              </div>
            </div>
          )}
          <div className={'row'}>
            <div className={'col-5 text-end pe-2'}>
              Doubles Partner
            </div>
            <div className={'col fw-bold'}>
              {!bowler.doubles_partner && 'n/a'}
              {bowler.doubles_partner && bowler.doubles_partner.full_name}
            </div>
          </div>
        </div>
      </div>

      <div className={`row py-3 border-bottom border-1`}>
        <p className={'lead'}>
          Events &amp; Purchases
        </p>
        <div className={'col-6'}>
          {bowler.purchases.map(p => {
            let note = false;
            if (p.configuration.division) {
              note = `Division ${p.configuration.division}`;
            } else if (p.configuration.denomination) {
              note = p.configuration.denomination;
            }
            return (
              <div className={'row'} key={p.identifier}>
                <div className={'col-8 text-end pe-2'}>
                  {p.name}
                  {note && <span className={classes.PurchaseNote}>{note}</span>}
                </div>
                <div className={'col fw-bold'}>
                  ${p.value}
                </div>
              </div>
            );
          })}
        </div>
        <div className={'col'}>
          <div className={'row'}>
            <div className={'col-8 text-end pe-2'}>
              Total charges
            </div>
            <div className={'col fw-bold'}>
              ${bowler.amount_billed}
            </div>
          </div>

          {bowler.free_entry && bowler.free_entry.confirmed && (
            <div className={'row my-2'}>
              <div className={'col-8 text-end pe-2'}>
                Free entry
                <span className={classes.PurchaseNote}>{bowler.free_entry.unique_code}</span>
              </div>
              <div className={'col fw-bold'}>
                ${bowler.ledger_entries.filter(le => le.source === 'free_entry').reduce((prev, curr) => prev + parseInt(curr.credit), 0)}
              </div>
            </div>
          )}

          <div className={'row my-2'}>
            <div className={'col-8 text-end pe-2'}>
              Total paid
            </div>
            <div className={'col fw-bold'}>
              ${bowler.amount_paid}
            </div>
          </div>

          <div className={'row pt-2'}>
            <div className={'col-8 text-end pe-2'}>
              Total outstanding
            </div>
            <div className={'col fw-bold'}>
              ${bowler.amount_due}
            </div>
          </div>
        </div>
      </div>

      <div className={`${classes.Agreement}`}>
        <div className={'row'}>
          <div className={`col-7 offset-5`}>
            <div className={classes.Signature}>
              <i className={'bi-x-lg'} aria-hidden={true}/>
            </div>
            <p className={`${classes.Acknowledgement} m-0 pt-2`}>
              I agree that the information contained on this sheet is correct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInSheet;
