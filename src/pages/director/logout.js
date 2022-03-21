import DirectorLayout from '../../components/Layout/DirectorLayout/DirectorLayout';
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useDirectorContext} from "../../store/DirectorContext";
import {directorApiLogoutRequest} from "../../utils";

const Logout = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();

  useEffect(() => {
    if (!directorContext) {
      return;
    }
    directorApiLogoutRequest({
      context: directorContext,
      onSuccess: () => {
        router.push('/director/login')
      },
      onFailure: (_) => {},
    })
  }, [directorContext, router]);

  return (
    <div>
      <h5>Log Out</h5>
    </div>
  );
}

Logout.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Logout;