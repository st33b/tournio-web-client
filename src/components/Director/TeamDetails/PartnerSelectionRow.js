import classes from './PartnerSelectionRow.module.scss';

// Props I want:
// bowler -- the bowler for whom we are selecting a partner
// activeId -- the ID of the current doubles partner
// teammates -- all the other bowlers on the team
// onPartnerSelected -- function to call when a partner has been clicked. It will automatically determine the rest of the assignments

const PartnerSelectionRow = ({bowler, activeId, teammates = [], onPartnerSelected}) => {
  if (teammates.length === 0) {
    return '';
  }

  return (
    <tr className={classes.PartnerSelectionRow}>
      <td className={classes.ChoosingBowler}>
        {bowler.fullName}
      </td>
      {teammates.map((partner) => {
        const labelClasses = ['btn', 'btn-outline-secondary', 'btn-sm'];
        if (partner.id === activeId) {
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
              {partner.fullName}
            </label>
          </td>
        );
      })}
    </tr>
  )
}

export default PartnerSelectionRow;
