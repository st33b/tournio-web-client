import classes from "./ActiveTournament.module.scss";
import Toggle from "./Toggle";
import CardHeader from "./CardHeader";
import {useEffect, useState} from "react";
import {devConsoleLog, updateObject} from "../../../utils";

const RegistrationOptions = ({rosterTypes, options, onChange}) => {
  const [formValues, setFormValues] = useState({
    // new_team solo new_pair standard
    solo: false,
    new_team: false,
    new_pair: false,
    // standard: false,
  });

  useEffect(() => {
    if (!rosterTypes || !options) {
      return;
    }
    const changedFormOptions = {
      ...formValues,
      ...options
    };
    setFormValues(changedFormOptions);
  },[rosterTypes, options])

  const toggled = (event) => {
    const name = event.target.name.split('--')[1];
    const newValue = !formValues[name];
    setFormValues(updateObject(formValues, {
      ...formValues,
      [name]: newValue,
    }));

  }

  return (
    <div className={classes.RegistrationOptions}>
      <div className="card mb-3">
        <CardHeader headerText={'Registration Options'}
                    titleText={'Enable and disable these options without closing registration entirely.'}
                    id={'registration-options--tooltip'}/>
        <ul className={'list-group list-group-flush'}>
          {rosterTypes.some(rt => rt === 'single') && (
            <li className={'list-group-item'}>
              <Toggle name={`registration_options--solo`}
                      label={'Solo entries'}
                      htmlId={`registration_options--solo`}
                      checked={options.solo}
                      onChange={toggled}
              />
            </li>
          )}
          {rosterTypes.some(rt => rt === 'team') && (
            <li className={'list-group-item'}>
              <Toggle name={`registration_options--new_team`}
                      label={'Team entries'}
                      htmlId={`registration_options--new_team`}
                      checked={formValues.new_team}
                      onChange={toggled}
              />
            </li>
          )}
        </ul>
      </div>
    </div>

    // <div>
    //   <h5>
    //     Registration Options
    //   </h5>
    //   <div className="row pb-3">
    //     <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
    //     <span className={"col ms-3"}>
    //       Solo entries
    //     </span>
    //   </div>
    //
    //   <div className="row pb-3">
    //     <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
    //     <span className={"col ms-3"}>
    //       Team entries
    //     </span>
    //   </div>
    // </div>
  );
};

export default RegistrationOptions;
