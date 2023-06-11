import React from 'react';

import classes from './Input.module.scss';
import {devConsoleLog} from "../../../utils";
import {Collapse} from "react-bootstrap";

const Input = (props) => {
  let inputElement = null;

  const required = props.validityErrors && props.validityErrors.includes('valueMissing');
// devConsoleLog("failed validations", props.failedValidations);
  const errorMessages = props.failedValidations.map(fv => {
    // If there's a specified error message for the failed validation, return it.
    if (props.errorMessages && props.errorMessages[fv]) {
      return props.errorMessages[fv];
    }
    // Otherwise, go with a generic one using the switch.
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

  switch (props.elementType) {
    case('input'):
      inputElement = <input
        id={props.identifier}
        name={props.identifier}
        className={`form-control`}
        maxLength="100"
        {...props.elementConfig}
        onChange={props.changed}
        onBlur={!!props.blurred ? props.blurred : () => {}}
        required={required}
      />
      break;
    case('select'):
      const optionText = props.elementConfig.options.map((option, i) => {
        return (
          <option value={option.value} key={i}>
            {option.label}
          </option>
        );
      });
      inputElement = <select
        id={props.identifier}
        name={props.identifier}
        className={`form-select`}
        onChange={props.changed}
        required={required}
        value={props.elementConfig.value}
      >
        {optionText}
      </select>
      break;
    case('component'):
      const Component = props.elementConfig.component;
      const componentClasses = props.elementConfig.classNames.concat(errorMessages.length > 0 ? 'is-invalid' : []);
      inputElement = React.createElement(Component, {
          id: props.identifier,
          value: props.elementConfig.value,
          onChange: props.changed,
          classes: componentClasses.join(' '),
          ...props.elementConfig.props,
        }
      );
      break;
    case('checkbox'):
      inputElement = (
        <div className={`form-check`}>
          <input
            type={'checkbox'}
            className={'form-check-input'}
            id={props.identifier}
            name={props.identifier}
            onChange={props.changed}
            {...props.elementConfig}
            checked={props.elementConfig.value === 'yes' || props.elementConfig.value === true}
          />
          <label className={'form-check-label'}>
            {props.elementConfig.label}
          </label>
        </div>
      );
      break;
    case('radio'):
      inputElement = props.elementConfig.choices.map((choice, i) => (
        <div className={`form-check`} key={i}>
          <input type={'radio'}
                 className={'form-check-input'}
                 required={required}
                 value={choice.value}
                 onChange={props.changed}
                 checked={props.elementConfig.value === choice.value}
                 id={`${props.identifier}_${choice.value}`}
                 name={props.identifier}>
          </input>
          <label className={'form-check-label'}
                 htmlFor={`${props.identifier}_${choice.value}`}>
            {choice.label}
          </label>
        </div>
      ));
      break;
    default:
      console.log("I don't recognize that element type: " + props.elementType);
      return null;
  }

  // props:
  //   key={formElement.id}
  //   identifier={formElement.id}
  //   elementType={formElement.setup.elementType}
  //   elementConfig={formElement.setup.elementConfig}
  //   changed={(event) => inputChangedHandler(event, formElement.id)}
  //   label={formElement.setup.label}
  //   validityErrors={formElement.setup.validityErrors} (if any)
  //   blurred={(event) => fieldBlurred(event, formElement.id)} or blurred={false}
  //   failedValidations=[names of any validations that failed
  //   wasValidated={true/false}
  //  + everything in elementConfig (value, type)

  let helperElement = '';
  if (props.helper && props.helper.text) {
    let helper = props.helper.text;
    if (props.helper.url) {
      helper = (
        <a href={props.helper.url} target="_blank" rel="noreferrer">
          {props.helper.text}{' '}
          <i className={`${classes.ExternalLink} bi-box-arrow-up-right pl-2`} aria-hidden="true"/>
        </a>
      )
    }
    helperElement = (
      <small className="form-text text-secondary">
        {helper}
      </small>
    );
  }

  return (
    <div className={`${classes.Input} row mb-1 mb-sm-2`}>
      <label className="col-12 col-sm-5 col-form-label text-sm-end pb-0" htmlFor={props.identifier}>
        {props.label}
        {required && (
          <div className="d-inline">
            <i className={`${classes.RequiredLabel} align-top bi-asterisk`} />
            <span className="visually-hidden">
              This field is required.
            </span>
          </div>
        )}
      </label>
      <div className={`col ${props.wasValidated ? 'was-validated' : ''}`}>
        {inputElement}
        {helperElement}
        <Collapse in={errorMessages.length > 0}>
          <div className={`${classes.InvalidFeedback}`}>
            {errorMessages.map((e, i) => (
              <span className={"line"} key={`${props.identifier}_errorMsg_${i}`}>
              <i className="bi bi-x me-1" aria-hidden="true"/>
              <span>
                {e}
              </span>
            </span>
            ))}
          </div>
        </Collapse>
        {props.identifier === 'email' && (
          <Collapse in={props.loading}>
            <div className={`mt-1 ${classes.ValidationInProgress}`}>
              <span className={'spinner-grow spinner-grow-sm me-2'} role={'status'} aria-hidden={true}></span>
              Checking email address...
            </div>
          </Collapse>
        )}
      </div>
    </div>
  )
};

export default Input;
