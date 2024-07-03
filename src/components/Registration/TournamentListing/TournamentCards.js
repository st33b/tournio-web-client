import {Card, Col, Row} from "react-bootstrap";
import TournamentLogo from "../TournamentLogo/TournamentLogo";

import classes from './TournamentCards.module.scss';

const TournamentCards = ({tournaments}) => (
  <div className={classes.TournamentCards}>
    {!tournaments || tournaments.length === 0 && (
      <h6 className={'display-6 fw-light mt-4'}>
        No upcoming tournaments at the moment.
      </h6>
    )}
    {tournaments.length > 0 && (
      <Row xs={1} md={2} xxl={3}>
        {tournaments.map((t) => {
          let stateClass = '';
          if (['setup', 'testing'].includes(t.state)) {
            stateClass = t.state + 'State';
          }
          return (
            <div className={`mb-3`} key={t.identifier}>
              <Card className={`${classes[stateClass]}`}>
                <Card.Body>
                  <Row className={'g-1'}>
                    <Col xs={4}>
                      <TournamentLogo url={t.imageUrl}/>
                    </Col>
                    <Col className={'ps-2'}>
                      <Card.Title className={'mb-2'}>
                        <Card.Link href={`/tournaments/${t.identifier}`}>
                          {t.name}
                        </Card.Link>
                      </Card.Title>
                      <Card.Text className={`mb-0`}>
                        {t.location}
                      </Card.Text>
                      <Card.Text>
                        {t.startingDate}
                      </Card.Text>
                      {t.state === 'closed' && (
                        <Card.Text className={`fst-italic`}>
                          Registration is <strong>CLOSED</strong>.
                        </Card.Text>
                      )}
                      <Card.Text className={'py-0 text-end'}>
                        <Card.Link className={'btn btn-primary'}
                                   href={`/tournaments/${t.identifier}`}>
                          Go
                          <i className={'bi-chevron-right ps-2'} aria-hidden={true}/>
                        </Card.Link>
                      </Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </Row>
    )}
  </div>
);

export default TournamentCards;
