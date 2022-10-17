import PartnerSelectionRow from "./PartnerSelectionRow";

import classes from './DoublesPartners.module.scss';

const DoublesPartners = ({team, partnersChosen}) => {
  if (!team) {
    return '';
  }

  return (
    <div className={`${classes.DoublesPartners} table-responsive`}>
      <h3>
        Doubles Partner Assignment
      </h3>
      <table className={'table table-hover caption-top align-middle'}>
        <thead className={'table'}>
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
        {team.bowlers.map(bowler => {
          const teammates = team.bowlers.filter((value) => { return value.position !== bowler.position });
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

export default DoublesPartners;