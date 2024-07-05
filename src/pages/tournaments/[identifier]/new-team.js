import InformationLayout from "../../../components/Layout/InformationLayout/InformationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationSaved} from "../../../store/actions/registrationActions";
import {useEffect} from "react";
import {devConsoleLog, useTheTournament} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import ErrorAlert from "../../../components/common/ErrorAlert";
import Sidebar from "../../../components/Registration/Sidebar/Sidebar";
import ProgressIndicator from "../../../components/Registration/ProgressIndicator/ProgressIndicator";
import TournamentLogo from "../../../components/Registration/TournamentLogo/TournamentLogo";
import Link from "next/link";

const Page = () => {
  const {dispatch, registration} = useRegistrationContext();
  const router = useRouter();
  const {identifier, edit} = router.query;

  const {tournament, loading, error} = useTheTournament(identifier);

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!tournament || !identifier) {
      return;
    }
    if (!tournament.registrationOptions.new_team) {
      router.push(`/tournaments/${identifier}`);
    }
  }, [tournament, identifier]);

  if (loading || !tournament) {
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

  ///////////////////////////////////////////

  const teamFormCompleted = (formData) => {
    dispatch(newTeamRegistrationSaved(formData));

    if (edit) {
      devConsoleLog("Team data updated, pushing to review.");
      router.push({
        pathname: '/tournaments/[identifier]/new-team-review',
        query: { identifier: identifier },
      });
    } else {
      devConsoleLog("Team data saved, moving on to bowler entry.");
      router.push({
        pathname: '/tournaments/[identifier]/new-team-bowler',
        query: { identifier: identifier},
      });
    }
  }

  const titleText = edit ? 'Edit Team Details' : 'Team Registration';

  return (
    <>
      <div className={'row d-md-none'}>
        <div className={'col-5'}>
          <Link href={`/tournaments/${identifier}`}>
            <TournamentLogo url={tournament.imageUrl} additionalClasses={'mb-2'}/>
          </Link>
        </div>
        <p className={'col display-4'}>
          {titleText}
        </p>
      </div>

      <div className={'row'}>
        <div className={'col-12 col-md-4'}>

          <div className={'d-none d-md-block'}>
            <Link href={`/tournaments/${identifier}`}>
              <TournamentLogo url={tournament.imageUrl}/>
            </Link>
            <p className={'col display-5'}>
              {titleText}
            </p>
          </div>

          <Sidebar tournament={tournament}
                   isTeam={true}/>
        </div>

        <div className={'col-12 col-md-8'}>
          <ProgressIndicator active={'team'}/>
          <TeamForm tournament={tournament}
                    team={registration.team}
                    onSubmit={teamFormCompleted} />
        </div>
      </div>
    </>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <InformationLayout>
      {page}
    </InformationLayout>
  );
}

export default Page;
