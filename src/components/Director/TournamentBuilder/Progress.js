import {useDirectorContext} from "../../../store/DirectorContext";
import {newTournamentPreviousStepChosen} from "../../../store/actions/directorActions";

import classes from './TournamentBuilder.module.scss';
import {devConsoleLog} from "../../../utils";
import {useEffect, useState} from "react";

const Progress = ({activeStep}) => {
  const {directorState, dispatch} = useDirectorContext();
  const [linkedSteps, setLinkedSteps] = useState([]);
  useEffect(() => {
    if (!directorState || !directorState.builder) {
      return;
    }
    setLinkedSteps(directorState.builder.navigableSteps);
  }, [directorState.builder]);

  if (!linkedSteps) {
    return '';
  }

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
    // {
    //   key: 'required_events',
    //   display: 'Required Events',
    // },
    {
      key: 'additional_events',
      display: 'Additional Events',
    },
    // {
    //   key: 'derived_events',
    //   display: 'Derived Events',
    // },
  ];

  const previousStepClicked = (event, step) => {
    event.preventDefault();
    dispatch(newTournamentPreviousStepChosen(step));
  }

  const activeIndex = steps.findIndex(({key}) => key === activeStep);

  let activeStepText = '';
  return (
    <div className={classes.Progress}>
      <div className={'d-sm-none'}>
        {/* small mobile devices */}
        <div className={'d-flex justify-content-center'}>
          {steps.map(({key, display}, i) => {
            const onActiveStep = i === activeIndex;
            const stepClass = !onActiveStep ? (i < linkedSteps.length ? classes.Done : classes.Upcoming) : classes.Active;
            const iconClass = !onActiveStep ? (i < linkedSteps.length ? 'bi-check2-circle' : 'bi-dash-circle-dotted') : 'bi-arrow-down';
            if (onActiveStep) {
              activeStepText = display;
            }
            const linkTheStep = i !== activeIndex && i < linkedSteps.length;
            return (
              <div className={`flex-fill ${classes.Step} ${stepClass}`} key={key}>
                {linkTheStep && (
                  <a href={`/director/tournaments/new?step=${key}`}
                     onClick={(e) => previousStepClicked(e, key)}>
                    <i className={iconClass} aria-hidden={true}/>
                    <span className={'visually-hidden'}>
                    {display}
                  </span>
                  </a>
                )}
                {!linkTheStep && (
                  <span>
                    <i className={iconClass} aria-hidden={true}/>
                    <span className={'visually-hidden'}>
                      {display}
                    </span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <h6 className={`${classes.StepText} ${classes.Active}`}>
          {activeStepText}
        </h6>
      </div>
      <div className={'d-none d-sm-block'}>
        {/* tablet and larger */}
        {steps.map(({key, display}, i) => {
          const stepClass = i !== activeIndex ? (i < linkedSteps.length ? classes.Done : classes.Upcoming) : classes.Active;
          const linkTheStep = i !== activeIndex && i < linkedSteps.length;
          return (
            <div className={`${classes.Step} ${stepClass}`} key={key}>
              <h6>
                {linkTheStep && (
                  <a href={`/director/tournaments/new?step=${key}`}
                     onClick={(e) => previousStepClicked(e, key)}
                     className={classes.StepText}>
                    {display}
                  </a>
                )}
                {!linkTheStep && (
                  <span className={classes.StepText}>
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

