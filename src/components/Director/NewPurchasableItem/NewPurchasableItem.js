import {useState, useEffect} from "react";

import ErrorBoundary from "../../common/ErrorBoundary";
import LedgerForm from "./LedgerForm";
import DivisionForm from './DivisionForm';
import SingleUseForm from "./SingleUseForm";
import MultiUseForm from "./MultiUseForm";
import SanctionForm from "./SanctionForm";

import classes from './NewPurchasableItem.module.scss';
import EventForm from "./EventForm";
import ProductForm from "./ProductForm";
import ApparelItemForm from "../ApparelItemForm/ApparelItemForm";
import BanquetForm from "./BanquetForm";
import RaffleForm from "./RaffleForm";

const NewPurchasableItem = ({tournament}) => {
  const [formDisplayed, setFormDisplayed] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [availableLedgerTypes, setAvailableLedgerTypes] = useState([]);

  // Determine which types of ledger items can still be created
  useEffect(() => {
    if (!tournament) {
      return;
    }

    const allLedgerTypes = ['entry_fee', 'late_fee', 'early_discount'];
    let typesAvailable = ['bundle_discount'].concat(allLedgerTypes);

    //
    // Let's see if we can not impose rules here, to keep things simple.
    //
    // let usedTypes = tournament.purchasable_items.filter(item => item.category === 'ledger').map(item => item.determination);
    // let typesAvailable = ['bundle_discount'];
    // allLedgerTypes.forEach(type => {
    //   if (!usedTypes.includes(type)) {
    //     typesAvailable.push(type);
    //   }
    // });

    setAvailableLedgerTypes(typesAvailable);
  }, [tournament]);

  if (!tournament) {
    return '';
  }

  const allowCreate = tournament.state !== 'active';

  const addClicked = (event, formType) => {
    event.preventDefault();
    // Just in case
    if (formType === 'ledger' && availableLedgerTypes.length === 0) {
      return;
    }
    setFormDisplayed(formType);
  }

  const cancelClicked = () => {
    setFormDisplayed(null);
  }

  const itemSaved = (message) => {
    setSuccessMessage(message);
    setFormDisplayed(null);
  }

  const outerClass = formDisplayed ? classes.FormDisplayed : '';
  return (
    <ErrorBoundary>
      <div className={`${classes.NewPurchasableItem} ${outerClass}`}>
        {successMessage && (
          <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center m-3'}
               role={'alert'}>
            <i className={'bi-check2-circle pe-2'} aria-hidden={true}/>
            <div className={'me-auto'}>
              {successMessage}
              <button type="button"
                      className={"btn-close"}
                      data-bs-dismiss="alert"
                      onClick={() => setSuccessMessage(null)}
                      aria-label="Close"/>
            </div>
          </div>
        )}

        {!formDisplayed && allowCreate &&
          <div>
            <h6 className={`fw-light mb-0`}>
              Create a new thing:
            </h6>
            <div className={`d-flex flex-wrap`}>
              {availableLedgerTypes.length > 0 &&
                <div className={`${classes.NewItemLink} flex-fill`}>
                  <a href={'#'}
                     className={``}
                     onClick={(event) => addClicked(event, 'ledger')}>
                    Fee/Discount
                  </a>
                </div>
              }
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'event')}>
                  Core Event
                </a>
              </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   title={`Something like Scratch Masters`}
                   onClick={(event) => addClicked(event, 'division')}>
                  Division Extra
                </a>
              </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'single_use')}>
                  Bowling Extra (one-time)
                </a>
              </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'multi_use')}>
                  Bowling Extra (multi)
                </a>
              </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'raffle')}>
                  Raffle
                </a>
              </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'apparel')}>
                  Apparel
                </a>
              </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'banquet')}>
                  Banquet
                </a>
              </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'sanction')}>
                  Membership
                </a>
              </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'product')}>
                  Other
                </a>
              </div>
            </div>
          </div>
        }

        {formDisplayed === 'ledger' &&
          <LedgerForm tournament={tournament} availableTypes={availableLedgerTypes} onCancel={cancelClicked}
                      onComplete={itemSaved}/>}
        {formDisplayed === 'event' &&
          <EventForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}
        {formDisplayed === 'division' &&
          <DivisionForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}
        {formDisplayed === 'single_use' &&
          <SingleUseForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}
        {formDisplayed === 'multi_use' &&
          <MultiUseForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}
        {formDisplayed === 'sanction' &&
          <SanctionForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}
        {formDisplayed === 'product' &&
          <ProductForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}
        {formDisplayed === 'apparel' &&
          <ApparelItemForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}
        {formDisplayed === 'banquet' &&
          <BanquetForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}
        {formDisplayed === 'raffle' &&
          <RaffleForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved}/>}

      </div>
    </ErrorBoundary>
  )
}

export default NewPurchasableItem;
