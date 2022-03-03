import Card from 'react-bootstrap/Card';
import {format} from 'date-fns';

import classes from './TournamentDetails.module.scss';
import {useDirectorContext} from "../../../store/DirectorContext";

const purchasableItems = () => {
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
  const datetimeFormat = 'LLL d, yyyy h:mmaaa';
  context.tournament.purchasable_items.map((pi) => {
    let item = {
      name: pi.name,
      value: pi.value,
      note: '',
    };
    if (pi.category === 'ledger') {
      switch (pi.determination) {
        case 'early_discount':
          item.note = 'Valid until ' + format(new Date(pi.configuration.valid_until), datetimeFormat);
          break;
        case 'late_fee':
          item.note = 'Applies at ' + format(new Date(pi.configuration.applies_at), datetimeFormat);
          break;
      }
    }
    if (pi.category === 'bowling') {
      if (pi.refinement === 'division') {
        item.note = pi.configuration.division + ' (' + pi.configuration.note + ')'
      }
    }
    if (pi.category === 'product') {
      if (pi.refinement === 'denomination') {
        item.note = pi.configuration.denomination;
      }
    }
    items[pi.category].push(item);
  });

  return (
    <Card className={[classes.Card, classes.PurchasableItems].join(' ')}>
      <Card.Header as={'h4'}>
        Purchasable Items
      </Card.Header>
      {Object.values(items).map((itemSet, i) => {
        if (itemSet.length === 0)
        {
          return '';
        }
        return (
          <Card.Body key={i} className={classes.Category}>
            {itemSet.map((item, j) => {
              return (
                <span className={'d-flex'} key={j}>
                    <Card.Text className={classes.Item}>
                      {item.name}
                      <span className={classes.Note}>{item.note}</span>
                    </Card.Text>
                    <Card.Text className={'ms-auto fw-bold'}>
                      ${item.value}
                    </Card.Text>
                  </span>
              );
            })}
          </Card.Body>
        );
      })}
    </Card>
  );
}

export default purchasableItems;