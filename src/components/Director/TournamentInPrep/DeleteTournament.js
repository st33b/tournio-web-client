import {useDirectorContext} from "../../../store/DirectorContext";
import {useRouter} from "next/router";
import {directorApiRequest} from "../../../utils";

const DeleteTournament = () => {
  const context = useDirectorContext();
  const router = useRouter();

  if (!context || !context.user) {
    return '';
  }

  if (context.user.role !== 'superuser') {
    return '';
  }

  if (context.tournament.state === 'active') {
    return '';
  }

  const deleteSuccess = (_) => {
    router.push('/director/tournaments');
  }

  const deleteFailure = (data) => {
    console.log("Well, that didn't work out.", data);
  }

  const deleteClicked = (event) => {
    event.preventDefault();
    if (!confirm("This cannot be undone. Are you sure?")) {
      return;
    }
    const uri = `/director/tournaments/${context.tournament.identifier}`;
    const requestConfig = {
      method: 'delete',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: deleteSuccess,
      onFailure: deleteFailure,
    });
  }

  return (
    <div className={'d-flex justify-content-center border-top pt-3'}>
      <button type={'button'}
              className={'btn btn-lg btn-danger'}
              onClick={deleteClicked}>
        Delete Tournament
      </button>
    </div>
  );
}

export default DeleteTournament;