import classes from './RegisteredBowler.module.scss';
import Link from "next/link";
import {useRouter} from "next/router";
import {devConsoleLog} from "../../../utils";

const RegisteredBowler = ({bowler}) => {
  devConsoleLog("------------ component untouched in team restoration");

  const router = useRouter();
  let href = `${router.asPath}/bowlers`;
  if (bowler) {
    href = `/bowlers/${bowler.identifier}`;
  }

  return (
    <li className={'list-group-item d-flex'}>
      <span className={'d-block'}>
        {bowler.position} &ndash;&nbsp;
      </span>
      <span className={'d-block'}>
        {bowler.full_name}
      </span>
      <Link className={`ms-auto`}
            title={'Pay entry fees, choose extras'}
            href={href}>
        Events &amp; Fees
      </Link>
    </li>
  );
}

export default RegisteredBowler;
