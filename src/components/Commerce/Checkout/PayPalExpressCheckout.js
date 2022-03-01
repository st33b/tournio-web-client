import {PayPalButton} from "react-paypal-button-v2";

const payPalExpressCheckout = ({clientId, amount, bowlerIdentifier, onPurchaseSuccess}) => {
  // only show the button component if we have a client ID and total in props
  if (!clientId || !amount || clientId === '' || amount === 0) {
    return (
      'Preparing...'
    );
  }

  return (
    <div>
      <PayPalButton
        options={{
          clientId: clientId,
          // merchantId: merchantId,
        }}
        amount={amount}
        onSuccess={(details, data) => {
          onPurchaseSuccess(details);
        }}
        // catchError=...
        // onError=... (generic catch-all error)
        // onCancel=...
      />
    </div>
  );
};

export default payPalExpressCheckout;
