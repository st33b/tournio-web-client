import {useRouter} from "next/router";
import RegistrationLayout from "../../../../components/Layout/RegistrationLayout/RegistrationLayout";
import {useEffect} from "react";
import LoadingMessage from "../../../../components/ui/LoadingMessage/LoadingMessage";

const Page = () => {
  const router = useRouter();
  const {identifier, teamIdentifier} = router.query;

  useEffect(() => {
    if (!identifier || !teamIdentifier) {
      return;
    }
    // Redirect to the path with chosen = 1
    router.replace({
          pathname: `/tournaments/[identifier]/teams/[teamIdentifier]/[chosen]`,
          query: {
            identifier: identifier,
            teamIdentifier: teamIdentifier,
            chosen: 1,
          },
        },
        null,
        { shallow: true }
    );
  }, [identifier, teamIdentifier]);

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
