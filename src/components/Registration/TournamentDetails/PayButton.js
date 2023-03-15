import classes from './TournamentDetails.module.scss';
import {useRouter} from "next/router";
import Button from "react-bootstrap/Button";

const PayButton = () => {
  const router = useRouter();

  return (
    <div className={'d-flex flex-column'}>
      <Button className={`col-8 col-lg-auto px-lg-4 mx-auto mt-2 mb-3 ${classes.PayAction}`}
              variant={'success'}
              href={`${router.asPath}/bowlers`}>
        Choose Events &amp; Pay Fees
      </Button>
    </div>
  );
}

export default PayButton;
