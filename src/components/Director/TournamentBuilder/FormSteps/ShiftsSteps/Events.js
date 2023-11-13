import React, {useEffect, useState} from "react";

import classes from '../../TournamentBuilder.module.scss';

const Events = ({availableEvents}) => {

  return (
    <div>
    {/* List of events in tournament, with checkbox for each.  */}
      <ul>
        {availableEvents.map(event => (
          <div className="form-check" key={event.identifier}>
            <input className="form-check-input"
                   type="checkbox"
                   value={event.id}
                   name={`event_${event.roster_type}`}
                   id={`event_${event.id}`}>
              <label className="form-check-label"
                     htmlFor={`event_${event.id}`}>
                {event.name}
              </label>
            </input>
          </div>

          ))}
      </ul>
    </div>
  )
}

export default Events;
