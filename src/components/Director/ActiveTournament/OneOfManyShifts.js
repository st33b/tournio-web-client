import {useState} from "react";
import Toggle from "./Toggle";
import ShiftCapacity from "../../common/ShiftCapacity/ShiftCapacity";

import classes from './ActiveTournament.module.scss';
import EditButton from "./EditButton";

const OneOfManyShifts = ({shift, unit}) => {
  //   form data
  const [formData, setFormData] = useState({
    formVisible: false,
    shift: {
      name: '',
      description: '',
      capacity: 0,
      is_full: false,
      // properties for mix-and-match shifts to come later...
    },
  });

  const visibilityToggled = (event, newVisibility) => {
    event.preventDefault();
    setFormData({
      formVisible: newVisibility,
      shift: {...formData.shift},
    });
  }

  return (
    <div className={classes.OneOfMultipleShifts}>
      {!formData.formVisible && (
        <EditButton onClick={() => {
          setFormData({
            formVisible: true,
            shift: {...formData.shift}
          });
        }}/>
      )}
      {!formData.formVisible && (
        <div>
          <p className={classes.ShiftDetail}>
            Name:
            <strong className={'ps-2'}>
              {shift.name}
            </strong>
          </p>

          <p className={classes.ShiftDetail}>
            Description:
            <strong className={'ps-2'}>
              {shift.description}
            </strong>
          </p>

          {/* mix-and-match shifts: list the shift's events */}

          <p className={classes.ShiftDetail}>
            Max {unit}:
            <strong className={'ps-2'}>
              {shift.capacity}
            </strong>
          </p>

          <ShiftCapacity shift={shift} includeName={false}/>

          <div className={`mt-3`}>
            <Toggle label={'Open for new registrations'}
                    name={`${shift.identifier}--toggle_full`}
                    htmlId={`${shift.identifier}--toggle_full`}
                    checked={!shift.isFull}
                    onChange={() => {
                    }}/>
          </div>
        </div>
      )}
      {formData.formVisible && (
        <form noValidate={true}>
          <h5>Form TBD</h5>
          {/* name */}
          <p>Name</p>
          {/* desc */}
          <p>Desc</p>
          {/* capacity */}
          <p>Capacity</p>
          {/* open/full */}
          <p>Open/Full toggle</p>
        </form>
      )}
    </div>
  );
}

export default OneOfManyShifts;
