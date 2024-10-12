import classes from "./ActiveTournament.module.scss";
import Toggle from "./Toggle";
import TooltipOverlay from "../../ui/TooltipOverlay/TooltipOverlay";

const RegistrationOptions = ({rosterTypes, options}) => {

  return (
    <div className={classes.RegistrationOptions}>
      <div className="card mb-3">
        <div className={'card-header d-flex justify-content-between align-items-baseline'}>
          <h5 className={''}>
            Registration Options
          </h5>
          <TooltipOverlay id={`optional-items--tooltip`} title={'Enable and disable these options without closing registration entirely.'}>
            <i className={`bi bi-question-circle ps-2 h5 ${classes.TooltipIcon}`}
               aria-hidden={true}/>
          </TooltipOverlay>
        </div>
        <ul className={'list-group list-group-flush'}>
          {rosterTypes.some(rt => rt === 'single') && (
            <li className={'list-group-item'}>
              <Toggle name={`registration_options--single`}
                      label={'Solo entries'}
                      htmlId={`registration_options--single`}
                      checked={!!options['solo']}
                      onChange={() => {}}
              />
            </li>
          )}
          {rosterTypes.some(rt => rt === 'team') && (
            <li className={'list-group-item'}>
              <Toggle name={`registration_options--team`}
                      label={'Team entries'}
                      htmlId={`registration_options--team`}
                      checked={!!options['new_team']}
                      onChange={() => {}}
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
