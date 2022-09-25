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

  let stepClass = classes.Done;
  return (
    <div className={classes.Progress}>
      {steps.map(({key, display}, i) => {
        const onActiveStep = i == activeIndex;
        if (onActiveStep) {
          stepClass = classes.Active;
        }
        const content = (
          <div className={`${classes.Step} ${stepClass}`} key={key}>
            <h6>
              {i < activeIndex  && (
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
        if (onActiveStep) {
          stepClass = classes.Upcoming;
        }
        return content;
      })}
    </div>
  );
}

export default Progress;

