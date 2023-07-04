import React, {useState, useEffect} from "react";

import ErrorBoundary from "../../common/ErrorBoundary";
import SuccessAlert from "../../common/SuccessAlert";
import LedgerForm from "./LedgerForm";
import DivisionForm from './DivisionForm';
import SingleUseForm from "./SingleUseForm";
import MultiUseForm from "./MultiUseForm";
import SanctionForm from "./SanctionForm";
import EventForm from "./EventForm";
import ProductForm from "./ProductForm";
import ApparelItemForm from "../ApparelItemForm/ApparelItemForm";
import BanquetForm from "./BanquetForm";
import RaffleForm from "./RaffleForm";
import {useTournament} from "../../../director";
import {devConsoleLog, updateObject} from "../../../utils";

import classes from './NewPurchasableItem.module.scss';

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
      component: LedgerForm,
      extraProps: {
        availableTypes: availableLedgerTypes,
      },
    },
    {
      key: 'event',
      label: 'Core Event',
      title: '',
      component: EventForm,
    },
    {
      key: 'division',
      label: 'Division Extra',
      title: `Something like Scratch Masters, with different prices per division`,
      component: DivisionForm,
    },
    {
      key: 'single_use',
      label: 'Bowling Extra (one-time)',
      title: '',
      component: SingleUseForm,
    },
    {
      key: 'multi_use',
      label: 'Bowling Extra (multi)',
      title: '',
      component: MultiUseForm,
    },
    {
      key: 'raffle',
      label: 'Raffle',
      title: '',
      component: RaffleForm,
    },
    {
      key: 'apparelItem',
      label: 'Apparel',
      title: '',
      component: ApparelItemForm,
    },
    {
      key: 'banquet',
      label: 'Banquet',
      title: '',
      component: BanquetForm,
    },
    {
      key: 'sanction',
      label: 'Membership',
      title: '',
      component: SanctionForm,
    },
    {
      key: 'product',
      label: 'Other',
      title: '',
      component: ProductForm,
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
          return React.createElement(details.component, {
            onCancel: cancelClicked,
            onComplete: itemSaved,
            key: details.key,
            ...details.extraProps,
          });
        })}

      </div>
    </ErrorBoundary>
  )
}

export default NewPurchasableItem;
