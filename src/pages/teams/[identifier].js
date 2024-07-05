import {useRouter} from "next/router";
import InformationLayout from "../../components/Layout/InformationLayout/InformationLayout";
import LoadingMessage from "../../components/ui/LoadingMessage/LoadingMessage";
import {devConsoleLog, useTeam} from "../../utils";

const Page = () => {
  devConsoleLog("------------ page untouched in team restoration");
  const router = useRouter();
  const {identifier} = router.query;

  const teamRetrieved = (team) => {
    const tournamentId = team.tournament.identifier;

    // Redirect to the actual team page
    router.push({
          pathname: `/tournaments/[identifier]/teams/[teamIdentifier]`,
          query: {
            identifier: tournamentId,
            teamIdentifier: identifier,
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
      <InformationLayout>
        {page}
      </InformationLayout>
  );
}

export default Page;
