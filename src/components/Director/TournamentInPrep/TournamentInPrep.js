import React from 'react';

import DeleteTournament from "../Tournament/DeleteTournament";
import Basics from "./Basics";
import Configuration from "./Configuration";
import AdditionalQuestions from "./AdditionalQuestions";
import StatusAndCounts from "./StatusAndCounts";
import PurchasableItems from "./PurchasableItems";
import Contacts from "../Tournament/Contacts";
import StateChangeButton from "./StateChangeButton";
import Shifts from "./Shifts";
import StripeStatus from "./StripeStatus";
import ImageUpload from "./ImageUpload";
import Users from '../Tournament/Users';
import RegistrationOptions from "../Tournament/RegistrationOptions";
import ErrorBoundary from "../../common/ErrorBoundary";

import classes from './TournamentInPrep.module.scss';
import BowlerFormFields from "./BowlerFormFields";

const TournamentInPrep = ({stateChangeInitiated, requestStripeStatus}) => {
  return (
    <ErrorBoundary>
      <div className={classes.TournamentInPrep}>
        <div className={'row'}>
          <div className={'col-12 col-md-6 col-lg-4'}>
            <Basics/>
            <ImageUpload/>
            <Contacts/>
            <Users/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <StatusAndCounts/>
            <StateChangeButton stateChangeInitiated={stateChangeInitiated} />
            <BowlerFormFields/>
            <AdditionalQuestions/>
            <Shifts/>
          </div>

          <div className={'col-12 col-md-6 col-lg-4'}>
            <Configuration/>
            <RegistrationOptions/>
            <PurchasableItems/>
            <StripeStatus needStatus={requestStripeStatus} />
            <DeleteTournament/>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default TournamentInPrep;
