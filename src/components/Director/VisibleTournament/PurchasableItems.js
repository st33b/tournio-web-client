import {Accordion, ListGroup, Placeholder} from "react-bootstrap";

import PurchasableItem from "./PurchasableItem";

import classes from './VisibleTournament.module.scss';

const PurchasableItems = ({eventKey, tournament}) => {
  if (!tournament) {
    return (
      <Accordion.Item eventKey={eventKey} className={classes.PurchasableItems}>
        <Accordion.Header as={'h5'} className={classes.AccordionHeader}>
          Fees &amp; Optional Items
        </Accordion.Header>
        <Placeholder as={Accordion.Body} animation={'glow'}>
          <Placeholder xs={12}/>
          <Placeholder xs={7}/>{' '}
          <Placeholder xs={4}/>
          <Placeholder xs={7}/>{' '}
          <Placeholder xs={4}/>
          <Placeholder xs={7}/>{' '}
          <Placeholder xs={4}/>
        </Placeholder>
      </Accordion.Item>
    );
  }

  const itemTypeOrder = [
    'ledger',
    'division',
    'bowling',
    'banquet',
    'product',
  ];

  return (
    <Accordion.Item eventKey={eventKey} className={classes.PurchasableItems}>
      <Accordion.Header as={'h5'} className={classes.AccordionHeader}>
        Fees &amp; Optional Items
      </Accordion.Header>
      <Accordion.Body className={`${classes.AccordionBody} p-0`}>
        <ListGroup variant={'flush'}>
          {itemTypeOrder.map(itemType => {
            if (tournament.purchasable_items[itemType].length === 0) {
              return '';
            }
            return (
              <ListGroup.Item key={itemType} className={'py-0'}>
                <ListGroup variant={'flush'}>
                  {tournament.purchasable_items[itemType].map((pi, i) => (
                    <PurchasableItem key={`${itemType}_${i}`} item={pi} />
                  ))}
                </ListGroup>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default PurchasableItems;