import TooltipOverlay from "../../ui/TooltipOverlay/TooltipOverlay";
import classes from "./ActiveTournament.module.scss";

const CardHeader = ({id, headerText, titleText}) => (
  <div className={'card-header d-flex justify-content-between'}>
    <h5 className={''}>
      {headerText}
    </h5>
    {titleText && (
      <TooltipOverlay id={id}
                      title={titleText}>
        <i className={`bi bi-question-circle ps-2 h5 ${classes.TooltipIcon}`}
           aria-hidden={true}/>
      </TooltipOverlay>
    )}
  </div>
);

export default CardHeader;
