import {useDirectorContext} from "../../../../../store/DirectorContext";

import classes from '../../TournamentBuilder.module.scss';
import {useState} from "react";

const Style = ({style, styleChosen}) => {
  const STYLES = {
    'one': 'One shift for all bowlers in all events',
    'multi_inclusive': '2+ shifts, inclusive of all events',
    'mix_and_match': 'Mix-and-match shifts for sets of events',
  }

  const initialFormState = {
    fields: {
      style: '',
    },
    valid: false,
  }

  const [formData, setFormData] = useState(initialFormState);

  const inputChanged = (event) => {
    const changedData = {...formData};
    changedData.fields.style = event.target.value;
    changedData.valid = Object.hasOwn(STYLES, event.target.value);
    setFormData(changedData);
    if (styleChosen) {
      styleChosen(event.target.value);
    }
  }

  const changeStyle = (e) => {
    e.preventDefault();
    // if (confirm('This will remove any shift information you have entered. Are you sure?')) {
    styleChosen('');
    // }
  }

  return (
    <div className={classes.ShiftStyle}>
      <div className={`row ${!!style ? classes.Chosen : classes.NotChosen} py-1 mx-0`}>
        <div className={`col-12 col-sm-3 col-md-2`}>
          <label className={'col-form-label'}>
            Style
          </label>
        </div>
        <div className={`col`}>
          {!style && Object.keys(STYLES).map(key => (
            <div key={key} className={`form-check my-1`}>
              <input type={`radio`}
                     name={`style`}
                     id={`style_${key}`}
                     className={`form-check-input`}
                     onChange={inputChanged}
                     value={key}
                     disabled={key === 'mix_and_match'}
              />
              <label className={`form-check-label`}
                     htmlFor={`style_${key}`}>
                {STYLES[key]}
              </label>
            </div>
          ))}
          {style && (
            <div className={`form-check`}>
              <input type={'text'}
                     className={'form-control-plaintext'}
                     onChange={() => {
                     }}
                     value={STYLES[style]}/>
              <a href={'#'}
                 onClick={changeStyle}>
                Change
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Style;
