import {Accordion, Placeholder} from "react-bootstrap";

import ConfigItem from "./ConfigItem";

import classes from './ActiveTournament.module.scss';

const Configuration = ({eventKey, tournament}) => {
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
  if (tournament) {
    content = (
      <dl>
        {tournament.config_items.map((item) => {
          if (item.key === 'display_capacity' || item.key === 'email_in_dev') {
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