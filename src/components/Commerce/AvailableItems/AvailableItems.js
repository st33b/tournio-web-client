import {Col, Row} from "react-bootstrap";
import {useCommerceContext} from "../../../store/CommerceContext";
import Item from "./Item/Item";

import classes from './AvailableItems.module.scss';
import {devConsoleLog} from "../../../utils";

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

  // sort the event items by their order
  const eventItems = commerce.availableItems.filter(item => {
    return item.category === 'bowling' && item.determination === 'event';
  }).sort(sortByOrder);

  // sort the division items by name and note
  const divisionItems = commerce.availableItems.filter(item => {
    return item.refinement === 'division';
  }).sort((left, right) => {
    const leftText = left.name + left.configuration.division;
    const rightText = right.name + right.configuration.division;
    return leftText.localeCompare(rightText);
  });

  // sort the single_use items by their order
  const singleUseItems = commerce.availableItems.filter(item => {
    return item.determination === 'single_use' && !item.refinement;
  }).sort(sortByOrder);

  // sort the multi-use items by their order
  const multiUseItems = commerce.availableItems.filter(item => {
    return item.determination === 'multi_use';
  }).sort(sortByOrder);

  // Sanction items
  const sanctionItems = commerce.availableItems.filter(({category}) => category === 'sanction');

  // Non-apparel Products
  const productItems = commerce.availableItems.filter(({
                                          category,
                                          determination
                                        }) => category === 'product' && determination === 'general').sort(sortByOrder);

  const banquetItems = commerce.availableItems.filter(({category}) => category === 'banquet')
  const raffleItems = commerce.availableItems.filter(({category}) => category === 'raffle')

  const anyBowlingExtras = (divisionItems.length +
    singleUseItems.length +
    multiUseItems.length) > 0;
  const anyBowlingItems = anyBowlingExtras || eventItems.length > 0;
  const bowlingItemsClass = anyBowlingItems ? '' : 'd-none';

  const anyOtherExtras = (raffleItems.length +
    commerce.availableApparelItems.length +
    productItems.length +
    banquetItems.length +
    sanctionItems.length) > 0;

  const anyItemsAtAll = anyBowlingExtras || anyOtherExtras;
  devConsoleLog("Anything to show?", anyItemsAtAll);

  let largeWidth = 12;
  let largeClass = `col-lg-7';`
  if (anyBowlingItems && anyOtherExtras) {
    largeWidth = 6;
    largeClass = `col-lg-8`;
  }

  // 8 if we have two columns of things
  // 7 if not.
  return (
    <div className={`${classes.AvailableItems} col-md-7 ${largeClass}`}>
      <Row className={``}>
        {(!anyItemsAtAll) && (
          <Col lg={largeWidth} className={'d-none d-md-block'}>
            <p>No other items to show.</p>
          </Col>
        )}
        {anyBowlingItems && (
          <Col lg={largeWidth} className={bowlingItemsClass}>
            {eventItems.length > 0 && (
              <div className={``}>
                <h5 className={''}>
                  Bowling Events
                </h5>
                <Col xs={12}>
                  {eventItems.map((item) => (
                    <Item key={item.identifier}
                          item={item}
                          added={itemAddedToCart}/>
                  ))}
                </Col>
              </div>
            )}

            {anyBowlingExtras && (
              <>
                <h5 className={``}>
                  Bowling Extras
                </h5>

                {divisionItems.length > 0 && (
                  <Col xs={12}>
                    {divisionItems.map((item) => (
                      <Item key={item.identifier}
                            item={item}
                            added={itemAddedToCart}/>
                    ))}
                    <hr/>
                  </Col>
                )}

                {singleUseItems.length > 0 && (
                  <Col xs={12}>
                    {singleUseItems.map((item) => (
                      <Item key={item.identifier}
                            item={item}
                            added={itemAddedToCart}/>
                    ))}
                    <hr/>
                  </Col>
                )}

                {multiUseItems.length > 0 && (
                  <Col xs={12} className={``}>
                    {multiUseItems.map((item) => (
                      <Item key={item.identifier}
                            item={item}
                            added={itemAddedToCart}/>
                    ))}
                  </Col>
                )}
              </>
            )}
          </Col>
        )}

        {anyOtherExtras && (
          <Col lg={largeWidth} className={``}>
            {raffleItems.length > 0 && (
              <div className={``}>
                <h5 className={``}>
                  Raffle Tickets
                </h5>
                {raffleItems.map((item) => (
                  <Item key={item.identifier}
                        item={item}
                        added={itemAddedToCart}/>
                ))}
              </div>
            )}

            {commerce.availableApparelItems.length > 0 && (
              <div className={``}>
                <h5 className={``}>
                  Apparel
                </h5>
                {commerce.availableApparelItems.map((item) => (
                  <Item key={item.identifier}
                        item={item}
                        added={itemAddedToCart}/>
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
                        added={itemAddedToCart}/>
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
                        added={itemAddedToCart}/>
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
                        added={itemAddedToCart}/>
                ))}

              </div>
            )}
          </Col>
        )}
      </Row>
    </div>
  )
}

export default AvailableItems;
