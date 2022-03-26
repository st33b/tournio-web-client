import classes from './DivisionForm.module.scss';

import {useDirectorContext} from "../../../store/DirectorContext";
import {useRouter} from "next/router";
import {useState} from "react";
import {directorApiRequest} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";

const DivisionForm = ({onCancel, onComplete}) => {
  const context = useDirectorContext();
  const router = useRouter();

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
    const tournament = {...context.tournament}
    tournament.purchasable_items = tournament.purchasable_items.concat(data);
    context.setTournament(tournament);
    onComplete(`Division Items created.`);
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
    const uri = `/director/tournaments/${context.tournament.identifier}/purchasable_items`;
    const requestConfig = {
      method: 'post',
      data: {
        purchasable_items: purchasableItemsFromFormData(formData),
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: submissionSuccess,
      onFailure: (_) => {
        console.log("Failed to save new items.")
      },
    });
  }

  return (
    <ErrorBoundary>
      <div className={classes.DivisionForm}>
        <form onSubmit={formSubmitted} className={'mx-4 py-2'}>
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
              <div key={index} className={'mb-3 mt-3 pt-2 border-top border-secondary'}>
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

          <div className={'row'}>
            <div className={'d-flex justify-content-between p-0'}>
              <button type={'button'}
                      title={'Cancel'}
                      onClick={onCancel}
                      className={'btn btn-outline-danger'}>
                <i className={'bi-x-lg pe-2'} aria-hidden={true}/>
                Cancel
              </button>
              <button type={'submit'}
                      title={'Save'}
                      disabled={!formData.valid}
                      className={'btn btn-success'}>
                Save
                <i className={'bi-chevron-right ps-2'} aria-hidden={true}/>
              </button>
            </div>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  )
}

export default DivisionForm;