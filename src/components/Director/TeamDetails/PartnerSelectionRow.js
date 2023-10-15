import classes from './PartnerSelectionRow.module.scss';

// Props I want:
// bowler -- the bowler for whom we are selecting a partner
// allBowlers -- all the bowlers on the team
// onPartnerSelected -- function to call when a partner has been clicked. It will automatically determine the rest of the assignments

const partnerSelectionRow = ({bowler, allBowlers, onPartnerSelected}) => {
  const teammates = allBowlers.filter(b => bowler.id !== b.id);

  return (
    <tr className={classes.PartnerSelectionRow}>
      <td className={classes.ChoosingBowler}>
        {bowler.first_name} {bowler.last_name}
      </td>
      {teammates.map((partner) => {
        const labelClasses = ['btn', 'btn-outline-secondary', 'btn-sm'];
        if (bowler.doubles_partner_id === partner.id) {
          labelClasses.push('active');
        }
        return (
          <td className={classes.PartnerCandidate} key={'doubles_partner_id-' + bowler.id + '-' + partner.id}>
            <input type={'radio'}
                   className={'btn-check'}
                   name={'doubles_partner_id-' + bowler.id}
                   value={partner.id}
                   autoComplete={'off'}
                   data-bowler-id={bowler.id}
            />
            <label key={bowler.id + '-' + partner.id}
                   id={bowler.id + '-' + partner.id}
                   className={labelClasses.join(' ')}
                   onClick={() => onPartnerSelected(bowler.id, partner.id)}>
              {partner.first_name} {partner.last_name}
            </label>
          </td>
        );
      })}
    </tr>
  )
}

export default partnerSelectionRow;
