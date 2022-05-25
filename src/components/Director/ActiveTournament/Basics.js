import {Accordion} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './ActiveTournament.module.scss';

const Basics = () => {
  const context = useDirectorContext();
  if (!context || !context.tournament) {
    return '';
  }

  return (
    <Accordion className={classes.Card}>
      <Accordion.Item eventKey={'0'}>
        <Accordion.Header as={'h5'} className={classes.AccordionHeader}>
          Basics
        </Accordion.Header>
        <Accordion.Body>
          <dl>
            <div className={'row'}>
              <dt className={'col-4'}>Name</dt>
              <dd className={'col'}>{context.tournament.name}</dd>
            </div>
            <div className={'row'}>
              <dt className={'col-4'}>Year</dt>
              <dd className={'col'}>{context.tournament.year}</dd>
            </div>
            <div className={'row'}>
              <dt className={'col-4'}>Start Date</dt>
              <dd className={'col mb-0'}>{context.tournament.start_date}</dd>
            </div>
          </dl>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  // return (
  //   <Card className={classes.Card}>
  //     <Card.Header as={'h5'} className={'fw-light'}>
  //       Basics
  //     </Card.Header>
  //     <Card.Body>
  //       <dl>
  //         <div className={'row'}>
  //           <dt className={'col-4'}>Name</dt>
  //           <dd className={'col'}>{context.tournament.name}</dd>
  //         </div>
  //         <div className={'row'}>
  //           <dt className={'col-4'}>Year</dt>
  //           <dd className={'col'}>{context.tournament.year}</dd>
  //         </div>
  //         <div className={'row'}>
  //           <dt className={'col-4'}>Start Date</dt>
  //           <dd className={'col mb-0'}>{context.tournament.start_date}</dd>
  //         </div>
  //       </dl>
  //     </Card.Body>
  //   </Card>
  // );
}

export default Basics;