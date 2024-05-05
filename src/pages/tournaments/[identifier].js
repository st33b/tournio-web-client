import {useRouter} from "next/router";
import {Row, Col} from "react-bootstrap";

import {devConsoleLog, useTheTournament, useTournament} from "../../utils";
import {useRegistrationContext} from "../../store/RegistrationContext";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import TournamentLogo from "../../components/Registration/TournamentLogo/TournamentLogo";
import Contacts from "../../components/Registration/Contacts/Contacts";

import classes from "../../components/Registration/TournamentDetails/TournamentDetails.module.scss";
import {tournamentDetailsRetrieved} from "../../store/actions/registrationActions";
import Heading from "../../components/Registration/TournamentDetails/Heading";
import RegisterButtons from "../../components/Registration/TournamentDetails/RegisterButtons";
import PayButton from "../../components/Registration/TournamentDetails/PayButton";
import Shifts from "../../components/Registration/TournamentDetails/Shifts";
import YouWillNeed from "../../components/Registration/TournamentDetails/YouWillNeed";
import StateBanners from "../../components/Registration/TournamentDetails/StateBanners";
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../components/common/ErrorAlert";
import TraditionalPriceBreakdown from "../../components/Registration/TournamentDetails/TraditionalPriceBreakdown";
import EventPriceBreakdown from "../../components/Registration/TournamentDetails/EventPriceBreakdown";

const Page = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const registrationContext = useRegistrationContext();

  const onFetchSuccess = (data) => {
    devConsoleLog("Success. Dispatching to context. But we won't need to for long.");
    registrationContext.dispatch(tournamentDetailsRetrieved(data));
  }

  const {tournament, loading, error} = useTournament(identifier, onFetchSuccess)
  const {tournament: tourn} = useTheTournament(identifier);

  if (loading || !tournament || !tourn) {
    return (
      <div>
        <LoadingMessage message={'Loading the tournament'}/>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <ErrorAlert message={error}/>
      </div>
    );
  }

  return (
    <div className={classes.TournamentDetails}>
      <Row>
        <Col xs={12}>
          <StateBanners tournament={tourn}/>
        </Col>
      </Row>
      <Row>
        <Col xs={{order: 2}} md={{span: 4, order: 1}}>
          <div className={'d-none d-md-flex justify-content-center'}>
            <TournamentLogo url={tourn.imageUrl}/>
          </div>
          <Contacts tournament={tourn}/>
        </Col>
        <Col xs={{order: 1}} md={{span: 8, order: 2}}>
          <div className={'d-flex justify-content-start align-items-start'}>
            <TournamentLogo url={tourn.imageUrl}
                            additionalClasses={'col-4 pe-2 d-md-none'}/>
            <Heading tournament={tourn}/>
          </div>

          <div className={'d-flex'}>
            <div className={'flex-fill w-100'}>
              <div className={classes.Details}>
                <TraditionalPriceBreakdown tournament={tourn}/>
                {/*<EventPriceBreakdown tournament={tournament}/>*/}
              </div>
            </div>
            <div className={'d-none d-xl-block flex-shrink-1'}>
              <YouWillNeed tournament={tournament}/>
            </div>
          </div>

          <PayButton disabled={!!tournament.config_items.find(({key, value}) => key === 'accept_payments' && !value)} />
          <RegisterButtons tournament={tourn}/>

          <div className={'d-xl-none'}>
            <YouWillNeed tournament={tourn}/>
          </div>
          <div className={'mt-4'}>
            <Shifts tournament={tourn}/>
          </div>
        </Col>
      </Row>
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
