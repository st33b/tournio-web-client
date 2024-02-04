import classes from './SignInSheet.module.scss';
import TournamentLogo from "../../Registration/TournamentLogo/TournamentLogo";
import {devConsoleLog} from "../../../utils";

const SignInSheet = ({bowler, tournament, showPrintButton}) => {
  if (!bowler || !tournament) {
    return '';
  }

  const countsByItemID = {};
  if (bowler.purchases) {
    bowler.purchases.forEach(p => {
      const piId = p.purchasable_item_identifier;
      if (!countsByItemID[piId]) {
        countsByItemID[piId] = 0;
      }
      countsByItemID[piId] += 1;
    });
  }

  return (
    <div className={`${classes.SignInSheetHtml} d-flex flex-column vh-100`}>
      <div className={'d-flex align-items-center justify-content-center'}>
        <TournamentLogo url={tournament.imageUrl} additionalClasses={classes.Logo}/>
        <h2 className={'ps-2'}>
          {tournament.name} {tournament.year}
        </h2>
      </div>

      <div className={'d-flex justify-content-end pt-3 pb-2 border-bottom border-1'}>
        <h3 className={'me-auto'}>
          {bowler.listName}
        </h3>
        {showPrintButton && (
          <button className={`${classes.PrintButton} btn btn-sm btn-outline-secondary`}
                  role={'button'}
                  onClick={() => window.print()}>
            <i className={'bi-printer pe-2'} aria-hidden={true}/>
            Print
          </button>
        )}
      </div>

      <div className={'row py-3 border-bottom border-1'}>
        {bowler.address1 && (
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
          </div>
        )}

        <div className={'col-6'}>
          {bowler.birth_month > 0 && (
            <div>
              Date of Birth: {bowler.birth_month} / {bowler.birth_day} / {bowler.birth_year}
            </div>
          )}
          <div>
            Phone: {bowler.phone}
          </div>
          <div>
            Email: {bowler.email}
          </div>
          <div>
            USBC Number: {bowler.usbcId}
          </div>
          <div className={'pt-2'}>
            IGBO Member:{' '}
            <strong>
              {bowler.igboMember ? 'Yes' : 'No'}
            </strong>
          </div>
        </div>

        <div className={'col-6'}>
          {bowler.additionalQuestionResponses && Object.values(bowler.additionalQuestionResponses).map(r => (
            <div key={r.name}>
              {r.label}: <strong>{r.response}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className={`row g-0 py-3 border-bottom border-1`}>
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

      <div className={`row g-0`}>
        <div className={`col-7`}>
          <h4>
            Fees/Discounts
          </h4>

          {/* Entry fee, late fees, early discount, (later: event fees, bundle discount) */}
          {tournament.purchasableItems.filter(pi => pi.category === 'ledger').map(pi => {
            // only if the bowler has a purchase for this PI
            const purchase = bowler.purchases.find(p => p.purchasableItem.identifier === pi.identifier);
            if (purchase) {
              return (
                <div className={`row d-flex flex-wrap`} key={pi.identifier}>
                  <p className={`col-6`}>
                    {pi.name}
                  </p>
                  <p className={`col-2 text-end`}>
                    {pi.determination === 'early_discount' ? '–' : ''}
                    ${pi.value}
                  </p>
                </div>
              );
            }
          })}

          <h4>
            Bowling Extras
          </h4>

          <table className={`table table-sm table-borderless align-middle ${classes.PurchasesTable}`}>
            <tbody>

            {/* Division items first */}
            {tournament.purchasableItems.filter(pi => pi.refinement === 'division').map(pi => {
              // only if the bowler has a purchase for this PI
              const purchase = bowler.purchases.find(p => p.purchasableItem.identifier === pi.identifier);
              const signup = bowler.signups.find(s => s.purchasableItem.identifier === pi.identifier);
              const signedUp = ['requested', 'paid'].includes(signup.status);
              const deactivated = signup.status === 'inactive';

              return (
                <tr className={``} key={pi.identifier}>
                  <td className={`${classes.SignedUp}`}>
                    {signedUp ? <i className={`bi bi-check2-square`}></i> : ''}
                    {!signedUp && !deactivated ? <i className={`bi bi-square`}></i> : '' }
                    {deactivated && <i className={`bi bi-x`}></i>}
                  </td>
                  <td className={``}>
                    <p className={`mb-0`}>
                      {pi.name}
                    </p>
                    <p className={`ps-1 mb-0 fst-italic small`}>
                      Division: {pi.configuration.division}
                    </p>
                  </td>
                  <td className={`text-end pe-1`}>
                    ${pi.value}
                  </td>
                  {!!purchase && (
                    <td className={`text-end ${classes.AmountBox} ${classes.PaidAmount}`}>
                      ${pi.value}
                    </td>
                  )}
                  {!purchase && (
                    <td className={`text-end border border-1 ${classes.AmountBox}`}>
                    </td>
                  )}
                </tr>
              );
            })}

          {/* Non-division items, single-use */}
          {tournament.purchasableItems.filter(pi => pi.category === 'bowling' && pi.determination === 'single_use' && pi.refinement !== 'division').map(pi => {
            // only if the bowler has a purchase for this PI
            const purchase = bowler.purchases.find(p => p.purchasableItem.identifier === pi.identifier);
            const signup = bowler.signups.find(s => s.purchasableItem.identifier === pi.identifier);
            const signedUp = ['requested', 'paid'].includes(signup.status);

            return (
              <tr className={``} key={pi.identifier}>
                <td className={`${classes.SignedUp}`}>
                  {signedUp ? <i className={`bi bi-check2-square`}></i> : ''}
                  {!signedUp ? <i className={`bi bi-square`}></i> : '' }
                </td>
                <td className={``}>
                  <p className={`mb-0`}>
                    {pi.name}
                  </p>
                  <p className={`ps-1 mb-0 fst-italic small`}>
                    Division: {pi.configuration.division}
                  </p>
                </td>
                <td className={`text-end pe-1`}>
                  ${pi.value}
                </td>
                {!!purchase && (
                  <td className={`text-end ${classes.AmountBox} ${classes.PaidAmount}`}>
                    ${pi.value}
                  </td>
                )}
                {!purchase && (
                  <td className={`text-end border border-1 ${classes.AmountBox}`}>
                  </td>
                )}
              </tr>
            );
          })}

          {/* Non-division items, multi-use */}
            {tournament.purchasableItems.filter(pi => pi.category === 'bowling' && pi.determination === 'multi_use').map(pi => {
              // only if the bowler has a purchase for this PI
              const purchase = bowler.purchases.find(p => p.purchasableItem.identifier === pi.identifier);
              const signup = bowler.signups.find(s => s.purchasableItem.identifier === pi.identifier);
              const signedUp = ['requested', 'paid'].includes(signup.status);

              return (
                <tr className={``} key={pi.identifier}>
                  <td className={`${classes.SignedUp}`}>
                    {signedUp ? <i className={`bi bi-check2-square`}></i> : ''}
                    {!signedUp ? <i className={`bi bi-square`}></i> : '' }
                  </td>
                  <td className={``}>
                    <p className={`mb-0`}>
                      {pi.name}
                    </p>
                    <p className={`ps-1 mb-0 fst-italic small`}>
                      Division: {pi.configuration.division}
                    </p>
                  </td>
                  <td className={`text-end pe-1`}>
                    ${pi.value}
                  </td>

                  {!!purchase && (
                    <td className={`text-end ${classes.AmountBox} ${classes.PaidAmount}`}>
                      ${pi.value}
                    </td>
                  )}
                  {!purchase && (
                    <td className={`text-end border border-1 ${classes.AmountBox}`}>
                    </td>
                  )}
                </tr>
              );
            })}

            </tbody>
          </table>

          <h4>
            Other Extras
          </h4>

          {/* Non-bowling items (for apparel: only pre-purchased ones, not the whole catalog) */}

        </div>

        <div className={`col-5`}>
          <table className={`table table-borderless ${classes.TotalsTable}`}>
            <tbody>
            <tr>
              <td>
                Lorem ipsum
              </td>
              <td className={`${classes.Amount}`}>
                $125
              </td>
            </tr>
            <tr>
              <td>
                Lorem ipsum
              </td>
              <td className={`${classes.Amount} border`}>

              </td>
            </tr>
            </tbody>
          </table>
          {/* Total charges */}
          {/*  Pre-paid*/}
          {/*  Outstanding charges*/}
          {/*  Charges at Registration*/}
          {/*  Total due at Registration*/}
        </div>
      </div>

      {/*<div className={`row g-0 py-3 border-bottom border-1`}>*/}
      {/*  <h4>*/}
      {/*    Fees &amp; Extras*/}
      {/*  </h4>*/}
      {/*  <div className={'col-6'}>*/}
      {/*    {bowler.purchases && bowler.purchases.map(p => {*/}
      {/*      const purchasableItem = tournament.purchasable_items.find(({identifier}) => identifier === p.purchasable_item_identifier);*/}
      {/*      const quantity = countsByItemID[p.purchasable_item_identifier];*/}
      {/*      if (quantity === 0) {*/}
      {/*        return '';*/}
      {/*      }*/}
      {/*      const multiplier = quantity === 1 ? '' : (*/}
      {/*        <span>*/}
      {/*          <i className={'bi-x px-1'} aria-hidden={true}/>*/}
      {/*          {quantity}*/}
      {/*          <span className={'visually-hidden'}>*/}
      {/*            purchased*/}
      {/*          </span>*/}
      {/*        </span>*/}
      {/*      );*/}
      {/*      countsByItemID[p.purchasable_item_identifier] = 0;*/}
      {/*      let note = false;*/}
      {/*      if (purchasableItem.configuration.division) {*/}
      {/*        note = `Division ${purchasableItem.configuration.division}`;*/}
      {/*      } else if (purchasableItem.configuration.denomination) {*/}
      {/*        note = purchasableItem.configuration.denomination;*/}
      {/*      }*/}
      {/*      return (*/}
      {/*        <div className={'row'} key={p.identifier}>*/}
      {/*          <div className={'col-8 text-end pe-2'}>*/}
      {/*            {purchasableItem.name}*/}
      {/*            {note && <span className={classes.PurchaseNote}>{note}</span>}*/}
      {/*          </div>*/}
      {/*          <div className={'col fw-bold'}>*/}
      {/*            ${purchasableItem.value}*/}
      {/*            {multiplier}*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </div>*/}
      {/*  <div className={'col'}>*/}
      {/*    {bowler.free_entry && bowler.free_entry.confirmed && (*/}
      {/*      <div className={'row my-2'}>*/}
      {/*        <div className={'col-8 text-end pe-2'}>*/}
      {/*          Free entry*/}
      {/*          <span className={classes.PurchaseNote}>{bowler.free_entry.unique_code}</span>*/}
      {/*        </div>*/}
      {/*        <div className={'col fw-bold'}>*/}
      {/*          ${entryFeeItem.value}*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    )}*/}

      {/*    <div className={'row my-2'}>*/}
      {/*      <div className={'col-8 text-end pe-2'}>*/}
      {/*        Total prepaid*/}
      {/*      </div>*/}
      {/*      <div className={'col fw-bold'}>*/}
      {/*        ${bowler.amount_paid}*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    <div className={'row pt-2'}>*/}
      {/*      <div className={'col-8 text-end pe-2'}>*/}
      {/*        Total due at registration*/}
      {/*      </div>*/}
      {/*      <div className={'col fw-bold'}>*/}
      {/*        ${bowler.amount_due}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className={`${classes.Agreement} mt-auto`}>
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
