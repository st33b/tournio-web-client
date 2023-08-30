import RegistrationLayout from "../../../components/Layout/RegistrationLayout/RegistrationLayout";
import TeamForm from "../../../components/Registration/TeamForm/TeamForm";
import {useRouter} from "next/router";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {newTeamInfoEdited, newTeamRegistrationInitiated} from "../../../store/actions/registrationActions";
import {useEffect} from "react";
import {useClientReady} from "../../../utils";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";

const Page = ({edit=false}) => {
  const {registration, dispatch} = useRegistrationContext();
  const router = useRouter();

  // If new-team registrations aren't enabled, go back to the tournament home page
  useEffect(() => {
    if (!registration.tournament) {
      return;
    }
    if (!registration.tournament.registration_options.new_team) {
      router.push(`/tournaments/${registration.tournament.identifier}`);
    }
  }, [registration]);

  const ready = useClientReady();
  if (!ready || !registration.tournament) {
    return (
      <div>
        <LoadingMessage message={'Getting the registration form ready'}/>
      </div>
    )
  }

  ///////////////////////////////////////////

  const teamFormCompleted = (formData) => {
    let editQueryParam = '';
    if (!edit) {
      dispatch(newTeamRegistrationInitiated(formData));
    } else {
      editQueryParam = '?edit=true';
      dispatch(newTeamInfoEdited(formData));
    }
    router.push(`/tournaments/${registration.tournament.identifier}/new-team-first-bowler${editQueryParam}`);
  }

  return (
    <div>
      <div className={`display-2 text-center mt-3`}>
        {registration.tournament.abbreviation} {registration.tournament.year}
      </div>

      <hr />

      <h2 className={`text-center flex-grow-1`}>
        Create a Team
      </h2>

      <hr />

      <TeamForm shifts={registration.tournament.shifts}
                maxBowlers={registration.tournament.team_size}
                onSubmit={teamFormCompleted} />
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
