import {useRouter} from "next/router";

import {devConsoleLog, useBowlers, useTheTournament} from "../../../utils";
import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import BowlerList from "../../../components/Registration/BowlerList/BowlerList";
import ErrorAlert from "../../../components/common/ErrorAlert";

const Page = () => {
  const router = useRouter();
  const { identifier } = router.query;

  const onBowlersRetrieved = (data) => {
    const bowlerComparison = (left, right) => {
      return left.listName.toLocaleLowerCase().localeCompare(right.listName.toLocaleLowerCase());
    }
    // data.sort(bowlerComparison);
  }

  const {tournament, loading: tournamentLoading, error: tournamentError} = useTheTournament(identifier);
  const {bowlers, loading: bowlersLoading, error} = useBowlers(identifier, onBowlersRetrieved);

  if (bowlersLoading || tournamentLoading) {
    return <LoadingMessage message={'Retrieving list of bowlers...'}/>
  }

  if (!bowlers) {
    return <LoadingMessage message={'No bowlers yet...'}/>
  }

  return (
    <div>
      <div className={`row`}>
        <div className={'col-4 d-md-none'}>
          <TournamentLogo url={tournament.imageUrl}/>
        </div>
        <div className={`col-8 d-md-none d-flex flex-column justify-content-around`}>
          <h4 className={'text-start'}>
            <a href={`/tournaments/${identifier}`} title={'To tournament page'}>
              {tournament.name}
            </a>
          </h4>
          <h5 className={`m-0`}>
            Registered Bowlers
          </h5>
        </div>
        <div className={'col-4 d-none d-md-block'}>
          <a href={`/tournaments/${identifier}`} title={'To tournament page'}>
            <TournamentLogo url={tournament.imageUrl}/>
            <h4 className={'text-center py-3'}>{tournament.name}</h4>
          </a>
        </div>
        <div className={`col`}>
          <h5 className={`d-none d-md-block`}>
            Registered Bowlers
          </h5>
          {tournamentError && <ErrorAlert message={tournamentError} className={``}/>}
          {error && <ErrorAlert message={error} className={``}/>}
          <ErrorAlert message={'I have yet to display the list of bowlers.'} className={``}/>
          <BowlerList bowlers={bowlers}
          />
        </div>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <RegistrationLayout>
      {page}
    </RegistrationLayout>
  );
}

export default Page;
