import Breadcrumb from "react-bootstrap/Breadcrumb";

import classes from './Breadcrumbs.module.scss';

// props:
// - activeText (string to display at the end)
// - ladder (array of {text, path} pairs to display in sequence
// Breadcrumbs ladder=[{text: 'Tournaments', path: '/director/tournaments'}] active={'Big D Classic 2023'}
const breadcrumbs = (props) => {
  return (
    <div className={classes.Breadcrumbs}>
      <Breadcrumb className={'bg-light py-2 ps-2'}>
        {/* sequential list of crumbs... */}
        {props.ladder.map((item, i) => {
          return (
            <Breadcrumb.Item href={item.path} key={i}>
              {item.text}
            </Breadcrumb.Item>
          );
        })}
        <Breadcrumb.Item active={true} className={classes.ActiveItem}>
          {props.activeText}
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default breadcrumbs;