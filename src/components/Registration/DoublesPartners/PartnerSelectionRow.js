import classes from './PartnerSelectionRow.module.scss';

// Props I want:
// bowler -- the bowler for whom we are selecting a partner
// allBowlers -- all the bowlers on the team
// onPartnerSelected -- function to call when a partner has been clicked. It will automatically determine the rest of the assignments
// values -- the bowlers_attributes from the team form (id, doubles_partner_id, position)

const partnerSelectionRow = ({bowler, teammates, onPartnerSelected}) => {
  const bowlerPosition = bowler.position;
  return (
    <tr className={classes.PartnerSelectionRow}>
      <td className={classes.ChoosingBowler}>
        {bowler.first_name} {bowler.last_name}
      </td>
      {teammates.map((partner) => {
        const partnerPosition = partner.position;
        const labelClasses = ['btn', 'btn-outline-secondary', 'btn-sm'];
        if (bowler.doubles_partner_num === partnerPosition) {
          labelClasses.push('active');
        }
        return (
          <td className={classes.PartnerCandidate} key={bowlerPosition + '-' + partnerPosition}>
            <input type={'radio'}
                   className={'btn-check'}
                   name={'doubles_partner_num-' + bowlerPosition}
                   value={partnerPosition}
                   autoComplete={'off'}
                   data-bowler-num={bowlerPosition}
            />
            <label key={bowlerPosition + '-' + partnerPosition}
                   id={bowlerPosition + '-' + partnerPosition}
                   className={labelClasses.join(' ')}
                   onClick={() => onPartnerSelected(bowlerPosition, partnerPosition)}>
              {partner.first_name} {partner.last_name}
            </label>
          </td>
        );
      })}
    </tr>
  )
}

export default partnerSelectionRow;