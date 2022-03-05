import classes from './PartnerSelectionRow.module.scss';

// Props I want:
// bowler -- the bowler for whom we are selecting a partner
// allBowlers -- all the bowlers on the team
// onPartnerSelected -- function to call when a partner has been clicked. It will automatically determine the rest of the assignments
// values -- the bowlers_attributes from the team form (id, doubles_partner_id, position)

const partnerSelectionRow = (props) => {
  const bowlerIndex = props.values.findIndex(b => b.id === props.bowler.id)
  const teammates = props.allBowlers.filter(b => props.bowler.id !== b.id);

  let bowlerPartnerId = -1;
  if(props.values.length > 0) {
    bowlerPartnerId = props.values[bowlerIndex].doubles_partner_id
  }

  return (
    <tr className={classes.PartnerSelectionRow}>
      <td className={classes.ChoosingBowler}>
        {props.bowler.first_name} {props.bowler.last_name}
      </td>
      {teammates.map((partner) => {
        const labelClasses = ['btn', 'btn-outline-secondary', 'btn-sm'];
        if (bowlerPartnerId === partner.id) {
          labelClasses.push('active');
        }
        return (
          <td className={classes.PartnerCandidate} key={'doubles_partner_id-' + props.bowler.id + '-' + partner.id}>
            <input type={'radio'}
                   className={'btn-check'}
                   name={'doubles_partner_id-' + props.bowler.id}
                   value={partner.id}
                   autoComplete={'off'}
                   data-bowler-id={props.bowler.id}
            />
            <label key={props.bowler.id + '-' + partner.id}
                   id={props.bowler.id + '-' + partner.id}
                   className={labelClasses.join(' ')}
                   onClick={() => props.onPartnerSelected(props.bowler.id, partner.id)}>
              {partner.first_name} {partner.last_name}
            </label>
          </td>
        );
      })}
    </tr>
  )
}

export default partnerSelectionRow;