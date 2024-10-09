import classes from './ActiveTournament.module.scss';
import OptionalItem from "./OptionalItem";

const OptionalItems = ({purchasableItems}) => {
  const ITEM_TYPE_ORDER = [
    // 'event',
    // 'ledger',
    'division',
    'bowling',
    'raffle',
    'product',
    'banquet',
    'sanction',
  ];

  return (
    <div className={classes.OptionalItems}>
      <div className={'card mb-3'}>
        <h4 className={'card-header'}>
          Optional Item Availability
        </h4>
      </div>
      <ul className={'list-group list-group-flush'}>
        {ITEM_TYPE_ORDER.map(itemType => {
          const itemsOfType = purchasableItems.filter(({category}) => category === itemType);
          if (itemsOfType.length === 0) {
            return '';
          }
          return (
            <li key={`itemType--${itemType}`}
                className={'list-group-item p-0'}>
              <ul className={'list-group list-group-flush'}>
                {itemsOfType.map((pi, i) => (
                  <li className={'list-group-item'}
                  key={`${itemType}_${i}`}>
                    <OptionalItem item={pi}
                                  key={`optional-item--${pi.identifier}`}
                                  onEnableToggle={() => {}}
                                  />
                  </li>
                ))}
              </ul>
            </li>
        );
        })}
        </ul>
        </div>
  );
};

export default OptionalItems;
