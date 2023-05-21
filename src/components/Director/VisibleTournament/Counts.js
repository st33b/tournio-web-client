import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";

import classes from './VisibleTournament.module.scss';
import {Placeholder} from "react-bootstrap";

const Counts = ({tournament}) => {
  let content = (
    <Placeholder animation={'glow'}>
      <ListGroup variant={'flush'}>
        <ListGroup.Item>
          <Placeholder xs={4}/>
        </ListGroup.Item>
        <ListGroup.Item>
          <Placeholder xs={6}/>
        </ListGroup.Item>
        <ListGroup.Item>
          <Placeholder xs={5}/>
        </ListGroup.Item>
      </ListGroup>
    </Placeholder>
  );
  if (tournament) {
    content = (
      <ListGroup variant={'flush'}>
        <ListGroup.Item className={'d-flex justify-content-between align-items-center'}
                        action
                        href={`/director/bowlers`}>
          Bowlers
          <Badge pill={true}>
            {tournament.bowler_count}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className={'d-flex justify-content-between align-items-center'}
                        action
                        href={`/director/teams`}>
          Teams
          <Badge pill={true}>
            {tournament.team_count}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className={'d-flex justify-content-between align-items-center'}
                        action
                        href={`/director/free_entries`}>
          Free Entries
          <Badge pill={true}>
            {tournament.free_entry_count}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    );
  }
  return (
    <div className={classes.Counts}>
      <Card>
        {content}
      </Card>
    </div>
  );
}

export default Counts;
