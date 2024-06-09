import {useRouter} from "next/router";
import Button from "react-bootstrap/Button";
import classes from "./TournamentDetails.module.scss";

const PayButton = ({disabled}) => {
  const router = useRouter();
  let href = `${router.asPath}/bowlers`;

  return (
    <div className={`d-flex flex-column flex-lg-row justify-content-between justify-content-lg-around ${classes.Actions}`}>
      {/*<Button className={`col-8 col-lg-auto px-lg-4 mx-auto mt-2 mb-3`}*/}
      <Button className={`my-3`}
              title={disabled ? 'The tournament is no longer accepting online payments' : 'Pay entry fees, choose extras'}
              variant={'success'}
              disabled={disabled}
              size={'lg'}
              href={href}>
        Choose Events &amp; Pay Fees
      </Button>
    </div>
  );
}

export default PayButton;
