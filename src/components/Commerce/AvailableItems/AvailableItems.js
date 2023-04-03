import {Col, Row} from "react-bootstrap";
import {apparelSizes} from '../../../utils';
import {useCommerceContext} from "../../../store/CommerceContext";
import Item from "./Item/Item";

import classes from './AvailableItems.module.scss';

const AvailableItems = ({itemAddedToCart}) => {
  const {commerce} = useCommerceContext();

  if (!commerce || !commerce.availableItems) {
    return '';
  }

  const sortByOrder = (left, right) => {
    let leftOrder = left.configuration.order || 100;
    let rightOrder = right.configuration.order || 100;
    return leftOrder - rightOrder;
  }

  // Let's separate these out into groups:
  // determination: event
  // determination: single_use refinement:division (one group for each name, e.g., Scratch Masters and Optional Scratch)
  // determination: single_use (no refinement)
  // category: product (non-apparel)
  // category: product (apparel)
  // determination: multi_use

  const allItems = Object.values(commerce.availableItems);

  // sort the event items by their order
  const eventItems = allItems.filter(item => {
    return item.category === 'bowling' && item.determination === 'event';
  }).sort(sortByOrder);

  // sort the division items by name and note
  const divisionItems = allItems.filter(item => {
    return item.determination === 'single_use' && item.refinement === 'division';
  }).sort((left, right) => {
    const leftText = left.name + left.configuration.note;
    const rightText = right.name + right.configuration.note;
    return rightText.localeCompare(leftText);
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

  // sort the single_use items by their order
  const singleUseItems = allItems.filter(item => {
    return item.determination === 'single_use' && !item.refinement;
  }).sort(sortByOrder);

  // sort the multi-use items by their order
  const multiUseItems = allItems.filter(item => {
    return item.determination === 'multi_use';
  }).sort(sortByOrder);

  // Sanction items
  const sanctionItems = allItems.filter(({category}) => category === 'sanction');

  // Non-apparel Products
  const productItems = allItems.filter(({category, determination}) => category === 'product' && determination !== 'apparel').sort(sortByOrder);

  const apparelItems = allItems.filter(({category, determination}) => category === 'product' && determination === 'apparel');

  // Go through apparel items.
  // If it has a size but no parent, then treat it like anything else
  // If it has a "sized" refinement, then it's the one we should use for details
  // If it has a "parent_identifier" configuration property, then add its size to the canonical one (including its identifier)


  const groupValues = [...divisionGroups.values()];

  return (
    <div className={classes.AvailableItems}>
      <h4 className={'py-2 py-md-0'}>
        Available Events/Items
      </h4>

      <Row>
        {eventItems.length > 0 && (
          <Col xs={12}>
            {eventItems.map((item) => (
              <Item key={item.identifier}
                    item={item}
                    added={itemAddedToCart} />
            ))}
          </Col>

        )}

        {groupValues.map((group, index) => (
          <Col key={index} xs={12}>
            {group.map((item) => (
              <Item key={item.identifier}
                    item={item}
                    added={itemAddedToCart} />
            ))}
          </Col>
        ))}

        <Col xs={12}>
          {singleUseItems.map((item) => (
            <Item key={item.identifier}
                  item={item}
                  added={itemAddedToCart} />
          ))}
        </Col>

        {multiUseItems.length > 0 && (
          <Col xs={12} className={'pt-3 border-top'}>
            {multiUseItems.map((item) => (
              <Item key={item.identifier}
                    item={item}
                    added={itemAddedToCart} />
            ))}
          </Col>
        )}

        <Col xs={12} className={`pt-3 mb-3 border-top border-bottom`}>
          {productItems.map((item) => (
            <Item key={item.identifier}
            item={item}
            added={itemAddedToCart} />
          ))}
        </Col>

        <Col xs={12}>
          {sanctionItems.map((item) => (
            <Item key={item.identifier}
                  item={item}
                  added={itemAddedToCart} />
          ))}
        </Col>
      </Row>
    </div>
  )
}

export default AvailableItems;
