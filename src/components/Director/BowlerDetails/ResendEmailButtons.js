import {Card, ListGroup} from "react-bootstrap";

import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './ResendEmailButtons.module.scss';
import EmailButton from "./EmailButton";

const ResendEmailButtons = ({bowler}) => {
  const paymentEntries = bowler.ledger_entries.filter(entry => entry.source === 'paypal');

  return (
    <ErrorBoundary>
      <div className={classes.ResendEmailButtons}>
        <Card className={'mb-3'}>
          <Card.Header as={'h6'} className={'fw-light'}>
            Re-send Emails
          </Card.Header>
          <ListGroup variant={'flush'}>
            <ListGroup.Item>
              <EmailButton emailType={'registration'}
                           bowlerIdentifier={bowler.identifier} />
            </ListGroup.Item>
            {paymentEntries.map((entry, i) => (
              <ListGroup.Item key={i}>
                <EmailButton emailType={'payment_receipt'}
                             bowlerIdentifier={bowler.identifier}
                             orderIdentifier={entry.identifier}
                             orderCredit={entry.credit} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

export default ResendEmailButtons;