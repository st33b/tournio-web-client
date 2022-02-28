import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {apiHost} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import ItemSummary from "../../../components/Commerce/Checkout/ItemSummary";
import PayPalExpressCheckout from "../../../components/Commerce/Checkout/PayPalExpressCheckout";

const page = () => {
  const router = useRouter();
  const {commerce, commerceDispatch} = useRegistrationContext();
  const {identifier} = router.query;

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState(null);
  const [serverTotal, setServerTotal] = useState(null);

  useEffect(() => {
    if (identifier === undefined) {
      return;
    }

    // If the bowler in context doesn't match the bowler in the URI, we need to bail out
    if (commerce.bowler && commerce.bowler.identifier !== identifier) {
      router.push('/');
    }

    if (commerce.cart && commerce.cart.length === 0) {
      return;
    }

    const requestConfig = {
      method: 'post',
      url: `${apiHost}/bowlers/${identifier}/purchase_details`,
      headers: {
        'Accept': 'application/json',
      },
      data: purchaseDetailsPostData(commerce.cart),
    }
    axios(requestConfig)
      .then(response => {
        setLoading(false);
        setPaypalClientId(response.data.paypal_client_id);
        setServerTotal(response.data.total);
        setReady(true);
      })
      .catch(error => {
        setLoading(false);
        console.log("There was a problem.");
        console.log(error);
      });
  }, [identifier, commerce]);

  const purchaseDetailsPostData = (items) => {
    const purchaseIdentifiers = [];
    const purchasableItems = [];

    const sum = (runningTotal, currentValue) => runningTotal + currentValue.value * (currentValue.quantity || 1);
    const expectedTotal = items.reduce(sum, 0);

    for (let i of items) {
      if (i.category === 'ledger') {
        // mandatory things like entry & late fees, early discount
        purchaseIdentifiers.push(i.identifier);
      } else {
        purchasableItems.push({
          identifier: i.identifier,
          quantity: i.quantity,
        });
      }
    }
    return {
      purchase_identifiers: purchaseIdentifiers,
      purchasable_items: purchasableItems,
      expected_total: expectedTotal,
    };
  }

  if (loading) {
    return (
      <div>
        <p>
          Preparing checkout...
        </p>
      </div>
    );
  }

  if (!commerce) {
    return '';
  }

  const purchaseSucceeded = (details) => {
    // convey paypal details over to our backend
  }

  let displayed_name = commerce.bowler.first_name;
  if (commerce.bowler.preferred_name) {
    displayed_name = commerce.bowler.preferred_name;
  }
  const name = displayed_name + ' ' + commerce.bowler.last_name;

  if (!ready) {
    return 'Not ready...';
  }

  return (
    <div>
      <Row className={'pt-2'}>
        <Col md={2} className={'d-none d-md-block'}>
          <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
            <TournamentLogo/>
          </a>
        </Col>
        <Col md={10} className={'d-flex flex-column justify-content-center text-center text-md-start'}>
          <h3 className={'p-0 m-0'}>
            <a href={`/tournaments/${commerce.tournament.identifier}`} title={'To tournament page'}>
              {commerce.tournament.name}
            </a>
          </h3>
          <h4 className={'p-0 my-2 my-md-3'}>
            Bowler: {name}
          </h4>
        </Col>
      </Row>

      <hr />

      <Row>
        {/* item list (left side on desktop */}
        <Col md={6}>
          <ItemSummary totalFees={serverTotal} />
        </Col>

        {/* checkout buttons (right side on desktop */}
        <Col md={6}>
          <PayPalExpressCheckout clientId={paypalClientId}
                                 amount={serverTotal}
                                 onPurchaseSuccess={purchaseSucceeded}
                                 />
        </Col>

      </Row>
    </div>
  );
}

page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default page;