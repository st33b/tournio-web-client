import {useState, useEffect} from "react";

import {fetchTournamentList} from "../../../utils";

import classes from './TournamentCards.module.scss';
import LoadingMessage from "../../ui/LoadingMessage/LoadingMessage";

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
    return <LoadingMessage message={'Retrieving list of tournaments...'} />
  }

  return (
    <div className={classes.TournamentCards}>
      {tournaments.length === 0 && <p>No tournaments to display.</p>}
      {tournaments.length > 0 && (
        <div className={'row'}>
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
              <div className={`col-12 col-sm-6 col-md-4 mb-3 ${classes.Tournament}`}key={t.identifier}>
                <div className={'card h-100'} >
                  <div className={`card-header ${bgColor} ${textColor}`}>
                    {t.status}
                  </div>
                  <div className={'card-body d-flex flex-column'}>
                    <p className={'d-block text-center d-none d-sm-block'}>
                      <img src={t.image_path}
                           className={`card-img-top ${classes.Logo}`}
                           alt={'Tournament logo'} />
                    </p>
                    <h6 className={'card-title'}>
                      <a href={`/tournaments/${t.identifier}`}>
                        {t.name}
                      </a>
                    </h6>
                    <p className={'card-text'}>
                      {t.location}
                    </p>
                    <p className={'card-text'}>
                      {t.start_date}
                    </p>
                    <p className={'card-text text-end mt-auto'}>
                      <a className={'btn btn-sm btn-outline-primary'}
                         href={`/tournaments/${t.identifier}`}>
                        Go
                        <i className={'bi-chevron-right ps-2'} aria-hidden={true} />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default TournamentCards;