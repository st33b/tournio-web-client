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
  // category: bowling
  //   determination: event
  //   determination: single_use refinement:division (one group for each name, e.g., Scratch Masters and Optional Scratch)
  //   determination: single_use (no refinement)
  //   determination: multi_use
  // category: product
  //   (non-apparel)
  //   determination: apparel
  //     (unsized)
  //     refinement: sized
  // category: banquet
  // category: raffle

  const allItems = Object.values(commerce.availableItems);

  // sort the event items by their order
  const eventItems = allItems.filter(item => {
    return item.category === 'bowling' && item.determination === 'event';
  }).sort(sortByOrder);

  // sort the division items by name and note
  const divisionItems = allItems.filter(item => {
    return item.refinement === 'division';
  }).sort((left, right) => {
    const leftText = left.name + left.configuration.division;
    const rightText = right.name + right.configuration.division;
    return leftText.localeCompare(rightText);
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
  const productItems = allItems.filter(({category, determination}) => category === 'product' && determination === 'general').sort(sortByOrder);

  const apparelItems = Object.values(commerce.availableApparelItems);

  const banquetItems = allItems.filter(({category}) => category === 'banquet')
  const raffleItems = allItems.filter(({category}) => category === 'raffle')

  return (
    <div className={classes.AvailableItems}>
      <Row className={``}>
        <Col xs={12} md={6}>
          {eventItems.length > 0 && (
            <div className={``}>
              <h5 className={''}>
                Bowling Events
              </h5>
              <Col xs={12}>
                {eventItems.map((item) => (
                  <Item key={item.identifier}
                        item={item}
                        added={itemAddedToCart} />
                ))}
              </Col>
            </div>
          )}

          <div className={``}>
            <h5 className={``}>
              Bowling Extras
            </h5>
            <Col xs={12}>
              {divisionItems.map((item) => (
                <Item key={item.identifier}
                      item={item}
                      added={itemAddedToCart} />
              ))}
            </Col>

            <Col xs={12}>
              {singleUseItems.map((item) => (
                <Item key={item.identifier}
                      item={item}
                      added={itemAddedToCart} />
              ))}
            </Col>
          </div>

          {multiUseItems.length > 0 && (
            <Col xs={12} className={``}>
              {multiUseItems.map((item) => (
                <Item key={item.identifier}
                      item={item}
                      added={itemAddedToCart} />
              ))}
            </Col>
          )}
        </Col>

        <Col xs={12} md={6} className={``}>
          {raffleItems.length > 0 && (
            <div className={``}>
              <h5 className={``}>
                Raffle Tickets
              </h5>
              {raffleItems.map((item) => (
                <Item key={item.identifier}
                      item={item}
                      added={itemAddedToCart} />
              ))}
            </div>
          )}

          {apparelItems.length > 0 && (
            <div className={``}>
              <h5 className={``}>
                Apparel
              </h5>
              {apparelItems.map((item) => (
                <Item key={item.identifier}
                      item={item}
                      added={itemAddedToCart} />
              ))}
            </div>
          )}

          {productItems.length > 0 && (
            <div className={``}>
              <h5 className={``}>
                Memorabilia
              </h5>
              {productItems.map((item) => (
                <Item key={item.identifier}
                      item={item}
                      added={itemAddedToCart} />
              ))}
            </div>
          )}

          {banquetItems.length > 0 && (
            <div className={``}>
              <h5 className={``}>
                Banquet Tickets
              </h5>
              {banquetItems.map((item) => (
                <Item key={item.identifier}
                      item={item}
                      added={itemAddedToCart} />
              ))}
            </div>
          )}


          {sanctionItems.length > 0 && (
            <div className={``}>
              <h5 className={``}>
                Membership Fees
              </h5>
              {sanctionItems.map((item) => (
                <Item key={item.identifier}
                      item={item}
                      added={itemAddedToCart} />
              ))}

            </div>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default AvailableItems;
