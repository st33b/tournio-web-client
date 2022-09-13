import {useEffect} from "react";
import {useRouter} from "next/router";
import DirectorLayout from '../../components/Layout/DirectorLayout/DirectorLayout';
import {useDirectorContext} from "../../store/DirectorContext";
import {directorApiLogoutRequest} from "../../utils";
import {reset} from "../../store/actions/directorActions";

const Logout = () => {
  const router = useRouter();
  const directorContext = useDirectorContext();
  const dispatch = directorContext.dispatch;

  useEffect(() => {
    if (!directorContext) {
      return;
    }
    directorApiLogoutRequest({
      context: directorContext,
      onSuccess: () => {
        dispatch(reset());
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