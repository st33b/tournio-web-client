import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const TooltipOverlay = ({ id, title, children }) => (
  <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
    {children}
  </OverlayTrigger>
);

export default TooltipOverlay;
