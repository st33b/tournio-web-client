import classes from './PreviousPurchases.module.scss';

const previousPurchases = () => {
  return (
    <div className={classes.PreviousPurchases}>
      <h4 className={'py-2 py-md-0'}>
        Paid Events/Items
      </h4>
    </div>
  )
}

export default previousPurchases;