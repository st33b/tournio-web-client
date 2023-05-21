import {useEffect, useState} from "react";

import {useDirectorContext} from "../../../store/DirectorContext";
import {directorApiRequest} from "../../../director";
import ErrorBoundary from "../../common/ErrorBoundary";
import Item from "../../Commerce/AvailableItems/Item/Item";
import {purchasableItemsAdded} from "../../../store/actions/directorActions";
import {apparelSizes} from "../../../utils";

import classes from './ApparelItemForm.module.scss';
import productClasses from '../NewPurchasableItem/ProductForm.module.scss';

import AvailableSizes from "./AvailableSizes";
import ButtonRow from "../../common/ButtonRow";


const ApparelItemForm = ({tournament, onCancel, onComplete, item}) => {
  const context = useDirectorContext();
  const dispatch = context.dispatch;

  const initialState = {
    fields: {
      refinement: null, // It'll be null unless it comes in many sizes
      name: '',
      note: '',
      value: '',
      order: '',
      sizes: {
        one_size_fits_all: false,
        unisex: {
          xxs: false,
          xs: false,
          s: false,
          m: false,
          l: false,
          xl: false,
          xxl: false,
          xxxl: false,
        },
        women: {
          xxs: false,
          xs: false,
          s: false,
          m: false,
          l: false,
          xl: false,
          xxl: false,
          xxxl: false,
        },
        men: {
          xxs: false,
          xs: false,
          s: false,
          m: false,
          l: false,
          xl: false,
          xxl: false,
          xxxl: false,
        },
        infant: {
          newborn: false,
          m6: false,
          m12: false,
          m18: false,
          m24: false,
        },
      },
    },

    valid: false,
  }

  const [formData, setFormData] = useState(initialState);
  const [editing, setEditing] = useState(false);

  // Populate form data
  useEffect(() => {
    if (!item) {
      return;
    }
    const newFormFields = {
      name: item.name || '',
      note: item.configuration.note || '',
      value: item.value,
      order: item.configuration.order || '',
      // sizes: item.configuration.sizes || {},
    }
    for (const group in apparelSizes) {
      if (group === 'one_size_fits_all') {
        newFormFields.sizes[group] = 'one_size_fits_all';
      } else {
        newFormFields.sizes[group] = {...apparelSizes[group]};
      }
    }
    const newFormData = {
      fields: newFormFields,
      valid: isValid(newFormFields),
    }
    setFormData(newFormData);
  }, [item]);

  if (!tournament) {
    return '';
  }

  const allowEdit = !['active', 'closed'].includes(tournament.state);

  const isValid = ({name, value, order, sizes}) => {
    return sizesAreValid(sizes) && name.length > 0 && value > 0 && order > 0;
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
    } else {
      newValue = event.target.value;
    }

    newFormData.fields[inputName] = newValue;
    newFormData.valid = isValid(newFormData.fields);
    setFormData(newFormData);
  }

  const sizesAreValid = (sizes) => {
    if (sizes.one_size_fits_all) {
      return true;
    }
    const keys = ['unisex', 'women', 'men', 'infant'];
    return keys.map(k => {
      const sizeMap = sizes[k];
      return Object.values(sizeMap).some(sizePresent => !!sizePresent)
    }).some(val => !!val);
  }

  /**
   * sizeIdentifier is a path through the size map, e.g.,
   *   one_size_fits_all
   *   unisex.xs
   *   infant.m12
   */
  const sizeChanged = (sizeIdentifier, isChosen) => {
    const newFormData = {...formData};

    if (sizeIdentifier === 'one_size_fits_all') {
      newFormData.fields.sizes.one_size_fits_all = !!isChosen
    } else {
      const pathParts = sizeIdentifier.split('.');
      newFormData.fields.sizes[pathParts[0]][pathParts[1]] = !!isChosen;
    }
    newFormData.valid = isValid(newFormData.fields);
    setFormData(newFormData);
  }

  /**
   * Sets all the sizes in a set to true or false
   * @param setIdentifier The identifier of the set to modify
   * @param newValue true or false
   */
  const setAllSizesInSet = (setIdentifier, newValue) => {
    const newFormData = {...formData};
    Object.keys(newFormData.fields.sizes[setIdentifier]).forEach(size => newFormData.fields.sizes[setIdentifier][size] = !!newValue);
    newFormData.valid = isValid(newFormData.fields);
    setFormData(newFormData);
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
            determination: 'apparel',
            name: formData.fields.name,
            value: formData.fields.value,
            configuration: {
              order: formData.fields.order,
              note: formData.fields.note,
            },
          },
        ],
      },
    };
    if (formData.fields.sizes.one_size_fits_all) {
      requestConfig.data.purchasable_items[0].configuration.size = 'one_size_fits_all';
    } else {
      requestConfig.data.purchasable_items[0].refinement = 'sized';
      requestConfig.data.purchasable_items[0].configuration.sizes = {};
      ['unisex', 'women', 'men', 'infant'].forEach(sizeGroup => {
        requestConfig.data.purchasable_items[0].configuration.sizes[sizeGroup] = formData.fields.sizes[sizeGroup];
      });
    }
    directorApiRequest({
      uri: uri,
      requestConfig: requestConfig,
      context: context,
      onSuccess: submissionSuccess,
      onFailure: (_) => console.log("Failed to save item."),
    });
  }

  const itemPreviewProps = {
    category: 'product',
    determination: 'apparel',
    name: formData.fields.name,
    value: formData.fields.value,
    configuration: {
      note: formData.fields.note,
      // denomination: formData.denomination,
      order: formData.fields.order,
      sizes: formData.fields.sizes,
    }
  }


  return (
    <ErrorBoundary>
      <div className={classes.ApparelItem}>
        <form onSubmit={formSubmitted} className={`py-2`}>
          <div className={`${classes.HeaderRow} row mb-2`}>
            <h6>
              New Apparel Item
            </h6>
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
                   value={formData.fields.name}
            />
          </div>

          {/* This is duplicated and a good candidate for re-use */}
          <div className={`row ${classes.LineItem}`}>
            <label htmlFor={'note'} className={'form-label mb-1'}>
              Note (optional)
            </label>
            <input type={'text'}
                   className={`form-control`}
                   name={'note'}
                   id={'note'}
                   onChange={inputChanged}
                   value={formData.fields.note}
            />
          </div>

          <div className={`row ${classes.LineItem}`}>
            <AvailableSizes selectedSizes={formData.fields.sizes}
                            onSizeChanged={sizeChanged}
                            onAllInGroupSet={setAllSizesInSet}
            />
          </div>

          {/* This is duplicated and a good candidate for re-use */}
          <div className={`row ${classes.LineItem}`}>
            <div className={'col-6 ps-0'}>
              <label htmlFor={'value'} className={'form-label mb-1'}>
                Price (in USD)
              </label>
              <input type={'number'}
                     className={`form-control`}
                     name={'value'}
                     id={'value'}
                     required={true}
                     onChange={inputChanged}
                     value={formData.fields.value}
              />
            </div>
            <div className={'col-6 pe-0'}>
              <label htmlFor={'order'} className={'form-label mb-1'}>
                Display order
              </label>
              <input type={'number'}
                     className={`form-control`}
                     name={'order'}
                     id={'order'}
                     required={true}
                     onChange={inputChanged}
                     value={formData.fields.order}
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

          <div className={`row ${productClasses.PreviewItem}`}>
            <p className={`${productClasses.PreviewText}`}>
              How it will look to bowlers:
            </p>
            <Item item={itemPreviewProps} preview={true}/>
          </div>

          <ButtonRow onCancel={onCancel} disableSave={!formData.valid} />
          {/* Cancel & Save buttons */}
          {/*<div className={'row'}>*/}
          {/*  <div className={'d-flex justify-content-end pe-0'}>*/}
          {/*    <button type={'button'}*/}
          {/*            title={'Cancel'}*/}
          {/*            onClick={onCancel}*/}
          {/*            className={'btn btn-outline-secondary me-2'}>*/}
          {/*      <i className={'bi-x-lg'} aria-hidden={true}/>*/}
          {/*      <span className={'visually-hidden'}>*/}
          {/*        Cancel*/}
          {/*      </span>*/}
          {/*    </button>*/}
          {/*    <button type={'submit'}*/}
          {/*            title={'Save'}*/}
          {/*            disabled={!formData.valid}*/}
          {/*            className={'btn btn-outline-success'}>*/}
          {/*      <i className={'bi-check-lg'} aria-hidden={true}/>*/}
          {/*      <span className={'visually-hidden'}>*/}
          {/*        Save*/}
          {/*      </span>*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*</div>*/}

        </form>
      </div>
    </ErrorBoundary>
  )
}

export default ApparelItemForm;
