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
      rosterTypes: ['single', 'double', 'trio', 'team'],
    },
    {
      name: 'new_team',
      path: 'new-team',
      linkText: 'Register a Team',
      rosterTypes: ['trio', 'team'],
    },
    {
      name: 'new_pair',
      path: 'new-pair',
      linkText: 'Register a Doubles Pair',
      rosterTypes: ['single', 'double'],
    },
  ];

  let registrationOptions = '';
  if (['testing', 'active', 'demo'].includes(tournament.state)) {
    if (tournament.config.tournament_type === 'single_event' && tournament.events[0].rosterType === 'single') {
      // Because 'Register Solo' seems odd in this context.
      const enableLink = tournament.registrationOptions['solo'];
      registrationOptions = (
        <Button key={name}
                className={`my-3 ${classes.Action} ${enableLink ? '' : 'text-decoration-line-through'}`}
                variant={'primary'}
                size={'lg'}
                disabled={!enableLink}
                href={enableLink ? `${router.asPath}/solo-bowler` : undefined}>
          Register
        </Button>
      );
    } else if (['single_event', 'igbo_non_standard'].includes(tournament.config.tournament_type)) {
      // Includes doubles/trios/team fundraisers, mixers, and unique tournaments like DAMIT
      // strike through options that would otherwise be enabled
      const applicableOptions = optionTypes.filter(optionType => (
        tournament.events.some(event => (
          optionType.rosterTypes.includes(event.rosterType)
        ))
      ));

      registrationOptions = applicableOptions.map(({name, path, linkText}) => {
        const enableLink = tournament.registrationOptions[name];
        return (
          <Button key={name}
                  className={`my-3 ${classes.Action} ${enableLink ? '' : 'text-decoration-line-through'}`}
                  variant={'primary'}
                  size={'lg'}
                  disabled={!enableLink}
                  href={enableLink ? `${router.asPath}/${path}` : undefined}>
            {linkText}
          </Button>
        );
      });
    } else {
      registrationOptions = optionTypes.map(({name, path, linkText}) => {
        // No new_pair for a standard tournament ... yet
        if (name === 'new_pair') {
          return '';
        }
        const enableLink = tournament.registrationOptions[name];
        return (
          <Button key={name}
                  className={`my-3 ${classes.Action} ${enableLink ? '' : 'text-decoration-line-through'}`}
                  variant={'primary'}
                  size={'lg'}
                  disabled={!enableLink}
                  href={enableLink ? `${router.asPath}/${path}` : undefined}>
            {linkText}
          </Button>
        );
      });
    }
  }

  return (
    <div className={`d-flex flex-column flex-lg-row justify-content-between justify-content-lg-around ${classes.Actions}`}>
      {registrationOptions}
    </div>
  );
}

export default RegisterButtons;
