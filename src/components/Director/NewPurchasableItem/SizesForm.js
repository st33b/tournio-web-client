import {useState, useEffect} from "react";
import {Map} from 'immutable';

import {devConsoleLog} from "../../../utils";
import classes from './SizesForm.module.scss';

/*
 * {
 *   oneSizeFitsAll: true/false,
 *   unisex: {
 *     xxs: true/false,
 *     ...
 *     xxxl: true/false
 *   },
 *   women: {
 *     xxs: true/false,
 *     ...
 *     xxxl: true/false
 *   },
 *   men: {
 *     xxs: true/false,
 *     ...
 *     xxxl: true/false
 *   },
 *   infant: {
 *     newborn: true/false,
 *     6m: true/false,
       ...
 *     24m: true/false,
 *   },
 * }
 *
 * When oneSizeFitsAll is true, the rest get disabled, but hold on to their values
 * so we don't force the user to re-check the ones they wanted.
 *
 * onComplete is what we call when the user is done, passing it the form data
 */
const SizesForm = ({displaySizes, sizeMap, onSizeChanged, onAllInGroupSet}) => {
  useEffect(() => {
    if (typeof sizeMap === undefined) {
      return;
    }
    devConsoleLog('Awaiting definition of selected sizes');
  }, [sizeMap]);

  if (!sizeMap) {
    return '';
  }

  const aBoxWasChecked = (event) => {
    const sizePath = event.target.name;
    const isChosen = event.target.checked;
    onSizeChanged(sizePath, isChosen);
  }

  const allOrNoneClicked = (event, setKey, value) => {
    event.preventDefault();
    if (sizeMap.oneSizeFitsAll) {
      return;
    }
    onAllInGroupSet(setKey, value);
  }

  return (
    <div className={`${classes.SizesForm}`}>
      <div className={`row ${classes.SizeSet}`}>
        <div className={`col`}>
          <div className={classes.Size}>

            <div className="form-check">
              <input className="form-check-input"
                     type="checkbox"
                     id="oneSizeFitsAll"
                     name={"oneSizeFitsAll"}
                     checked={sizeMap.oneSizeFitsAll}
                     onChange={aBoxWasChecked}
              />
              <label className="form-check-label"
                     htmlFor="oneSizeFitsAll">
                {displaySizes.oneSizeFitsAll}
              </label>
            </div>

          </div>
        </div>
      </div>
      {['unisex', 'women', 'men', 'infant'].map(setKey => {
        const sizeKeys = Object.keys(sizeMap[setKey]);
        return (
          <div className={`row`} key={`selection-for-${setKey}`}>
            <div className={`col`}>
              <div className={`${classes.SizeSetKey} d-flex align-items-end`}>
                <div className={classes.Title}>
                  {displaySizes[setKey]}
                </div>
                <div className={classes.MultiLink}>
                  {sizeMap.oneSizeFitsAll && (
                    <span className={'text-muted'}>
                      all
                    </span>
                  )}
                  {!sizeMap.oneSizeFitsAll && (
                    <a href={'#'}
                       onClick={(event) => allOrNoneClicked(event, setKey, true)}>
                      all
                    </a>
                  )}
                </div>
                <div className={classes.MultiLink}>
                  {sizeMap.oneSizeFitsAll && (
                    <span className={'text-muted'}>
                      none
                    </span>
                  )}
                  {!sizeMap.oneSizeFitsAll && (
                    <a href={'#'}
                       onClick={(event) => allOrNoneClicked(event, setKey, false)}>
                      none
                    </a>
                  )}
                </div>
              </div>
              <div className={`${classes.SizeSet} d-flex`}>
                {sizeKeys.map(key => (
                  <div className={`${classes.Size} ${!sizeMap.oneSizeFitsAll ? classes.Enabled : ''} flex-fill`} key={`${setKey}-${key}-checkbox`}>

                    <div className="form-check">
                      <input className="form-check-input"
                             type="checkbox"
                             id={`${setKey}-${key}`}
                             name={`${setKey}.${key}`}
                             checked={sizeMap[setKey][key]}
                             disabled={sizeMap.oneSizeFitsAll}
                             onChange={aBoxWasChecked}
                      />
                      <label className="form-check-label"
                             htmlFor={`${setKey}-${key}`}>
                        {displaySizes[key]}
                      </label>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SizesForm;
