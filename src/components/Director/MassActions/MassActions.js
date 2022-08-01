import {useState} from "react";

import classes from './MassActions.module.scss';
import {directorApiRequest} from "../../../utils";
import Card from "react-bootstrap/Card";
import {useDirectorContext} from "../../../store/DirectorContext";
import {useRouter} from "next/router";

const MassActions = ({tournament}) => {
  const context = useDirectorContext();
  const router = useRouter();

  const [paymentReminderMessage, setPaymentReminderMessage] = useState(null);

  if (!tournament) {
    return '';
  }
  if (!['active', 'closed'].includes(tournament.state)) {
    return '';
  }

  const paymentRemindersKickedOff = (data) => {
    setPaymentReminderMessage(
      <div className={'alert alert-success alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-check2-circle pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          Sending payment reminders to bowlers with outstanding balances.
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setPaymentReminderMessage(null)}
                  aria-label="Close" />
        </div>
      </div>
    );
  }

  const paymentRemindersFailed = (data) => {
    setPaymentReminderMessage(
      <div className={'alert alert-warning alert-dismissible fade show d-flex align-items-center mt-3 mb-0'} role={'alert'}>
        <i className={'bi-exclamation-triangle pe-2'} aria-hidden={true} />
        <div className={'me-auto'}>
          Failed to send payment reminders to bowlers with outstanding balances. Please let Scott know.
          <button type="button"
                  className={"btn-close"}
                  data-bs-dismiss="alert"
                  onClick={() => setPaymentReminderMessage(null)}
                  aria-label="Close" />
        </div>
      </div>
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

    const uri = `/director/tournaments/${tournament.identifier}/email_payment_reminders`;
    const requestConfig = {
      data: {},
      method: 'post',
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: paymentRemindersKickedOff,
      onFailure: paymentRemindersFailed,
    });
  }

  return (
    <Card className={'border-0 text-center'}>
      <Card.Body className={'bg-white text-dark'}>
        <Card.Link className={'btn btn-sm btn-outline-dark'}
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