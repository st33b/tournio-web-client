import classes from './TournamentDetails.module.scss';
import {ListGroup} from "react-bootstrap";
import {useRouter} from "next/router";
import Button from "react-bootstrap/Button";
import {devConsoleLog} from "../../../utils";

const RegisterButtons = ({tournament}) => {
  const router = useRouter();

  if (!tournament) {
    return '';
  }

  let registrationOptions = '';
  if (tournament.state === 'testing' || tournament.state === 'active' || tournament.state === 'demo') {
    const optionTypes = [
      {
        name: 'solo',
        path: 'solo-bowler',
        linkText: 'Register as a Solo Bowler',
      },
      {
        name: 'join_team',
        path: 'join-a-team',
        linkText: 'Join an Existing Team',
      },
      {
        name: 'new_team',
        path: 'new-team',
        linkText: 'Register a New Team',
      },
      {
        name: 'partner',
        path: 'partner-up',
        linkText: 'Partner Up With Someone',
      },
      {
        name: 'new_pair',
        path: 'new-pair',
        linkText: 'Register a Pair of Bowlers',
      },
    ]
    const eventSelectionEnabled = !!tournament.purchasable_items && tournament.purchasable_items.some(item => item.determination === 'event');
    // const eventSelectionEnabled = false;
    if (eventSelectionEnabled) {
      // only show what's enabled
      registrationOptions = optionTypes.map(({name, path, linkText}) => {
        if (!tournament.registration_options[name]) {
          return '';
        }
        return (
          <ListGroup.Item key={name}
                          className={'text-primary'}
                          href={`${router.asPath}/${path}`}
                          action>
            {linkText}
          </ListGroup.Item>
        );
      });
    } else {
      // show the standard ways
      registrationOptions = optionTypes.map(({name, path, linkText}) => {
        // partnering and a new pair aren't part of a standard tournament
        if (name === 'partner' || name === 'new_pair') {
          return '';
        }
        const enableLink = tournament.registration_options[name];
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
