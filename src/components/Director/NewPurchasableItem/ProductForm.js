import classes from './ProductForm.module.scss';
import {useState} from "react";
import ErrorBoundary from "../../common/ErrorBoundary";
import Item from "../../Commerce/AvailableItems/Item/Item";

const ProductForm = ({tournamentIdentifier, onCancel, onComplete}) => {
  const initialState = {
    name: '',
    note: '',
    value: '',
    order: '',
    productHasImage: false,
    image: '',

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);

  const isValid = ({name, value, order}) => {
    return name.length > 0 && value > 0 && order > 0;
  }

  const inputChanged = (event) => {
    let newValue = event.target.value;
    const inputName = event.target.name;
    if (['value', 'order'].includes(inputName)) {
      newValue = parseInt(newValue);
      if (isNaN(newValue)) {
        newValue = 0;
      }
    }
    if (inputName === 'productHasImage') {
      newValue = event.target.checked;
    }
    const newFormData = {...formData};
    newFormData[inputName] = newValue;
    newFormData.valid = isValid(newFormData);
    setFormData(newFormData);
  }

  const formSubmitted = (event) => {
    event.preventDefault();
  }

  let itemPreview = '';
  const itemPreviewProps = {
    category: 'product',
    determination: 'general',
    name: formData.name,
    value: formData.value,
    // refinement: formData.refinement,
    configuration: {
      note: formData.note,
      // denomination: formData.denomination,
      order: formData.order,
    }
  }

  return (
    <ErrorBoundary>
      <div className={classes.ProductForm}>
        <form onSubmit={formSubmitted} className={`py-2`}>
          <div className={`${classes.HeaderRow} row mb-2`}>
            <h6>
              New Product
            </h6>
          </div>

          {/* This is duplicated and a good candidate for re-use */}
          <div className={`row ${classes.LineItem}`}>
            <label htmlFor={'name'} className={'form-label ps-0 mb-1'}>
              Display Name
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'name'}
                   id={'name'}
                   required={true}
                   onChange={inputChanged}
                   value={formData.name}
            />
          </div>

          {/* This is duplicated and a good candidate for re-use */}
          <div className={`row ${classes.LineItem}`}>
            <div className={'col-6 ps-0'}>
              <label htmlFor={'value'} className={'form-label ps-0 mb-1'}>
                Price
              </label>
              <input type={'number'}
                     className={`form-control`}
                     name={'value'}
                     id={'value'}
                     required={true}
                     onChange={inputChanged}
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
                     onChange={inputChanged}
                     value={formData.order}
              />
            </div>
          </div>

          {/* This is duplicated and a good candidate for re-use */}
          <div className={`row ${classes.LineItem}`}>
            <label htmlFor={'note'} className={'form-label ps-0 mb-1'}>
              Note (optional)
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'note'}
                   id={'note'}
                   onChange={inputChanged}
                   value={formData.note}
            />
          </div>

          <div className={`row ${classes.LineItem}`}>
            <div className={'form-check form-switch'}>
              <input type={'checkbox'}
                     className={'form-check-input'}
                     role={'switch'}
                     id={'productHasImage'}
                     name={'productHasImage'}
                     checked={formData.productHasImage}
                     onChange={inputChanged}/>
              <label htmlFor={'productHasImage'}
                     className={'form-check-label'}>
                Include an image
              </label>
            </div>
          </div>

          {/* Apply any special styling here? */}
          <div className={`row ${classes.PreviewItem}`}>
            <p className={`${classes.PreviewText}`}>
              How it will look to bowlers:
            </p>
            <Item item={itemPreviewProps} preview={true}/>
          </div>

          {/* Canccel & Save buttons */}
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
  )
}

export default ProductForm;
