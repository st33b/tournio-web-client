import Card from 'react-bootstrap/Card';
import {format} from 'date-fns';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import classes from './TournamentDetails.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";
import PurchasableItemEditForm from "../PurchasableItemEditForm/PurchasableItemEditForm";

const PurchasableItems = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  const items = {
    ledger: [],
    bowling: [],
    banquet: [],
    product: [],
  };
   // const datetimeFormat = 'LLL d, yyyy h:mmaaa';
  context.tournament.purchasable_items.map((pi) => {
    // let item = {
    //   name: pi.name,
    //   value: pi.value,
    //   note: '',
    // };
    // if (pi.category === 'ledger') {
    //   switch (pi.determination) {
    //     case 'early_discount':
    //       item.note = 'Valid until ' + format(new Date(pi.configuration.valid_until), datetimeFormat);
    //       break;
    //     case 'late_fee':
    //       item.note = 'Applies at ' + format(new Date(pi.configuration.applies_at), datetimeFormat);
    //       break;
    //   }
    // }
    // if (pi.category === 'bowling') {
    //   if (pi.refinement === 'division') {
    //     item.note = pi.configuration.division + ' (' + pi.configuration.note + ')'
    //   }
    // }
    // if (pi.category === 'product') {
    //   if (pi.refinement === 'denomination') {
    //     item.note = pi.configuration.denomination;
    //   }
    // }
    // items[pi.category].push(item);
    items[pi.category].push(pi);
  });

  return (
    <Card className={[classes.Card, classes.PurchasableItems].join(' ')}>
      <Card.Header as={'h5'} className={'fw-light'}>
        Purchasable Items
      </Card.Header>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {Object.values(items).map((itemSet, i) => {
          if (itemSet.length === 0)
          {
            return '';
          }
          return (
            <Card.Body key={i} className={classes.Category}>
              {itemSet.map((item, j) => {
                return <PurchasableItemEditForm key={j} item={item} />
                // return (
                //   <span className={'d-flex'} key={j}>
                //       <Card.Text className={classes.Item}>
                //         {item.name}
                //         <span className={classes.Note}>{item.note}</span>
                //       </Card.Text>
                //       <Card.Text className={'ms-auto fw-bold'}>
                //         ${item.value}
                //       </Card.Text>
                //     </span>
                // );
              })}
            </Card.Body>
          );
        })}
      </LocalizationProvider>
    </Card>
  );
}

export default PurchasableItems;