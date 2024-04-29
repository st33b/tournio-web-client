import React from 'react';
import PropTypes from 'prop-types';
import styles from './Select.module.scss';

/**
 * Input element for text and similar fields.
 */
export const Select = ({
                       name,
                       id,
                       label,
                       value,
                       inputChanged,
                       options,
                       required = false,
                       wasValidated = false,
                       maxLength = 100,
                       ...theRest
}) => {
  // Allow specifying a placeholder element?

  // No need to do anything different with this...
  let helperElement = '';
  if (theRest.helper && theRest.helper.text) {
    let helper = theRest.helper.text;
    if (theRest.helper.url) {
      helper = (
        <a href={theRest.helper.url} target="_blank" rel="noreferrer">
          {theRest.helper.text}{' '}
          <i className={`${styles.ExternalLink} bi-box-arrow-up-right pl-2`} aria-hidden="true"/>
        </a>
      )
    }
    helperElement = (
      <small className="form-text text-secondary">
        {helper}
      </small>
    );
  }

  // Ditto for this: no need to do anything different...
  let errorMessages = [];
  if (theRest.failedValidations) {
    errorMessages = theRest.failedValidations.map(fv => {
      // If there's a specified error message for the failed validation, return it.
      if (theRest.errorMessages && theRest.errorMessages[fv]) {
        return theRest.errorMessages[fv];
      }
      // Otherwise, use the standard one.
      switch(fv) {
        case 'valueMissing':
          return 'We need something here.';
        case 'patternMismatch':
          return "That doesn't look quite right";
        case 'typeMismatch':
          return "That doesn't look quite right";
        case 'rangeUnderflow':
          return 'Too low';
        case 'rangeOverflow':
          return 'Too high';
        case 'tooLong':
          return 'Too long';
        case 'tooShort':
          return 'Too short';
        default:
          return 'Please enter a valid value';
      }
    });
  }

  // Reusable
  const requiredLabel = (
    <div className={`d-inline`}>
      <i className={`${styles.RequiredLabel} align-top bi bi-asterisk`} />
      <span className="visually-hidden">
              This field is required.
            </span>
    </div>
  );

  return (
    <div className={`row mb-1 mb-md-2 ${styles.Select}`}>
      {label && (
        <label className={`col-form-label col-12 col-sm-5 pb-1 text-sm-end`} htmlFor={id}>
          {label}
          {required && requiredLabel}
        </label>
      )}
      <div className={`col`}>
        <input type={inputType}
               name={name}
               id={id}
               placeholder={placeholder}
               value={value}
               onChange={inputChanged}
               required={required}
               className={`form-control ${wasValidated ? 'was-validated' : ''}`}
               maxLength={maxLength}
        />
        {helperElement}
        {errorMessages.length > 0 && (
          <div className={`${styles.InvalidFeedback}`}>
            {errorMessages.map((e, i) => (
              <span className={`d-block`} key={i}>
              <i className={`bi bi-x me-1`} aria-hidden={true}/>
              <span>{e}</span>
            </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

Select.propTypes = {
  /**
   * The element name
   */
  name: PropTypes.string.isRequired,
  /**
   * The element ID
   */
  id: PropTypes.string.isRequired,
  /**
   * What to display in the label element
   */
  label: PropTypes.string.isRequired,
  /**
   * The element's value
   */
  value: PropTypes.string.isRequired,
  /**
   * Callback to fire when the element's value changes
   */
  inputChanged: PropTypes.func.isRequired,
  /**
   * Whether to mark this element as required.
   */
  required: PropTypes.bool,
  /**
   * The kind of input element to render. Defaults to "text"
   */
  inputType: PropTypes.string,
  /**
   * How many characters of input to permit. Defaults to 100.
   */
  maxLength: PropTypes.number,
  /**
   * Select to render as placeholder value.
   */
  placeholder: PropTypes.string,
  /**
   * Which of the standard validation failure types to display, e.g.,
   * **patternMismatch**, **valueMissing**.
   */
  failedValidations: PropTypes.arrayOf(PropTypes.string),
  /**
   * Whether to render the field with validation.
   */
  wasValidated: PropTypes.bool,
}
