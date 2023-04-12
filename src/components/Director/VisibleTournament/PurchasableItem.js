import classes from './VisibleTournament.module.scss';
import {Placeholder, ListGroupItem} from "react-bootstrap";

const PurchasableItem = ({item}) => {
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
      <div className={'d-flex w-100 justify-content-between'}>
        <span className={classes.Name}>{item.name}</span>
        <span className={classes.Price}>${item.value}</span>
      </div>
      {additionalText && <span className={classes.Additional}>
        {additionalText}
      </span>}
    </ListGroupItem>
  )
}

export default PurchasableItem;
