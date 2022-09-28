import {useRouter} from "next/router";
import Card from "react-bootstrap/Card";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import {tournamentDeleted, tournamentDetailsReset} from "../../../store/actions/directorActions";
import {devConsoleLog} from "../../../utils";

const DeleteTournament = ({tournament}) => {
  const context = useDirectorContext();
  const {directorState, dispatch} = context;
  const router = useRouter();

  if (!context || !tournament || !directorState.user) {
    return '';
  }

  if (directorState.user.role !== 'superuser') {
    return '';
  }

  const deleteSuccess = (_) => {
    dispatch(tournamentDeleted(tournament));
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
    const uri = `/director/tournaments/${tournament.identifier}`;
    const requestConfig = {
      method: 'delete',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: deleteSuccess,
      onFailure: deleteFailure,
    });
  }

  return (
    <Card className={'border-0 text-center'}>
      <Card.Body>
        <button type={'button'}
                className={'btn btn-lg btn-danger'}
                onClick={deleteClicked}>
          Delete Tournament
        </button>
      </Card.Body>
    </Card>
  );
}

export default DeleteTournament;