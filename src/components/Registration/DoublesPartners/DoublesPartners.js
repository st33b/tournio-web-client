import {useEffect, useState} from "react";
import PartnerSelectionRow from "./PartnerSelectionRow";
import {useRegistrationContext} from "../../../store/RegistrationContext";

import classes from './DoublesPartners.module.scss';

const doublesPartners = ({partnersChosen}) => {
  const context = useRegistrationContext();

  const [bowlers, setBowlers] = useState(null);
  useEffect(() => {
    setBowlers(context.state.bowlers);
  });

  if (!bowlers) {
    return '';
  }

  return (
    <div className={`${classes.DoublesPartners} table-responsive`}>
      <table className={'table table-hover caption-top align-middle'}>
        <caption className={classes.Caption}>
          Doubles Partner Assignment
        </caption>
        <thead className={'table-light'}>
        <tr>
          <th scope={'col'}>
            Bowler
          </th>
          <th colSpan={3} scope={'col'}>
            Partner options
          </th>
        </tr>
        </thead>
        <tbody>
        {bowlers.map(bowler => {
          const teammates = bowlers.filter((value) => { return value.position !== bowler.position });
          return <PartnerSelectionRow key={bowler.position}
                                      bowler={bowler}
                                      teammates={teammates}
                                      onPartnerSelected={partnersChosen}
          />
        })}
        </tbody>
      </table>
    </div>
  );
}

export default doublesPartners;