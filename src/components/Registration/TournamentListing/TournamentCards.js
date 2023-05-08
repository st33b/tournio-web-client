import {useState, useEffect} from "react";

import {fetchTournamentList} from "../../../utils";

import classes from './TournamentCards.module.scss';
import LoadingMessage from "../../ui/LoadingMessage/LoadingMessage";
import {Card, Col, Image, Row} from "react-bootstrap";
import TournamentLogo from "../TournamentLogo/TournamentLogo";

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
            let textColor = 'text-white';
            switch (t.state) {
              case 'active':
                bgColor = 'bg-success';
                break;
              case 'closed':
                bgColor = 'bg-secondary';
                break;
              default:
                bgColor = 'bg-dark';
            }
            return (
              <div className={`mb-3 ${classes.Tournament}`} key={t.identifier}>
                <Card>
                  <Card.Header className={`card-header ${bgColor} ${textColor}`}>
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
                          <Card.Link className={'btn btn-outline-primary'}
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
