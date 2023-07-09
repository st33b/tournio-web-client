import {Accordion, Placeholder} from "react-bootstrap";

import ConfigItem from "./ConfigItem";

import classes from './VisibleTournament.module.scss';
import {useTournament} from "../../../director";

const Configuration = ({eventKey, excludedKeys}) => {
  const {loading, tournament} = useTournament();
  let content = (
    <Placeholder animation={'glow'}>
      <Placeholder xs={3} />{' '}
      <Placeholder xs={8} />
      <Placeholder xs={4} />{' '}
      <Placeholder xs={7} />
      <Placeholder xs={3} />{' '}
      <Placeholder xs={8} />
      <Placeholder xs={4} />{' '}
      <Placeholder xs={7} />
    </Placeholder>
  )

  if (!loading && excludedKeys) {
    content = (
      <dl>
        {tournament.config_items.map((item) => {
          if (excludedKeys.includes(item.key)) {
            return '';
          }
          return (
            <ConfigItem item={item} key={item.key} />
          )
        })}
      </dl>
    )
  }

  return (
    <Accordion.Item eventKey={eventKey} className={classes.Configuration}>
      <Accordion.Header as={'h5'} className={classes.AccordionHeader}>
        Configuration
      </Accordion.Header>
      <Accordion.Body className={classes.AccordionBody}>
        {content}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default Configuration;
