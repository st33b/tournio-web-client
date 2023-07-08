import {useRouter} from "next/router";
import Button from "react-bootstrap/Button";

import classes from './TournamentDetails.module.scss';

const PayButton = ({disabled}) => {
  const router = useRouter();

  return (
    <div className={'d-flex flex-column'}
         title={disabled ? 'The tournament is no longer accepting online payments' : 'Pay entry fees, choose extras'}
    >
      <Button className={`col-8 col-lg-auto px-lg-4 mx-auto mt-2 mb-3`}
              variant={'success'}
              disabled={disabled}
              href={`${router.asPath}/bowlers`}>
        Choose Events &amp; Pay Fees
      </Button>
    </div>
  );
}

export default PayButton;
