import classes from './AvailableSizes.module.scss';
import SizesForm from "./SizesForm";
import {apparelSizeMapping} from "../../../utils";
import React from "react";

// TODO: figure out how we're storing sizes on a purchasable item, and pass them into here
const AvailableSizes = ({selectedSizes, onSizeChanged, onAllInGroupSet}) => {
  if (!selectedSizes) {
    return '';
  }

  const anySizesChosen = [selectedSizes.one_size_fits_all].concat(
    ['unisex', 'women', 'men', 'infant'].map(setKey => Object.values(selectedSizes[setKey]))
  ).flat().some(v => v);

  return (
    <div className={`${classes.AvailableSizes} d-flex justify-content-left`}>
      <div className={`${classes.Label} flex-grow-1`}>
        Available Sizes
        <i className={`${classes.RequiredLabel} align-top bi-asterisk`}/>
        <span className="visually-hidden">
          Need at least one size, even if it&apos;s One Size Fits All.
        </span>
      </div>
      <div className={`w-100`}>
        {!anySizesChosen && (
          <div className={classes.SizeHeader}>
            None selected.
          </div>
        )}
        {anySizesChosen && selectedSizes.one_size_fits_all &&  (
          <div className={classes.SizeHeader}>
            {apparelSizeMapping.one_size_fits_all}
          </div>
        )}
        {anySizesChosen && ['unisex', 'women', 'men', 'infant'].map(sizeSet => {
          const chosenSizesInSet = Object.keys(selectedSizes[sizeSet]).filter(key => selectedSizes[sizeSet][key]);
          const anySizesChosen = chosenSizesInSet.length > 0;
          if (!anySizesChosen) {
            return '';
          }
          return (
            <div key={`available-for-${sizeSet}`}>
              <div className={classes.SizeHeader}>
                {apparelSizeMapping[sizeSet]}
              </div>
              <div className={`${classes.SetOfSizes} d-flex flex-wrap`}>
                {
                  chosenSizesInSet.map(sizeKey => (
                    <div className={classes.Size} key={`${sizeSet}-${sizeKey}-availability`}>
                      {apparelSizeMapping[sizeKey]}
                    </div>
                  ))
                }
              </div>
            </div>
          )
        })}
        <div className={classes.SetOfSizes}>
        </div>
        <button className={'btn btn-sm btn-secondary'}
                type={'button'}
                data-bs-toggle="modal"
                data-bs-target="#sizeSelection">
          Choose
        </button>

        <div className="modal fade"
             id="sizeSelection"
             data-bs-backdrop="static"
             data-bs-keyboard="false"
             tabIndex="-1"
             aria-labelledby="sizeSelectionLabel"
             aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5"
                    id="sizeSelectionLabel">
                  Product will be available in these sizes:
                </h1>
                <button type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <SizesForm sizeMap={selectedSizes}
                           onSizeChanged={onSizeChanged}
                           onAllInGroupSet={onAllInGroupSet}
                />
              </div>
              <div className="modal-footer">
                <button type="button"
                        className="btn btn-primary"
                        data-bs-dismiss="modal">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AvailableSizes;
