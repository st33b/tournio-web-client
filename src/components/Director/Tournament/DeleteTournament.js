// @admin
import {useRouter} from "next/router";
import Card from "react-bootstrap/Card";

import {directorApiRequest, useTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import React, {useState} from "react";

const DeleteTournament = () => {
  const {user, authToken} = useLoginContext();
  const {loading, tournament} = useTournament();
  const router = useRouter();
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  if (loading || !user) {
    return '';
  }

  if (user.role !== 'superuser') {
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
    const uri = `/tournaments/${tournament.identifier}`;
    const requestConfig = {
      method: 'delete',
    }
    setDeleteInProgress(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: deleteSuccess,
      onFailure: deleteFailure,
    });
  }

  return (
    <Card className={'border-0 text-center'}>
      <Card.Body>
        <button type={'button'}
                className={'btn btn-lg btn-danger'}
                disabled={deleteInProgress}
                onClick={deleteClicked}>
          {deleteInProgress && (
            <span>
              <span className={'spinner-border spinner-border-sm me-2'} role={'status'} aria-hidden={true}></span>
            </span>
          )}
          Delete Tournament
        </button>
      </Card.Body>
    </Card>
  );
}

export default DeleteTournament;
