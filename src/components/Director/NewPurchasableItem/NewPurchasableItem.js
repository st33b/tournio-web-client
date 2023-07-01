import React, {useState, useEffect} from "react";
import {capitalize} from 'voca';

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
import {useTournament} from "../../../director";
import SuccessAlert from "../../common/SuccessAlert";
import {devConsoleLog, updateObject} from "../../../utils";

const NewPurchasableItem = () => {
  const {tournament, tournamentUpdatedQuietly} = useTournament();

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

  const addClicked = (event, formType) => {
    event.preventDefault();

    setFormDisplayed(formType);
  }

  const cancelClicked = () => {
    setFormDisplayed(null);
  }

  const itemSaved = (items) => {
    setSuccessMessage('Created.');
    setFormDisplayed(null);

    const updatedItems = tournament.purchasable_items.concat(items);
    const modifiedTournament = updateObject(tournament, {
        purchasable_items: updatedItems,
    });
    tournamentUpdatedQuietly(modifiedTournament);
  }

  if (!tournament) {
    return '';
  }

  const ITEM_TYPE_DETAILS = [
    {
      key: 'ledger',
      label: 'Fee/Discount',
      title: '',
    },
    {
      key: 'event',
      label: 'Core Event',
      title: '',
    },
    {
      key: 'division',
      label: 'Division Extra',
      title: `Something like Scratch Masters, with different prices per division`,
    },
    {
      key: 'single_use',
      label: 'Bowling Extra (one-time)',
      title: '',
    },
    {
      key: 'multi_use',
      label: 'Bowling Extra (multi)',
      title: '',
    },
    {
      key: 'raffle',
      label: 'Raffle',
      title: '',
    },
    {
      key: 'apparel',
      label: 'Apparel',
      title: '',
      form: ApparelItemForm,
    },
    {
      key: 'banquet',
      label: 'Banquet',
      title: '',
    },
    {
      key: 'sanction',
      label: 'Membership',
      title: '',
    },
    {
      key: 'product',
      label: 'Other',
      title: '',
    },
  ]

  const allowCreate = tournament.state !== 'active';

  const outerClass = formDisplayed ? classes.FormDisplayed : '';
  return (
    <ErrorBoundary>
      <div className={`${classes.NewPurchasableItem} ${outerClass}`}>
        <SuccessAlert message={successMessage}
                      className={`m-3`}
                      onClose={() => setSuccessMessage(null)}
        />

        {!formDisplayed && allowCreate &&
          <div>
            <h6 className={`fw-light mb-0`}>
              Create a new thing:
            </h6>
            <div className={`d-flex flex-wrap`}>
              {ITEM_TYPE_DETAILS.map(pair => {
                if (pair.key === 'ledger' && availableLedgerTypes.length === 0) {
                  return '';
                }
                return (
                  <div className={`${classes.NewItemLink} flex-fill`} key={`${pair.key}_link`}>
                    <a href={'#'}
                       className={``}
                       title={pair.title}
                       onClick={(e) => addClicked(e, pair.key)}>
                      {pair.label}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        }

        {ITEM_TYPE_DETAILS.map(details => {
          if (formDisplayed !== details.key) {
            return '';
          }
          const formPrefix = details.form ? details.form : capitalize(details.key)
          const componentName = `${formPrefix}Form`;
          return React.createElement(componentName, {
            onCancel: cancelClicked,
            onComplete: itemSaved,
            tournament: tournament,
            key: details.key,
          });
        })}
        {formDisplayed === 'ledger' &&
          <LedgerForm availableTypes={availableLedgerTypes} onCancel={cancelClicked}
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
