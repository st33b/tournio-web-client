import {useRouter} from "next/router";
import Link from "next/link";

const PayButton = ({bowler}) => {
  const router = useRouter();
  let href = `${router.asPath}/bowlers`;
  if (bowler) {
    href = `/bowlers/${bowler.identifier}`;
  }

  return (
    <Link className={``}
            title={'Pay entry fees, choose extras'}
            href={href}>
      Events &amp; Fees
    </Link>
  );
}

export default PayButton;
