import Card from 'react-bootstrap/Card';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

import PurchasableItemEditForm from "../PurchasableItemEditForm/PurchasableItemEditForm";
import NewPurchasableItem from "../NewPurchasableItem/NewPurchasableItem";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './TournamentInPrep.module.scss';

const PurchasableItems = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const ledgerItems = tournament.purchasable_items.filter(item => {
    return item.category === 'ledger'
  }).sort((left, right) => {
    const leftText = !!left.determination ? left.determination : '';
    const rightText = !!right.determination ? right.determination : '';
    return leftText.localeCompare(rightText);
  });

  const eventItems = tournament.purchasable_items.filter(({determination}) => determination === 'event').sort((left, right) => {
    return left.configuration.order - right.configuration.order;
  });

  // sort the division items by name and note
  const divisionItems = tournament.purchasable_items.filter(item => {
    return item.determination === 'single_use' && item.refinement === 'division';
  }).sort((left, right) => {
    const leftText = left.name + left.configuration.division;
    const rightText = right.name + right.configuration.division;
    return leftText.localeCompare(rightText);
  });

  const divisionGroups = new Map();
  divisionItems.forEach((item) => {
    const name = item.name;
    if (!divisionGroups.has(name)) {
      divisionGroups.set(name, []);
    }
    const currentSet = divisionGroups.get(name);
    divisionGroups.set(name, currentSet.concat(item));
  });

  const sortByOrder = (left, right) => {
    let leftOrder = left.configuration.order || 100;
    let rightOrder = right.configuration.order || 100;
    return leftOrder - rightOrder;
  }

  // sort the sanction items by their order
  const sanctionItems = tournament.purchasable_items.filter(item => {
    return item.category === 'sanction' && !item.refinement;
  }).sort(sortByOrder);

  // sort the single_use items by their order
  const singleUseItems = tournament.purchasable_items.filter(item => {
    return item.determination === 'single_use' && !item.refinement;
  }).sort(sortByOrder);

  // sort the multi-use items by their order
  const multiUseItems = tournament.purchasable_items.filter(item => {
    return item.determination === 'multi_use';
  }).sort(sortByOrder);

  // sort the product items by their order
  const products = tournament.purchasable_items.filter(item => {
    return item.category === 'product';
  }).sort(sortByOrder);

  const groupValues = [...divisionGroups.values()];

  return (
    <ErrorBoundary>
      <Card className={[classes.Card, classes.PurchasableItems].join(' ')}>
        <Card.Header as={'h5'} className={'fw-light'}>
          Fees and Events/Items
        </Card.Header>

        {(!tournament.stripe_account || !tournament.stripe_account.can_accept_payments) && (
          <Card.Body className={'text-muted text-center small'}>
            Payment Integration must be set up before adding fees or events/items.
          </Card.Body>
        )}

        {tournament.stripe_account && tournament.stripe_account.can_accept_payments && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {ledgerItems.length > 0 && (
              <Card.Body className={classes.Category}>
                {ledgerItems.map((item) => <PurchasableItemEditForm key={item.identifier} tournament={tournament} item={item}/>)}
              </Card.Body>
            )}

            {sanctionItems.length > 0 &&
              <Card.Body className={classes.Category}>
                {sanctionItems.map((item) => <PurchasableItemEditForm key={item.identifier} tournament={tournament} item={item}/>)}
              </Card.Body>
            }

            {eventItems.length > 0 && (
              <Card.Body className={classes.Category}>
                {eventItems.map(item => <PurchasableItemEditForm key={item.identifier} tournament={tournament} item={item}/>)}
              </Card.Body>
            )}

            {groupValues.map((group, index) => {
              return group.length > 0 && (
                <Card.Body key={index} className={classes.Category}>
                  {group.map((item) => <PurchasableItemEditForm key={item.identifier} tournament={tournament} item={item}/>)}
                </Card.Body>
              );
            })}

            {singleUseItems.length > 0 &&
              <Card.Body className={classes.Category}>
                {singleUseItems.map((item) => <PurchasableItemEditForm key={item.identifier} tournament={tournament} item={item}/>)}
              </Card.Body>
            }

            {multiUseItems.length > 0 &&
              <Card.Body className={classes.Category}>
                {multiUseItems.map((item) => <PurchasableItemEditForm key={item.identifier} tournament={tournament} item={item}/>)}
              </Card.Body>
            }

            {products.length > 0 &&
              <Card.Body className={classes.Category}>
                {products.map((item) => <PurchasableItemEditForm key={item.identifier} tournament={tournament} item={item}/>)}
              </Card.Body>
            }

            <Card.Body className={'p-0'}>
              <NewPurchasableItem tournament={tournament}/>
            </Card.Body>
          </LocalizationProvider>
        )}
      </Card>
    </ErrorBoundary>
  );
}

export default PurchasableItems;
