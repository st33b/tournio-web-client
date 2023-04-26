import {useState, useEffect} from "react";
import {Card, Col, Row} from "react-bootstrap";
import titleCase from 'voca/title_case';

import {fetchTournamentList} from "../../../utils";
import LoadingMessage from "../../ui/LoadingMessage/LoadingMessage";
import TournamentLogo from "../TournamentLogo/TournamentLogo";

import classes from './TournamentCards.module.scss';

const TournamentCards = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const onFetchSuccess = (data) => {
    setTournaments(data);
    setLoading(false);
  }

  const onFetchFailure = (data) => {
    setLoading(false);
  }

  useEffect(() => {
    fetchTournamentList(onFetchSuccess, onFetchFailure);
  }, []);

  if (loading) {
    return <LoadingMessage message={'Retrieving list of tournaments...'}/>
  }

  return (
    <div className={classes.TournamentCards}>
      {tournaments.length === 0 && <h6 className={'display-6 fw-light mt-4'}>No upcoming tournaments at the moment.</h6>}
      {tournaments.length > 0 && (
        <Row xs={1} sm={2} lg={3}>
          {tournaments.map((t) => {
            let bgColor = '';
            let textColor = '';
            // let textColor = 'success-text-emphasis';
            switch (t.state) {
              case 'active':
                // bgColor = 'bg-success-subtle';
                break;
              case 'closed':
                // textColor = 'secondary-text-emphasis';
                // bgColor = 'bg-secondary-subtle';
                break;
              default:
                // textColor = 'danger-text-emphasis';
                // bgColor = 'bg-danger';
            }
            return (
              <div className={`mb-3 ${classes.Tournament}`} key={t.identifier}>
                <Card>
                  <Card.Header className={`bg-gradient ${t.state === 'active' ? classes.Active : classes.Closed}`}>
                  {/*<Card.Header className={`card-header ${bgColor} bg-gradient ${textColor}`}>*/}
                    {t.status}
                  </Card.Header>
                  <Card.Body>
                    <Row className={'g-1'}>
                      <Col xs={4}>
                        <TournamentLogo url={t.image_url}/>
                      </Col>
                      <Col className={'ps-2'}>
                        <Card.Title className={'mb-3'}>
                          <Card.Link href={`/tournaments/${t.identifier}`}>
                            {t.name}
                          </Card.Link>
                        </Card.Title>
                        <Card.Text>
                          {t.location}
                        </Card.Text>
                        <Card.Text>
                          {t.start_date}
                        </Card.Text>
                        <Card.Text className={'py-0 text-end'}>
                          <Card.Link className={'btn btn-outline-primary text-primary-emphasis'}
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
  )
}

export default TournamentCards;
