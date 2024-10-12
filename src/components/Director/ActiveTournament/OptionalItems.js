import classes from './ActiveTournament.module.scss';
import OptionalItem from "./OptionalItem";
import TooltipOverlay from "../../ui/TooltipOverlay/TooltipOverlay";

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
        <div className={'card-header d-flex justify-content-between align-items-baseline'}>
          <h5 className={''}>
            Optional Item Availability
          </h5>
          <TooltipOverlay id={`optional-items--tooltip`} title={'Enable and disable purchase of optional items'}>
            <i className={`bi bi-question-circle ps-2 h5 ${classes.TooltipIcon}`}
               aria-hidden={true}/>
          </TooltipOverlay>
        </div>
        <ul className={'list-group list-group-flush'}>
          {ITEM_TYPE_ORDER.map(itemType => {
            const itemsOfType = purchasableItems.filter(({category}) => category === itemType);
            if (itemsOfType.length === 0) {
              return '';
            }
            return itemsOfType.map((pi, i) => (
              <li className={'list-group-item'}
                  key={`${itemType}_${i}`}>
                <OptionalItem item={pi}
                              key={`optional-item--${pi.identifier}`}
                              onEnableToggle={() => {}}
                              />
              </li>
            ));
          })}
        </ul>
      </div>
    </div>
  );
};

export default OptionalItems;
