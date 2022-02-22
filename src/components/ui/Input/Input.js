import React from 'react';

import classes from './Input.module.scss';

const input = (props) => {
  let inputElement = null;

  const inputClasses = [classes.Input, "form-control"];
  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push('is-invalid');
  }

  switch (props.elementType) {
    case('input'):
      inputElement = <input
        id={props.identifier}
        name={props.identifier}
        className={inputClasses.join(' ')}
        maxLength="100"
        {...props.elementConfig}
        onChange={props.changed}
        required={props.validationRules.required}
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
        className={inputClasses.join(' ')}
        onChange={props.changed}
        required={props.validationRules.required}
        value={props.elementConfig.value}
      >
        {optionText}
      </select>
      break;
    case('component'):
      const Component = props.elementConfig.component;
      inputElement = React.createElement(Component, {
          id: props.identifier,
          value: props.elementConfig.value,
          onChange: props.changed,
          ...props.elementConfig.props,
        }
      );
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
  //   shouldValidate={true}
  //   touched={formElement.setup.touched}
  //   invalid={!formElement.setup.valid}
  //   validationRules={formElement.setup.validation}
  //  + everything in elementConfig (value, type)

  let helperElement = '';
  if (props.helper && props.helper.text) {
    helperElement = (
      <small className="form-text text-muted">
        <a href={props.helper.url} target="_new">
          {props.helper.text}{' '}
          <i className="bi-box-arrow-up-right pl-2" aria-hidden="true"/>
        </a>
      </small>
    );
  }

  let requiredFeedback = '';
  let requiredLabel = '';
  if (props.validationRules.required) {
    requiredFeedback = (
      <div className="invalid-feedback">
        <div>
          <i className="bi-x" aria-hidden="true"/>
          <span className={classes.InvalidFeedback}>
            This field is required.
          </span>
        </div>
      </div>
    );
    requiredLabel = (
      <div className="d-inline">
        <span className={classes.RequiredLabel}>*</span>
        <span className="sr-only">
          This field is required.
        </span>
      </div>
    );
  }

  return (
    <div className="row mb-1 mb-sm-2">
      <label className="col-sm-6 col-lg-4 col-form-label text-sm-end pb-0" htmlFor={props.identifier}>
        {props.label}
        {requiredLabel}
      </label>
      <div className="col">
        {inputElement}
        {helperElement}
        {requiredFeedback}
      </div>
    </div>
  )
};

export default input;
