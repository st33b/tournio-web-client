import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamRegistrationSaved} from "../../../store/actions/registrationActions";
import {useEffect} from "react";
import {useTheTournament} from "../../../utils";
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

  if (error) {
    return (
      <div>
        <ErrorAlert message={error}/>
      </div>
    );
  }

  if (loading || !tournament) {
    return (
      <div>
        <LoadingMessage message={'Loading the tournament'}/>
      </div>
    )
  }

  ///////////////////////////////////////////

  const teamFormCompleted = (formData) => {
    if (edit) {
      // dispatch and push to review
      dispatch(newTeamRegistrationSaved(formData));
      router.push({
        pathname: '/tournaments/[identifier]/new-team-review',
        query: { identifier: identifier },
      });
    } else {
      // Add a bowlers property, since the team form doesn't. Make sure it's
      // the bowlers the team already has, if any
      const withBowlers = {
        ...formData,
        bowlers: [],
      }
      // then dispatch and push to the bowler intake
      dispatch(newTeamRegistrationSaved(withBowlers));
      router.push({
        pathname: '/tournaments/[identifier]/new-team-bowler',
        query: { identifier: identifier},
      });
    }
  }

  const titleText = edit ? 'Edit Team Details' : 'Team Registration';
  const teamName = edit ? registration.team.name : '';
  const sidebarBowlers = edit ? registration.team.bowlers : [];

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
                   teamName={teamName}
                   bowlers={sidebarBowlers}
                   />
        </div>

        <div className={'col-12 col-md-8'}>
          <ProgressIndicator active={'team'}/>
          <TeamForm tournament={tournament}
                    team={registration.team}
                    submitButtonText={edit? 'Save' : 'Next: Bowlers'}
                    onSubmit={teamFormCompleted} />
        </div>
      </div>
    </>
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
