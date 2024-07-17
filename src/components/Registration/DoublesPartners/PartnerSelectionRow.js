import classes from './PartnerSelectionRow.module.scss';

// Props I want:
// bowler -- the bowler for whom we are selecting a partner
// allBowlers -- all the bowlers on the team
// onPartnerSelected -- function to call when a partner has been clicked. It will automatically determine the rest of the assignments

const PartnerSelectionRow = ({bowler, bowlerIndex, teammates, onPartnerSelected}) => {
  return (
    <tr className={classes.PartnerSelectionRow}>
      <td className={classes.ChoosingBowler}>
        {bowler.nickname ? bowler.nickname : bowler.first_name} {bowler.last_name}
      </td>
      {teammates.map((partner, partnerIndex) => {

        // This will happen if we're looking at ourselves.
        if (bowlerIndex === partnerIndex) {
          return '';
        }

        const labelClasses = ['btn', 'btn-outline-primary', 'btn-sm'];
        if (bowler.doublesPartnerIndex === partnerIndex) {
          labelClasses.push('active');
        }
        return (
          <td className={classes.PartnerCandidate} key={bowlerIndex + '-' + partnerIndex}>
            <input type={'radio'}
                   className={'btn-check'}
                   name={'doublesPartnerIndex-' + bowlerIndex}
                   value={partnerIndex}
                   autoComplete={'off'}
                   data-bowler-num={bowlerIndex}
            />
            <label key={bowlerIndex + '-' + partnerIndex}
                   id={bowlerIndex + '-' + partnerIndex}
                   className={labelClasses.join(' ')}
                   onClick={() => onPartnerSelected(bowlerIndex, partnerIndex)}>
              {partner.nickname ? partner.nickname : partner.first_name} {partner.last_name}
            </label>
          </td>
        );
      })}
    </tr>
  )
}

export default PartnerSelectionRow;
