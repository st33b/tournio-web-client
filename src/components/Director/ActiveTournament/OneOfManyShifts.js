import {useState} from "react";
import Toggle from "./Toggle";
import classes from './ActiveTournament.module.scss';

const OneOfManyShifts = ({shift, unit}) => {
  //   form data
  const [formData, setFormData] = useState({
    formVisible: false,
    shift: {
      name: '',
      description: '',
      capacity: 0,
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
        <span className={'d-block float-end ps-2'}>
          <a href={'#'}
             onClick={(e) => visibilityToggled(e, true)}
             className={""}
             title={'Edit'}>
            <i className="bi bi-pencil-fill" aria-hidden={true}></i>
            <span className={'visually-hidden'}>
              Edit
            </span>
          </a>
        </span>
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
            Capacity:
            <span className={'h5 px-2'}>
                  {shift.capacity}
                </span>
            {unit}
          </p>
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
        </form>
      )}

      <div className={classes.ShiftDetail}>
        <Toggle label={'Full'}
                name={`${shift.identifier}--toggle_full`}
                htmlId={`${shift.identifier}--toggle_full`}
                checked={shift.isFull}
                onChange={() => {}}/>
      </div>
    </div>
  );
}

export default OneOfManyShifts;
