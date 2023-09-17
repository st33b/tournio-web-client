import {useRouter} from "next/router";
import RegistrationLayout from "../../components/Layout/RegistrationLayout/RegistrationLayout";
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import {useTeam} from "../../utils";

const Page = () => {
  const router = useRouter();
  const {identifier} = router.query;

  const teamRetrieved = (team) => {
    const tournamentId = team.tournament.identifier;

    // Redirect to the actual team page, with chosen = 1
    router.push({
          pathname: `/tournaments/[identifier]/teams/[teamIdentifier]/[chosen]`,
          query: {
            identifier: tournamentId,
            teamIdentifier: identifier,
            chosen: 1,
          },
        },
        null,
        { shallow: true }
    );
  }

  useTeam(identifier, teamRetrieved);

  return (
      <div>
        <LoadingMessage message={'Retrieving team details...'}/>
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
