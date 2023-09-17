import classes from "./NewTeamReview.module.scss";
import React, {useEffect, useState} from "react";
import {useRegistrationContext} from "../../../store/RegistrationContext";
import BowlerSummary from "../ReviewEntries/BowlerSummary";

const NewTeamReview = ({team, bowler}) => {
  const {registration} = useRegistrationContext();

  const shiftIdentifier = team.preferredShift;
  const chosenShift = registration.tournament.shifts.length === 1
    ? ''
    : registration.tournament.shifts.find(({identifier}) => identifier === shiftIdentifier);

  if (!team || !bowler) {
    return '';
  }

  return (
    <div className={classes.NewTeamReview}>
      <h2 className={`text-center`}>
        Review
      </h2>

      <hr/>

      <dl className={classes.TeamDetails}>
        <div className={`row g-2`}>
          <dt className={`col-5`}>
            Team Name:
          </dt>
          <dd className={`col`}>
            {team.name}
          </dd>
        </div>
        <div className={`row g-2`}>
          <dt className={`col-5`}>
            # of Bowlers:
          </dt>
          <dd className={`col`}>
            {team.bowlerCount}
          </dd>
        </div>

        {chosenShift && (
          <div className={`row g-2`}>
            <dt className={`col-5`}>
              Preferred Shift:
            </dt>
            <dd className={`col`}>
              {chosenShift.name}
            </dd>
          </div>
        )}
      </dl>

      <hr/>

      <BowlerSummary bowler={bowler}/>
    </div>
  );
}

export default NewTeamReview;
