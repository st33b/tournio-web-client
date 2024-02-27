import {useRouter} from "next/router";
import Link from 'next/link';

import DirectorLayout from "../../../components/Layout/DirectorLayout/DirectorLayout";
import LoadingMessage from "../../../components/ui/LoadingMessage/LoadingMessage";
import {directorApiRequest, useDirectorApi} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import ErrorAlert from "../../../components/common/ErrorAlert";
import TournamentOrgForm from "../../../components/Director/TournamentOrgForm/TournamentOrgForm";
import {useState} from "react";

const Page = () => {
  const router = useRouter();
  const {user, authToken} = useLoginContext();

  const [creationInProgress, setCreationInProgress] = useState(false);
  const {loading, data: tournamentOrgs, error, onDataUpdate} = useDirectorApi({
    uri: '/tournament_orgs',
  });

  if (loading || !user) {
    return <LoadingMessage message={'Retrieving tournament organizations...'} />;
  }

  if (!tournamentOrgs) {
    return <ErrorAlert message={'Failed to load the orgs'} />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  // Naughty naughty!
  if (user && user.role !== 'superuser') {
    router.push('/director/logout');
  }

  const orgCreated = (org) => {
    const newOrgs = tournamentOrgs.concat(org);
    onDataUpdate(newOrgs);
    setCreationInProgress(false);
  }

  const newOrgFormSubmitted = (orgName, onSuccess = () => {}, onFailure = () => {}) => {
    const uri = '/tournament_orgs';
    const method = 'post';
    const postData = {
      name: orgName,
    }
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method,
      data: {
        tournament_org: postData,
      }
    }

    setCreationInProgress(true);
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: (data) => {
        orgCreated(data);
        onSuccess();
      },
      onFailure: onFailure(),
    });
  }

  return (
    <div className={'row'}>
      <table className={`table table-striped col`}>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Identifier
            </th>
            <th>
              Tournaments
            </th>
            <th>
              # of Users
            </th>
          </tr>
        </thead>
        <tbody>
          {tournamentOrgs.map(org => (
            <tr key={org.identifier}>
              <td>
                {org.name}
              </td>
              <td>
                {org.identifier}
              </td>
              <td>
                {org.tournaments.length === 0 && 'None'}
                {org.tournaments.length > 0 && (
                  <ul>
                    {org.tournaments.map(t => (
                      <li key={t.identifier}>
                        <Link href={`/director/tournaments/${t.identifier}`}>
                          {t.abbreviation} ({t.year})
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td>
                {org.users.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={'col-12 col-sm-7 col-md-5 col-lg-4 col-xl-3'}>
        {creationInProgress && <LoadingMessage message={'Working...'}/>}
        {!creationInProgress && <TournamentOrgForm onSubmit={newOrgFormSubmitted}/>}
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <DirectorLayout>
      {page}
    </DirectorLayout>
  );
}

export default Page;
