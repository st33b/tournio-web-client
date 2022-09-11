import {useState} from "react";
import {useRouter} from "next/router";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../utils";
import ErrorBoundary from "../../common/ErrorBoundary";
import Item from "../../Commerce/AvailableItems/Item/Item";

import classes from './MultiUseForm.module.scss';
import {purchasableItemsAdded} from "../../../store/actions/directorActions";

const MultiUseForm = ({tournament, onCancel, onComplete}) => {
  const context = useDirectorContext();
  const dispatch = context.dispatch;
  const router = useRouter();

  const initialState = {
    category: '', // banquet, product
    determination: 'multi_use',
    refinement: '', // denomination (for quantity-based products, like raffle ticket bundles
    name: '',
    value: '',
    note: '',
    denomination: '', // for quantity-based products, like raffle ticket bundles
    order: '',

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [denominationVisibility, setDenominationVisibility] = useState('visually-hidden');

  const inputChanged = (event) => {
    let newValue = event.target.value;
    const inputName = event.target.name;
    if (inputName === 'value' || inputName === 'order') {
      newValue = parseInt(newValue);
    }
    const newFormData = {...formData};
    newFormData[inputName] = newValue;

    newFormData.valid = isValid(newFormData);

    setFormData(newFormData);
  }

  const isValid = (data) => {
    return data.name.length > 0
      && data.value > 0
      && data.order > 0
      && data.category !== ''
      && (data.refinement !== 'denomination' || data.refinement === 'denomination' && data.denomination.length > 0);
  }

  const submissionSuccess = (data) => {
    dispatch(purchasableItemsAdded(data));
    setFormData({...initialState});
    onComplete(`Item ${data[0].name} created.`);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const uri = `/director/tournaments/${tournament.identifier}/purchasable_items`;
    const requestConfig = {
      method: 'post',
      data: {
        purchasable_items: [
          {
            category: formData.category,
            determination: formData.determination,
            refinement: formData.refinement,
            name: formData.name,
            value: formData.value,
            configuration: {
              order: formData.order,
              note: formData.note,
              denomination: formData.refinement === 'denomination' ? formData.denomination : '',
            },
          },
        ],
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      router: router,
      onSuccess: submissionSuccess,
      onFailure: (_) => {
        console.log("Failed to save new item.")
      },
    });
  }

  const toggleDenominationVisibility = (event) => {
    setDenominationVisibility(event.target.checked ? '' : 'visually-hidden');
    const newFormData = {...formData};
    newFormData.refinement = event.target.checked ? 'denomination' : '';
    newFormData.valid = isValid(newFormData);
    setFormData(newFormData);
  }

  let itemPreview = '';
  const itemPreviewProps = {
    category: formData.category,
    determination: 'multi_use',
    name: formData.name,
    value: formData.value,
    refinement: formData.refinement,
    configuration: {
      note: formData.note,
      denomination: formData.denomination,
      order: formData.order,
    }
  }

  itemPreview = (
    <div className={'row mx-0 px-0'}>
      <span className={`${classes.PreviewText} px-0 pb-1`}>
        How it will look to bowlers:
      </span>
      <Item item={itemPreviewProps} preview={true}/>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className={classes.MultiUseForm}>
        <form onSubmit={formSubmitted} className={`mx-4 py-2`}>
          <div className={`${classes.HeaderRow} row mb-2`}>
            <h6>
              New Multi-Use Item
            </h6>
          </div>
          <div className={'row mb-3'}>
            <label htmlFor={'name'} className={'form-label ps-0 mb-1'}>
              Item type
            </label>
            <select className={`form-select`}
                    name={'category'}
                    id={'category'}
                    required={true}
                    onChange={(event) => inputChanged(event)}
                    value={formData.category}>
              <option value={''}>--</option>
              <option value={'bowling'}>Bowling</option>
              <option value={'banquet'}>Banquet (non-bowler)</option>
              <option value={'product'}>Product</option>
            </select>
          </div>
          <div className={'row mb-3'}>
            <label htmlFor={'name'} className={'form-label ps-0 mb-1'}>
              Display Name
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'name'}
                   id={'name'}
                   required={true}
                   onChange={(event) => inputChanged(event)}
                   value={formData.name}
            />
          </div>
          <div className={'row mb-3'}>
            <div className={'form-check form-switch'}>
              <input type={'checkbox'}
                     className={'form-check-input'}
                     value={true}
                     role={'switch'}
                     name={'has_denomination'}
                     onChange={toggleDenominationVisibility}
                     id={'has_denomination'}/>
              <label className={'form-check-label'}
                     htmlFor={'has_denomination'}>
                Item has a denomination/quantity
              </label>
            </div>
          </div>
          <div className={`row mb-3 ${denominationVisibility}`}>
            <label htmlFor={'denomination'} className={'form-label ps-0 mb-1'}>
              Denomination/quantity
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'denomination'}
                   id={'denomination'}
                   onChange={(event) => inputChanged(event)}
                   value={formData.denomination}
            />
          </div>
          <div className={'row mb-3'}>
            <div className={'col-6 ps-0'}>
              <label htmlFor={'value'} className={'form-label ps-0 mb-1'}>
                Price
              </label>
              <input type={'number'}
                     className={`form-control`}
                     name={'value'}
                     id={'value'}
                     required={true}
                     onChange={(event) => inputChanged(event)}
                     value={formData.value}
              />
            </div>
            <div className={'col-6 pe-0'}>
              <label htmlFor={'order'} className={'form-label ps-0 mb-1'}>
                Display order
              </label>
              <input type={'number'}
                     className={`form-control`}
                     name={'order'}
                     id={'order'}
                     required={true}
                     onChange={(event) => inputChanged(event)}
                     value={formData.order}
              />
            </div>
          </div>
          <div className={'row mb-3'}>
            <label htmlFor={'note'} className={'form-label ps-0 mb-1'}>
              Note (optional)
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'note'}
                   id={'note'}
                   onChange={(event) => inputChanged(event)}
                   value={formData.note}
            />
          </div>
          <div className={'row'}>
            {itemPreview}
          </div>
          <div className={'row'}>
            <div className={'d-flex justify-content-end pe-0'}>
              <button type={'button'}
                      title={'Cancel'}
                      onClick={onCancel}
                      className={'btn btn-outline-danger me-2'}>
                <i className={'bi-x-lg'} aria-hidden={true}/>
                <span className={'visually-hidden'}>
                  Cancel
                </span>
              </button>
              <button type={'submit'}
                      title={'Save'}
                      disabled={!formData.valid}
                      className={'btn btn-outline-success'}>
                <i className={'bi-check-lg'} aria-hidden={true}/>
                <span className={'visually-hidden'}>
                  Save
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
}

export default MultiUseForm;