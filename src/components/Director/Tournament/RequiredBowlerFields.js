import {useEffect, useState} from 'react';
import {Accordion} from "react-bootstrap";

import {directorApiRequest, useTournament} from "../../../director";
import {useLoginContext} from "../../../store/LoginContext";
import ErrorAlert from "../../common/ErrorAlert";
import {updateObject} from "../../../utils";

const RequiredBowlerFields = () => {
  const { authToken } = useLoginContext();
  const {tournament, tournamentUpdatedQuietly} = useTournament();

  const initialFormData = {
    birth_month: {
      label: 'Birth Month',
      required: false,
    },
    birth_day: {
      label: 'Birth Day',
      required: false,
    },
    address1: {
      label: 'Address 1',
      required: false,
    },
    address2: {
      label: 'Address 2',
      required: false,
    },
    city: {
      label: 'City',
      required: false,
    },
    state: {
      label: 'State',
      required: false,
    },
    country: {
      label: 'Country',
      required: false,
    },
    postal_code: {
      label: 'Postal Code',
      required: false,
    },
    usbc_id: {
      label: 'USBC ID',
      required: false,
    },
  }


  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState(null);

  // Populate form data with what the tournament already has, and disable
  // the ones that don't apply for the tournament type
  useEffect(() => {
    if (!tournament) {
      return;
    }
    const configItem = tournament.config_items.find(({key}) => key === 'required_bowler_fields');
    const requiredFields = configItem.value;

    const newFormData = {...formData};
    for (const itemKey in formData) {
      newFormData[itemKey].required = requiredFields.includes(itemKey);
    }
    setFormData(newFormData);
  }, [tournament]);

  if (!tournament) {
    return '';
  }

  const optionToggled = (event) => {
    // const inputName = event.target.name;
    // const newValue = event.target.checked;
    // const newFormData = formData.set(inputName, newValue);
    // setFormData(newFormData);
    // submitRequiredFields(newFormData);
  }

  const submitRequiredFields = (options) => {
    // const uri = `/tournaments/${tournament.identifier}`;
    // const enabledTypes = [];
    // REGISTRATION_TYPES.forEach(rType => {
    //   if (options.get(rType)) {
    //     enabledTypes.push(rType);
    //   }
    // });
    // const requestConfig = {
    //   method: 'patch',
    //   data: {
    //     tournament: {
    //       details: {
    //         enabled_registration_options: enabledTypes,
    //       },
    //     },
    //   },
    // };
    // directorApiRequest({
    //   uri: uri,
    //   requestConfig: requestConfig,
    //   authToken: authToken,
    //   onSuccess: (data) => submissionCompleted(data),
    //   onFailure: (data) => setErrorMessage(data.error),
    // })
  }

  const submissionCompleted = (data) => {

    const updatedTournament = updateObject(tournament, {
      config_items: {...data.config_items},
    });
    tournamentUpdatedQuietly(updatedTournament);
  }

  return (
    <Accordion className={'mb-3'} defaultActiveKey={"0"}>
      <Accordion.Item eventKey={"0"}>
        <Accordion.Header as={"h5"}>
            Required Bowler Fields
        </Accordion.Header>
        <Accordion.Body>
          {Object.keys(formData).map(key => (
            <div className={'form-check form-switch'} key={key}>
              <input type={'checkbox'}
                     className={'form-check-input'}
                     role={'switch'}
                     id={`require_${key}`}
                     name={`require_${key}`}
                     checked={formData[key].required}
                     onChange={optionToggled}/>
              <label htmlFor={`require_${key}`}
                     className={'form-check-label'}>
                {formData[key].label}
              </label>
            </div>
          ))}
          <ErrorAlert message={errorMessage}
                      className={`mx-3`}
                      onClose={() => setErrorMessage(null)}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  // return (
  //   <div className={'accordion mb-2'}
  //        id={'requiredBowlerFieldsAccordion'}>
  //     <div className={'accordion-item'}>
  //       <h5 className={'accordion-header fw-light'}>
  //         {/*Required Bowler Fields*/}
  //         <button className="accordion-button collapsed"
  //                 type="button"
  //                 data-bs-toggle="collapse"
  //                 data-bs-target="#requiredBowlerFieldsCollapse"
  //                 aria-expanded="false"
  //                 aria-controls="requiredBowlerFieldsCollapse">
  //           Required Bowler Fields
  //         </button>
  //       </h5>
  //       <div id="requiredBowlerFieldsCollapse"
  //            className="accordion-collapse collapse"
  //            data-bs-parent="#requiredBowlerFieldsAccordion">
  //         <div className="accordion-body">
  //           {Object.keys(formData).map(key => (
  //             <div className={'form-check form-switch'} key={key}>
  //               <input type={'checkbox'}
  //                      className={'form-check-input'}
  //                      role={'switch'}
  //                      id={`require_${key}`}
  //                      name={`require_${key}`}
  //                      checked={formData[key].required}
  //                      onChange={optionToggled}/>
  //               <label htmlFor={`require_${key}`}
  //                      className={'form-check-label'}>
  //                 {formData[key].label}
  //               </label>
  //             </div>
  //           ))}
  //           <ErrorAlert message={errorMessage}
  //                       className={`mx-3`}
  //                       onClose={() => setErrorMessage(null)}
  //           />
  //         </div>
  //       </div>
  //
  //       {/*<div className={'card-body'}>*/}
  //       {/*  {Object.keys(formData).map(key => (*/}
  //       {/*    <div className={'form-check form-switch'} key={key}>*/}
  //       {/*      <input type={'checkbox'}*/}
  //       {/*             className={'form-check-input'}*/}
  //       {/*             role={'switch'}*/}
  //       {/*             id={`require_${key}`}*/}
  //       {/*             name={`require_${key}`}*/}
  //       {/*             checked={formData[key].required}*/}
  //       {/*             onChange={optionToggled}/>*/}
  //       {/*      <label htmlFor={`require_${key}`}*/}
  //       {/*             className={'form-check-label'}>*/}
  //       {/*        {formData[key].label}*/}
  //       {/*      </label>*/}
  //       {/*    </div>*/}
  //       {/*  ))}*/}
  //       {/*</div>*/}
  //       {/*<ErrorAlert message={errorMessage}*/}
  //       {/*            className={`mx-3`}*/}
  //       {/*            onClose={() => setErrorMessage(null)}*/}
  //       {/*/>*/}
  //     </div>
  //   </div>
  // );

}

export default RequiredBowlerFields;
