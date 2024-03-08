import classes from './TournamentDetails.module.scss';
import TraditionalPriceBreakdown from "./TraditionalPriceBreakdown";
import EventPriceBreakdown from "./EventPriceBreakdown";

const Details = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  return (
    <div className={classes.Details}>
      <TraditionalPriceBreakdown tournament={tournament}/>
      <EventPriceBreakdown tournament={tournament}/>
    </div>
  )
}

export default Details;
