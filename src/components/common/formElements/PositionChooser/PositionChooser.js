import classes from "./PositionChooser.module.scss";
import React, {useEffect, useState} from "react";
import {updateObject} from "../../../../utils";

const PositionChooser = ({maxPosition=4, chosen, onChoose, disallowedPositions=[]}) => {
  const initialState = {
    chosen: 1,
  }

  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    if (chosen) {
      const updatedFormState = updateObject(formState, {
        chosen: parseInt(chosen),
      });
      setFormState(updatedFormState);
    }
  }, [chosen]);

  const inputChanged = (element, newValue) => {
    const updatedFormState = updateObject(formState, {
      chosen: newValue,
    });
    setFormState(updatedFormState);
    onChoose(newValue);
  }

  const radios = [];
  for (let i = 0; i < maxPosition; i++) {
    const currentPosition = i + 1;
    const selected = formState.chosen === currentPosition;
    const disallowed = disallowedPositions.includes(currentPosition)
    radios.push(
      <div key={`positionInput${currentPosition}`}
           title={disallowed ? 'This position is not available' : ''}
           className={`me-sm-3 `}>
        <input type={'radio'}
               className={'btn-check'}
               name={'position'}
               id={`position_${currentPosition}`}
               value={currentPosition}
               checked={selected}
               disabled={disallowed}
               onChange={(e) => inputChanged(e, i+1)}
               autoComplete={'off'} />
        <label className={`btn btn-lg btn-tournio-radio`}
               htmlFor={`position_${currentPosition}`}>
          {currentPosition}
        </label>
      </div>
    );
  }

  return (
    <div className={`${classes.PositionChooser} row mb-1`}>
      <label className={`col-12 col-sm-5 text-sm-end pb-1 align-self-center`}>
        Position
      </label>
      <div className={`col d-flex justify-content-around justify-content-sm-start`}>
        {radios}
      </div>
    </div>
  );
}

export default PositionChooser;
