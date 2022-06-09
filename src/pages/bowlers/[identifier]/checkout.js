import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Col, Row} from "react-bootstrap";

import {fetchBowlerDetails, postPurchaseDetails, postPurchasesCompleted} from "../../../utils";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import ItemSummary from "../../../components/Commerce/Checkout/ItemSummary";
import PayPalExpressCheckout from "../../../components/Commerce/Checkout/PayPalExpressCheckout";
import {purchaseCompleted, purchaseFailed} from "../../../store/actions/registrationActions";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const {commerce, commerceDispatch} = useRegistrationContext();
  const {identifier} = router.query;

  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState(null);
  const [serverTotal, setServerTotal] = useState(null);

  const onPreparePurchaseSuccess = (data) => {
    setLoading(false);
    setPaypalClientId(data.paypal_client_id);
    setServerTotal(data.total);
    setReady(true);
  }

  const onPreparePurchaseFailure = (data) => {
    setLoading(false);
    console.log("D'oh!", data);
    // error?
  }

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

    postPurchaseDetails(identifier,
      purchaseDetailsPostData(commerce.cart),
      onPreparePurchaseSuccess,
      onPreparePurchaseFailure
    );

  }, [identifier, commerce, router]);

  const purchaseDetailsPostData = (items) => {
    const purchaseIdentifiers = [];
    const purchasableItems = [];

    const sum = (runningTotal, currentValue) => runningTotal + currentValue.value * (currentValue.quantity || 1);
    const expectedTotal = items.reduce(sum, 0);

    for (let i of items) {
      if (i.category === 'ledger') {
        // mandatory things like entry & late fees, early discount
        if (i.determination !== 'bundle_discount') {
          purchaseIdentifiers.push(i.identifier);
        }
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
    return <LoadingMessage message={'Preparing checkout'}/>;
  }

  if (!commerce) {
    return '';
  }

  const onCompletePurchaseSuccess = (data) => {
    commerceDispatch(purchaseCompleted(data));
    fetchBowlerDetails(identifier, commerce, commerceDispatch);
    router.push(`/bowlers/${identifier}?success=purchase`);
  }

  const onCompletePurchaseFailure = (data) => {
    commerceDispatch(purchaseFailed(data.error));
    router.push(`/bowlers/${identifier}?error=purchase`);
    // TODO: trigger an email to treasurer and admin that paypal transaction went through, but
    // we failed to connect it to our catalog.
  }

  const purchaseSucceeded = (details) => {
    if (!details) {
      return;
    }

    const postData = {
      paypal_details: details,
      ...purchaseDetailsPostData(commerce.cart)
    };
    postPurchasesCompleted(identifier, postData, onCompletePurchaseSuccess, onCompletePurchaseFailure);
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
            <TournamentLogo tournament={commerce.tournament}/>
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

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;