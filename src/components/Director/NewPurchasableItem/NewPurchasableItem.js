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

const NewPurchasableItem = ({tournament}) => {
  const [formDisplayed, setFormDisplayed] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [availableLedgerTypes, setAvailableLedgerTypes] = useState([]);
  const [availableSanctionTypes, setAvailableSanctionTypes] = useState([]);
  const [eventSelection, setEventSelection] = useState(false);

  // Determine which types of ledger items can still be created
  useEffect(() => {
    if (!tournament) {
      return;
    }
    const eventSelectionEnabled = tournament.purchasable_items.some(pi => pi.determination === 'event');

    const allLedgerTypes = ['entry_fee', 'late_fee', 'early_discount'];
    let usedTypes = tournament.purchasable_items.filter(item => item.category === 'ledger').map(item => item.determination);
    let typesAvailable = [];
    allLedgerTypes.forEach(type => {
      if (eventSelectionEnabled || !usedTypes.includes(type)) {
        typesAvailable.push(type);
      }
    });

    if (eventSelectionEnabled) {
      typesAvailable.push('bundle_discount');
    }
    setEventSelection(eventSelectionEnabled);

    setAvailableLedgerTypes(typesAvailable);

    // const allSanctionTypes = ['igbo'];
    // usedTypes = tournament.purchasable_items.filter(item => item.category === 'sanction').map(item => item.determination);
    // typesAvailable = [];
    // allSanctionTypes.forEach(type => {
    //   if (eventSelectionEnabled || !usedTypes.includes(type)) {
    //     typesAvailable.push(type);
    //   }
    // });
    // setAvailableSanctionTypes(typesAvailable);
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
                 onClick={(event) => addClicked(event, 'sanction')}>
                Membership
              </a>
            </div>
            {eventSelection &&
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'event')}>
                Core Event
                </a>
              </div>
            }
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
                Bowling Extra
              </a>
            </div>
              <div className={`${classes.NewItemLink} flex-fill`}>
                <a href={'#'}
                   className={``}
                   onClick={(event) => addClicked(event, 'product')}>
                Product
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
                   onClick={(event) => addClicked(event, 'multi_use')}>
                Other
              </a>
            </div>
          </div>
        }

        {formDisplayed === 'ledger' && <LedgerForm tournament={tournament} availableTypes={availableLedgerTypes} onCancel={cancelClicked} onComplete={itemSaved} />}
        {formDisplayed === 'event' && <EventForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved} /> }
        {formDisplayed === 'division' && <DivisionForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved} />}
        {formDisplayed === 'single_use' && <SingleUseForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved} />}
        {formDisplayed === 'multi_use' && <MultiUseForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved} />}
        {formDisplayed === 'sanction' && <SanctionForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved} />}
        {formDisplayed === 'product' && <ProductForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved} />}
        {formDisplayed === 'apparel' && <ApparelItemForm tournament={tournament} onCancel={cancelClicked} onComplete={itemSaved} />}

      </div>
    </ErrorBoundary>
  )
}

export default NewPurchasableItem;
