import {useEffect, useState} from "react";


import classes from './BowlerForm.module.scss';
import {useRegistrationContext} from "../../../store/RegistrationContext";
import {teamInfoAdded} from "../../../store/actions/registrationActions";

const bowlerForm = (props) => {
  const context = useRegistrationContext();
  const initialFormState = {
    valid: false,
  }
  const [bowlerForm, setBowlerForm] = useState(initialFormState);
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    setTournament(context.tournament);
  });
  if (!tournament) {
    return '';
  }

  const formHandler = (event) => {
    event.preventDefault();

    if (!bowlerForm.valid) {
      return;
    }

    // Ok, we're good to go. We need to:
    // - store the entered team name somewhere
    // context.dispatch(teamInfoAdded(teamForm.teamName));

    // - move on to the next step. This should probably come in from our parent; we
    // have no business deciding where to navigate next.
  }

  return (
    <p>Bowler Form!</p>
  );
}

export default bowlerForm;