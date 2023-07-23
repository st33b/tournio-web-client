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
      <table className={'table foo-table-hover caption-top align-middle'}>
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
        {team.bowlers.map((bowler, i) => {
          // const teammates = team.bowlers.filter((value, j) => { return i !== j });
          return <PartnerSelectionRow key={`row_${i}`}
                                      bowler={bowler}
                                      bowlerIndex={i}
                                      teammates={team.bowlers}
                                      onPartnerSelected={partnersChosen}
          />
        })}
        </tbody>
      </table>
    </div>
  );
}

export default DoublesPartners;
