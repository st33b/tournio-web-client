import classes from './TournamentDetails.module.scss';
import {useRouter} from "next/router";
import Button from "react-bootstrap/Button";

const RegisterButtons = ({tournament}) => {
  const router = useRouter();
  if (!tournament) {
    return '';
  }

  const optionTypes = [
    {
      name: 'solo',
      path: 'solo-bowler',
      linkText: 'Register Solo',
    },
    {
      name: 'new_team',
      path: 'new-team',
      linkText: 'Register a Team',
    },
    {
      name: 'new_pair',
      path: 'new-pair',
      linkText: 'Register a Pair',
    },
  ];

  let registrationOptions = '';
  if (['testing', 'active', 'demo'].includes(tournament.state)) {
    if (['single_event', 'igbo_non_standard'].includes(tournament.config.tournament_type)) {
      // Includes fundraisers, mixers, and unique tournaments like DAMIT
      // only show what's enabled
      registrationOptions = optionTypes.map(({name, path, linkText}) => {
        if (!tournament.registrationOptions[name]) {
          return '';
        }
        return (
          <Button key={name}
                  className={`col-8 col-lg-auto mx-auto mx-lg-0 my-2 my-lg-0 ${classes.Action}`}
                  variant={'primary'}
                  href={`${router.asPath}/${path}`}>
            {linkText}
          </Button>
        );
      });
    } else {
      registrationOptions = optionTypes.map(({name, path, linkText}) => {
        // No new_pair for a standard tournament
        if (name === 'new_pair') {
          return '';
        }
        const enableLink = tournament.registrationOptions[name];
        return (
          <Button key={name}
                  className={`col-8 col-lg-auto mx-auto mx-lg-0 my-2 my-lg-0 ${classes.Action} ${enableLink ? '' : 'text-decoration-line-through'}`}
                  variant={'primary'}
                  disabled={!enableLink}
                  href={enableLink ? `${router.asPath}/${path}` : undefined}>
            {linkText}
          </Button>
        );
      });
    }
  }

  return (
    <div className={`d-flex flex-column flex-lg-row justify-content-lg-around mt-2 mb-3 ${classes.Actions}`}>
      {registrationOptions}
    </div>
  );
}

export default RegisterButtons;
