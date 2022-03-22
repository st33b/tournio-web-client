import React from 'react';

import classes from './Input.module.scss';

const Input = (props) => {
  let inputElement = null;

  let invalidClass = '';
  if (props.invalid && props.shouldValidate && props.touched) {
    invalidClass = 'is-invalid';
  }

  switch (props.elementType) {
    case('input'):
      inputElement = <input
        id={props.identifier}
        name={props.identifier}
        className={`form-control ${invalidClass}`}
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
        className={`form-select ${invalidClass}`}
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
    let helper = props.helper.text;
    if (props.helper.url) {
      helper = (
        <a href={props.helper.url} target="_new">
          {props.helper.text}{' '}
          <i className={`${classes.ExternalLink} bi-box-arrow-up-right pl-2`} aria-hidden="true"/>
        </a>
      )
    }
    helperElement = (
      <small className="form-text text-muted">
        {helper}
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
        <i className={`${classes.RequiredLabel} align-top bi-asterisk`} />
        <span className="visually-hidden">
          This field is required.
        </span>
      </div>
    );
  }

  return (
    <div className={`${classes.Input} row mb-1 mb-sm-2`}>
      <label className="col-12 col-sm-4 col-form-label text-sm-end pb-0" htmlFor={props.identifier}>
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

export default Input;
