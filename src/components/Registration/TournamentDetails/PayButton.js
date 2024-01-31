import {useRouter} from "next/router";
import Button from "react-bootstrap/Button";

const PayButton = ({disabled, bowler}) => {
  const router = useRouter();
  let href = `${router.asPath}/bowlers`;
  let buttonSize = '';
  if (bowler) {
    href = `/bowlers/${bowler.identifier}`;
    buttonSize = 'lg';
  }

  return (
    <div className={'d-flex flex-column'}
         title={disabled ? 'The tournament is no longer accepting online payments' : 'Pay entry fees, choose extras'}
    >
      <Button className={`col-8 col-lg-auto px-lg-4 mx-auto mt-2 mb-3`}
              variant={'success'}
              disabled={disabled}
              size={buttonSize}
              href={href}>
        Choose Events &amp; Pay Fees
      </Button>
    </div>
  );
}

export default PayButton;
