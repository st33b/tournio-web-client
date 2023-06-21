import {useState} from "react";
import Card from "react-bootstrap/Card";

import {useLoginContext} from "../../../store/LoginContext";
import {directorApiRequest, useTournament} from "../../../director";

import classes from './MassActions.module.scss';
import SuccessAlert from "../../common/SuccessAlert";
import ErrorAlert from "../../common/ErrorAlert";

const MassActions = () => {
  const { authToken } = useLoginContext();
  const {loading, tournament} = useTournament();

  const [paymentReminderMessage, setPaymentReminderMessage] = useState(null);

  if (loading) {
    return '';
  }
  if (!['active', 'closed'].includes(tournament.state)) {
    return '';
  }

  const paymentRemindersKickedOff = (data) => {
    setPaymentReminderMessage(
      <SuccessAlert message={'Sending payment reminders to bowlers with outstanding balances.'}
                    className={`mt-3 mb-0`}
                    onClose={() => setPaymentReminderMessage(null)}
                    />
    );
  }

  const paymentRemindersFailed = (data) => {
    setPaymentReminderMessage(
      <ErrorAlert message={'Failed to send payment reminders to bowlers with outstanding balances. Please let Scott know.'}
                    className={`mt-3 mb-0`}
                    onClose={() => setPaymentReminderMessage(null)}
      />
    );
  }

  const paymentReminderClickHandler = (event) => {
    event.preventDefault();
    if (!['active', 'closed'].includes(tournament.state)) {
      console.log('Cannot send payment reminders for a tournament in setup or test mode.');
      return;
    }

    if (!confirm('This will send potentially many emails. Are you sure?')) {
      return;
    }

    const uri = `/tournaments/${tournament.identifier}/email_payment_reminders`;
    const requestConfig = {
      data: {},
      method: 'post',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: paymentRemindersKickedOff,
      onFailure: paymentRemindersFailed,
    });
  }

  return (
    <Card className={`border-0 text-center ${classes.MassActions}`}>
      <Card.Body>
        <Card.Link className={'btn btn-sm btn-outline-primary'}
                   href={'#'}
                   onClick={paymentReminderClickHandler}>
          Send Payment Reminder Email
        </Card.Link>
        {paymentReminderMessage}
      </Card.Body>
    </Card>
  );
}

export default MassActions;
