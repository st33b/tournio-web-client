import {useState} from "react";

import ErrorBoundary from "../../common/ErrorBoundary";
import Item from "../../Commerce/AvailableItems/Item/Item";
// import AssetUpload from "../../common/AssetUpload/AssetUpload";
import classes from './ProductForm.module.scss';
import {directorApiRequest} from "../../../director";
import {useDirectorContext} from "../../../store/DirectorContext";
import {purchasableItemsAdded} from "../../../store/actions/directorActions";
import {devConsoleLog} from "../../../utils";

const ProductForm = ({tournament, onCancel, onComplete}) => {
  const context = useDirectorContext();
  const dispatch = context.dispatch;

  const initialState = {
    determination: 'general',
    refinement: null,
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
    const inputName = event.target.name;
    const newFormData = {...formData};

    let newValue;
    if (['value', 'order'].includes(inputName)) {
      newValue = parseInt(event.target.value);
      if (isNaN(newValue)) {
        newValue = 0;
      }
    } else if (inputName === 'determination') {
      devConsoleLog(event.target.id);
      const parts = event.target.id.split('_');
      newValue = parts[1];
    } else if (inputName === 'productHasImage') {
      newValue = event.target.checked;
      if (!newValue) {
        newFormData.localImageFile = null;
      }
    } else if (inputName === 'localImageFile') {
      newValue = event.target.files[0];
    } else {
      newValue = event.target.value;
    }

    newFormData[inputName] = newValue;
    newFormData.valid = isValid(newFormData);
    setFormData(newFormData);
  }

  const directUploadCompleted = (fileBlob) => {
    const newData = {...formData};
    newData.image = fileBlob.id;
    setFormData(newData);
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
            category: 'product',
            determination: formData.determination,
            refinement: formData.refinement,
            name: formData.name,
            value: formData.value,
            configuration: {
              order: formData.order,
              note: formData.note,
            },
          },
        ],
      },
    };
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: submissionSuccess,
      onFailure: (_) => console.log("Failed to save new item."),
    });
  }

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

          {/*<div className={`${classes.LineItem} ${classes.RadioSet} d-flex`}>*/}
          <div className={`${classes.LineItem} row justify-content-start`}>
            <div className={classes.RadioSetLabel}>
              <label>
                Type
              </label>
            </div>
            <div className={classes.RadioSet}>
              <div className={'form-check'}>
                <input type={'radio'}
                       onChange={inputChanged}
                       className={'form-check-input'}
                       name={'determination'}
                       checked={formData.determination === 'apparel'}
                       id={'determination_apparel'} />
                <label className={`form-check-label`}
                       htmlFor={'determination_apparel'}>
                  Apparel
                </label>
              </div>
              <div className={'form-check'}>
                <input type={'radio'}
                       onChange={inputChanged}
                       className={'form-check-input'}
                       name={'determination'}
                       checked={formData.determination === 'general'}
                       id={'determination_general'} />
                <label className={`form-check-label`}
                       htmlFor={'determination_general'}>
                  Other
                </label>
              </div>
            </div>
          </div>

          {/* This is duplicated and a good candidate for re-use */}
          <div className={`row ${classes.LineItem}`}>
            <label htmlFor={'name'} className={'form-label mb-1'}>
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

          {/* This is duplicated and a good candidate for re-use */}
          <div className={`row ${classes.LineItem}`}>
            <div className={'col-6 ps-0'}>
              <label htmlFor={'value'} className={'form-label ps-0 mb-1'}>
                Price (in USD)
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

          {/* We haven't gotten direct uploads working yet. We're stuck because the library
            * uses a browser API (File) that is not available server-side. But it does not
            * seem possible (so far) to lazily import the DirectUpload constructor from the
            * ActiveStorage JavaScript library, so we're giving up on it for now. If a
            * director wants to include an image on a product, they'll have to do it after
            * the product gets created. (Is that true?)
            */}

          {/*<div className={`row ${classes.LineItem}`}>*/}
          {/*  <div className={'form-check form-switch'}>*/}
          {/*    <input type={'checkbox'}*/}
          {/*           className={'form-check-input'}*/}
          {/*           role={'switch'}*/}
          {/*           id={'productHasImage'}*/}
          {/*           name={'productHasImage'}*/}
          {/*           checked={formData.productHasImage}*/}
          {/*           onChange={inputChanged}/>*/}
          {/*    <label htmlFor={'productHasImage'}*/}
          {/*           className={'form-check-label'}>*/}
          {/*      Include an image*/}
          {/*    </label>*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*{formData.productHasImage && (*/}
          {/*  <div className={`${classes.LineItem}`}>*/}
          {/*    <AssetUpload formLabel={"Image file upload"}*/}
          {/*                 uploadPath={tournament.direct_upload_url}*/}
          {/*                 onUploadComplete={directUploadCompleted}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}

          {/* Apply any special styling here? */}
          <div className={`row ${classes.PreviewItem}`}>
            <p className={`${classes.PreviewText}`}>
              How it will look to bowlers:
            </p>
            <Item item={itemPreviewProps} preview={true}/>
          </div>

          {/* Cancel & Save buttons */}
          <div className={'row'}>
            <div className={'d-flex justify-content-end pe-0'}>
              <button type={'button'}
                      title={'Cancel'}
                      onClick={onCancel}
                      className={'btn btn-outline-secondary me-2'}>
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
