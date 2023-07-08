import classes from './VisibleTournament.module.scss';
import {Placeholder, ListGroupItem} from "react-bootstrap";

const PurchasableItem = ({item, onEnableToggle}) => {
  if (!item) {
    return (
      <Placeholder as={ListGroupItem} animation={'glow'} className={classes.PurchasableItem}>
        <Placeholder xs={9}/>{' '}
        <Placeholder xs={2}/>
        <Placeholder xs={7}/>{' '}
      </Placeholder>
    );
  }

  if (item.category === 'product' && item.determination === 'apparel') {
    if (item.configuration.parent_identifier) {
      return '';
    }
  }

  let additionalText = '';
  if (item.refinement === 'division') {
    additionalText = `Division: ${item.configuration['division']}`;
    if (item.configuration.note) {
      additionalText += ` (${item.configuration.note})`;
    }
  } else if (item.configuration.note) {
    additionalText = item.configuration.note;
  }

  return (
    <ListGroupItem className={classes.PurchasableItem}>
      <div className={'d-flex w-100 justify-content-start'}>
        {!['ledger', 'bowling', 'event'].includes(item.category) && (
          <div className={'form-check form-switch'}
               title={item.enabled ? 'Disable purchase of this' : 'Enable purchase of this'}>
            <input type={'checkbox'}
                   className={'form-check-input'}
                   role={'switch'}
                   name={`purchasable_item_${item.key}`}
                   id={item.key}
                   checked={item.enabled}
                   onChange={() => onEnableToggle(item.identifier, !item.enabled)}/>
          </div>
        )}

        <span className={`${classes.Name}`}>
          {item.name}
          {additionalText && <span className={`line ${classes.Additional}`}>
            {additionalText}
            </span>
          }
        </span>

        <span className={`ms-auto ${classes.Price}`}>${item.value}</span>
      </div>
    </ListGroupItem>
  )
}

export default PurchasableItem;
