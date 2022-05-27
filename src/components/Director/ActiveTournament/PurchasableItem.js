import classes from './ActiveTournament.module.scss';
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

  let additionalText = '';

  return (
    <ListGroupItem className={classes.PurchasableItem}>
      <div className={'d-flex w-100 justify-content-between'}>
        <span className={classes.Name}>{item.name}</span>
        <span className={classes.Price}>${item.value}</span>
      </div>
      {additionalText}
    </ListGroupItem>
  )
}

export default PurchasableItem;