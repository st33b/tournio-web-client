import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './TournamentBuilder.module.scss';

const Progress = ({activeStep}) => {
  const {directorState, dispatch} = useDirectorContext();

  const steps = [
    {
      key: 'name',
      display: 'Basics',
    },
    {
      key: 'details',
      display: 'Details',
    },
    {
      key: 'dates',
      display: 'Dates',
    },
    {
      key: 'logo',
      display: 'Logo',
    },
    {
      key: 'scoring',
      display: 'Scoring',
    },
    {
      key: 'required_events',
      display: 'Required Events',
    },
    {
      key: 'additional_events',
      display: 'Additional Events',
    },
    {
      key: 'derived_events',
      display: 'Derived Events',
    },
  ];

  const activeIndex = steps.findIndex(({key}) => key === activeStep);

  let activeStepText = '';
  return (
    <div className={classes.Progress}>
      <div className={'d-sm-none'}>
        <div className={'d-flex justify-content-center'}>
          {steps.map(({key, display}, i) => {
            const onActiveStep = i === activeIndex;
            const stepClass = i < activeIndex ? classes.Done : (onActiveStep ? classes.Active : classes.Upcoming);
            const iconClass = i < activeIndex ? 'bi-check2-circle' : (onActiveStep ? 'bi-arrow-down' : 'bi-dash-circle-dotted');
            if (onActiveStep) {
              activeStepText = display;
            }
            return (
              <div className={`flex-fill ${classes.Step} ${stepClass}`} key={key}>
                <a href={i < activeIndex ? `/director/tournaments/new?step=${key}` : null}>
                  <i className={iconClass} aria-hidden={true}/>
                  <span className={'visually-hidden'}>
                    {display}
                  </span>
                </a>
              </div>
            );
          })}
        </div>
        <h6 className={`${classes.StepText} ${classes.Active}`}>
          {activeStepText}
        </h6>
      </div>
      <div className={'d-none d-sm-block'}>
        {steps.map(({key, display}, i) => {
          const stepClass = i < activeIndex ? classes.Done : (i === activeIndex ? classes.Active : classes.Upcoming);
          return (
            <div className={`${classes.Step} ${stepClass}`} key={key}>
              <h6>
                {i < activeIndex && (
                  <a href={`/director/tournaments/new?step=${key}`}
                     className={classes.Text}>
                    {display}
                  </a>
                )}
                {i >= activeIndex && (
                  <span className={classes.Text}>
                    {display}
                  </span>
                )}
              </h6>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Progress;

