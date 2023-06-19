import classes from './OfficeUseOnly.module.scss';
import React, {useEffect, useState} from "react";
import {Map} from 'immutable';

const OfficeUseOnly = ({bowler, onSubmit, loading = false}) => {
  const initialFormData = Map({
    verified_average: '',
    handicap: '',
    igbo_member: '',

    valid: false,
  });

  const [formData, setFormData] = useState(initialFormData);

  // If there's a valid bowler prop, put their data into the form data
  useEffect(() => {
    if (!bowler) {
      return;
    }
    const newFormData = formData.withMutations(map => {
      if (bowler.verified_average) {
        map.set('verified_average', bowler.verified_average);
      }
      if (bowler.handicap) {
        map.set('handicap', bowler.handicap);
      }
      map.set('igbo_member', bowler.igbo_member)
    });
    newFormData.set('valid', isValid(newFormData));
    setFormData(newFormData);
  }, [bowler]);

  const isValid = (data) => {
    const avg = data.get('verified_average');
    const hdcp = data.get('handicap');
    const typesMatch = typeof avg === 'number' && typeof hdcp === 'number';
    const avgIsValid = avg >= 0;

    // Allowing for negative handicap
    return typesMatch && avgIsValid;
  }

  const inputChanged = (event) => {
    let newValue = parseInt(event.target.value);
    const elemName = event.target.name;

    if (elemName === 'igbo_member') {
      newValue = event.target.checked;
    }

    const newFormData = formData.set(elemName, newValue);
    setFormData(newFormData.set('valid', isValid(newFormData)));
  }

  const formSubmitted = (event) => {
    event.preventDefault();
    const data = {
      verified_average: formData.get('verified_average'),
      handicap: formData.get('handicap'),
      igbo_member: formData.get('igbo_member'),
    }
    onSubmit(data);
  }

  return (
    <div className={classes.OfficeUseOnly}>
      <form onSubmit={formSubmitted}>
        <div className={'row mb-1 mb-sm-2'}>
          <label className="col-12 col-sm-7 col-form-label text-sm-end pb-0" htmlFor='verified_average'>
            Verified Average
          </label>
          <div className="col">
            <input type={"number"}
                   className={'form-control'}
                   value={formData.get('verified_average')}
                   onChange={inputChanged}
                   min={0}
                   max={300}
                   name={'verified_average'}
                   id={'verified_average'}/>
          </div>
        </div>
        <div className={'row mb-1 mb-sm-2'}>
          <label className="col-12 col-sm-7 col-form-label text-sm-end pb-0" htmlFor='handicap'>
            Tournament Handicap
          </label>
          <div className="col">
            <input type={"number"}
                   className={'form-control'}
                   value={formData.get('handicap')}
                   onChange={inputChanged}
                   name={'handicap'}
                   id={'handicap'}/>
          </div>
        </div>
        <div className={'row mb-1 mb-sm-0 d-flex align-items-center'}>
          <label className={'col-form-label col-12 col-sm-7 text-sm-end pb-0'}
                 htmlFor={'igbo_memeber'}>
            IGBO Membership Verified
          </label>
          <div className={'col'}>
            <input type={'checkbox'}
                   value={true}
                   id={'igbo_member'}
                   name={'igbo_member'}
                   checked={formData.get('igbo_member')}
                   onChange={inputChanged}/>
          </div>
        </div>
        <div className={'row'}>
          <div className={'text-center mt-3'}>
            <button type={'submit'}
                    className={'btn btn-sm btn-primary'}
                    disabled={!formData.get('valid') || loading}>
              {loading && (
                <span>
                    <span className={'spinner-birder spinner-border-sm pe-2'} role={'status'} aria-hidden={true}></span>
                  </span>
              )}
              Save
              <i className={'bi bi-chevron-right ps-2'} aria-hidden={true}/>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default OfficeUseOnly;
