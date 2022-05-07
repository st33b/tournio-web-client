import classes from './ProgressBarLegend.module.scss';

const ProgressBarLegend = () => (
  <div className={classes.ProgressBarLegend}>
    <div className={`d-flex justify-content-end pt-2`}>
      <div>
        <div>
          <i className={'bi-square-fill text-success pe-2'}/>
          <span className={'visually-hidden'}>Green</span>
          Confirmed*
        </div>
        <div>
          <i className={'bi-square-fill text-primary pe-2'}/>
          <span className={'visually-hidden'}>Blue</span>
          Requested
        </div>
        <div>
          <i className={`${classes.Available} bi-square-fill pe-2`}/>
          <span className={'visually-hidden'}>Gray</span>
          Available
        </div>
      </div>
    </div>
    <div className={classes.ConfirmedNote}>
      * A team's place in a shift is not confirmed until all team members have paid their registration fees.
    </div>
  </div>
);

export default ProgressBarLegend;