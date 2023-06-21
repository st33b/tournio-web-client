import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";

import classes from './VisibleTournament.module.scss';
import {Placeholder} from "react-bootstrap";
import {useTournament} from "../../../director";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

const Counts = () => {
  const router = useRouter();
  const {loading, tournament} = useTournament();
  const [currentPath, setCurrentPath] = useState();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setCurrentPath(router.asPath);
  }, [router.isReady]);

  if (loading) {
    return (
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
  }

  return (
    <div className={classes.Counts}>
      <Card>
        <ListGroup variant={'flush'}>
          <ListGroup.Item className={'d-flex justify-content-between align-items-center'}
                          variant={'primary'}
                          action={true}
                          as={Link}
                          href={`${currentPath}/bowlers`}>
            Bowlers
            <Badge pill={true}>
              {tournament.bowler_count}
            </Badge>
          </ListGroup.Item>
          <ListGroup.Item className={'d-flex justify-content-between align-items-center'}
                          variant={'primary'}
                          action={true}
                          as={Link}
                          href={`${currentPath}/teams`}>
            Teams
            <Badge pill={true}>
              {tournament.team_count}
            </Badge>
          </ListGroup.Item>
          <ListGroup.Item className={'d-flex justify-content-between align-items-center'}
                          variant={'primary'}
                          action={true}
                          as={Link}
                          href={`${currentPath}/free_entries`}>
            Free Entries
            <Badge pill={true}>
              {tournament.free_entry_count}
            </Badge>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
}

export default Counts;
