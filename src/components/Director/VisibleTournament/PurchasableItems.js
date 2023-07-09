import {Accordion, ListGroup, Placeholder} from "react-bootstrap";

import PurchasableItem from "./PurchasableItem";

import classes from './VisibleTournament.module.scss';
import {directorApiRequest, useTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import {updateObject} from "../../../utils";

const PurchasableItems = ({eventKey}) => {
  const ITEM_TYPE_ORDER = [
    'event',
    'ledger',
    'division',
    'bowling',
    'raffle',
    'product',
    'banquet',
    'sanction',
  ];

  const {authToken} = useLoginContext();
  const {loading, tournament, tournamentUpdatedQuietly} = useTournament();

  const toggleSuccess = (updatedItem) => {
    const modifiedItems = {};
    ITEM_TYPE_ORDER.forEach(type => {
      modifiedItems[type] = [...tournament.purchasable_items[type]];

      const index = tournament.purchasable_items[type].findIndex(({identifier}) => identifier === updatedItem.identifier);
      if (index >= 0) {
        modifiedItems[type][index] = {...updatedItem};
      }
    });
    const modifiedTournament = updateObject(tournament, {
      purchasable_items: modifiedItems,
    });
    tournamentUpdatedQuietly(modifiedTournament);
  }

  const enabledToggled = (identifier, enabled) => {
    const uri = `/purchasable_items/${identifier}`;
    const requestConfig = {
      method: 'patch',
      data: {
        purchasable_item: {
          enabled: enabled,
        }
      }
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: toggleSuccess,
    });
  }

  if (loading) {
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

  return (
    <Accordion.Item eventKey={eventKey} className={classes.PurchasableItems}>
      <Accordion.Header as={'h5'} className={classes.AccordionHeader}>
        Fees &amp; Optional Items
      </Accordion.Header>
      <Accordion.Body className={`${classes.AccordionBody} p-0`}>
        <ListGroup variant={'flush'}>
          {ITEM_TYPE_ORDER.map(itemType => {
            if (!tournament.purchasable_items[itemType] || tournament.purchasable_items[itemType].length === 0) {
              return '';
            }
            return (
              <ListGroup.Item key={itemType} className={'p-0'}>
                <ListGroup variant={'flush'}>
                  {tournament.purchasable_items[itemType].map((pi, i) => (
                    <PurchasableItem key={`${itemType}_${i}`} item={pi} onEnableToggle={enabledToggled}/>
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
