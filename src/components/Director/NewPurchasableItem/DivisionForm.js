import {useState} from "react";

import ErrorBoundary from "../../common/ErrorBoundary";
import ButtonRow from "../../common/ButtonRow";
import {directorApiRequest, useTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";

import classes from './DivisionForm.module.scss';

const DivisionForm = ({onCancel, onComplete}) => {
  const {authToken} = useLoginContext();
  const {tournament} = useTournament();

  const initialState = {
    name: '',
    divisions: [
      {
        division: '',
        note: '',
        value: '',
      }
    ],
    valid: false,
  };

  const [formData, setFormData] = useState(initialState);

  const addDivision = (event) => {
    event.preventDefault();
    const newFormData = {...formData}
    newFormData.divisions = formData.divisions.concat({value: '', division: '', note: '',});
    newFormData.valid = false;
    setFormData(newFormData);
  }

  const removeDivision = (event) => {
    event.preventDefault();
    const newFormData = {...formData};
    newFormData.divisions = newFormData.divisions.slice(0, -1);
    newFormData.valid = isValid(newFormData);
    setFormData(newFormData);
  }

  const inputChanged = (event) => {
    let newValue = event.target.value;
    const inputName = event.target.name;
    const newFormData = {...formData};

    if (inputName === 'name') {
      newFormData[inputName] = newValue;
    } else {
      const parts = inputName.split('_');
      const index = parseInt(parts[1]);
      const element = parts[2];

      if (element === 'value') {
        newValue = parseInt(newValue);
      }

      const newDivisions = formData.divisions;
      newDivisions[index][element] = newValue;
    }

    newFormData.valid = isValid(newFormData);
    setFormData(newFormData);
  }

  const isValid = (data) => {
    return data.divisions.reduce(
      (previous, current) => previous &&
        current.division.length > 0 && current.value > 0,
      data.name.length > 0
    );
  }

  const submissionSuccess = (data) => {
    setFormData({...initialState});
    onComplete(data);
  }

  const purchasableItemsFromFormData = (data) => {
    return data.divisions.map(div => (
      {
        name: data.name,
        category: 'bowling',
        determination: 'single_use',
        refinement: 'division',
        value: div.value,
        configuration: {
          division: div.division,
          note: div.note,
        }
      }
    ))
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = `/tournaments/${tournament.identifier}/purchasable_items`;
    const requestConfig = {
      method: 'post',
      data: {
        purchasable_items: purchasableItemsFromFormData(formData),
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      authToken: authToken,
      onSuccess: submissionSuccess,
      onFailure: (_) => console.log("Failed to save new items."),
    });
  }

  return (
    <ErrorBoundary>
      <div className={classes.DivisionForm}>
        <form onSubmit={formSubmitted} className={'py-2'}>
          <div className={`${classes.HeaderRow} row mb-2`}>
            <h6>
              New Division Item
            </h6>
          </div>
          <div className={'row mb-2'}>
            <label htmlFor={'name'} className={'form-label ps-0 mb-1'}>
              Display Name
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'name'}
                   id={'name'}
                   placeholder={'e.g., Scratch Masters'}
                   required={true}
                   onChange={(event) => inputChanged(event)}
                   value={formData.name}
            />
          </div>

          {/* In each division section: division, value/price, note (optional) */}
          {formData.divisions.map((div, index) => (
              <div key={index} className={'mb-3 mt-3 pt-2 border-top'}>
                <div className={'row mb-1'}>
                  <div className={'d-flex px-0'}>
                    <label htmlFor={'denomination'} className={'form-label ps-0 mb-1'}>
                      Division Name
                    </label>
                    {index > 0 && index === formData.divisions.length - 1 &&
                      <a href={'#'}
                         className={`${classes.RemoveLink} ms-auto link-danger`}
                         onClick={(event) => {removeDivision(event)}}>
                        [remove division]
                      </a>
                    }
                  </div>
                  <input type={'text'}
                         className={`form-control`}
                         name={`div_${index}_division`}
                         required={true}
                         id={`div_${index}_division`}
                         onChange={(event) => inputChanged(event)}
                         value={formData.divisions[index].division}
                  />
                </div>
                <div className={'row mb-3'}>
                  <div className={'col-6 ps-0'}>
                    <label htmlFor={'denomination'} className={'form-label ps-0 mb-1'}>
                      Note (optional)
                    </label>
                    <input type={'text'}
                           className={`form-control`}
                           name={`div_${index}_note`}
                           id={`div_${index}_note`}
                           placeholder={'e.g., avg range'}
                           onChange={(event) => inputChanged(event)}
                           value={formData.divisions[index].note}
                    />
                  </div>
                  <div className={'col-6 pe-0'}>
                    <label htmlFor={'value'} className={'form-label ps-0 mb-1'}>
                      Price
                    </label>
                    <input type={'number'}
                           className={`form-control`}
                           name={`div_${index}_value`}
                           id={`div_${index}_value`}
                           required={true}
                           min={1}
                           onChange={(event) => inputChanged(event)}
                           value={formData.divisions[index].value}
                    />
                  </div>
                </div>
              </div>
            )
          )}

          <div className={'row mb-3 text-center'}>
            <a href={'#'}
               className={classes.AddLink}
               onClick={event => addDivision(event)}
               title={"Add another division"}>
              add a division
            </a>
          </div>

          <ButtonRow onCancel={onCancel} disableSave={!formData.valid} />
        </form>
      </div>
    </ErrorBoundary>
  )
}

export default DivisionForm;
