import React from "react";

const ErrorPage = ({text}) => {
  if (!text) {
    return '';
  }
  return (
    <div className={'alert alert-danger alert-dismissible fade show d-flex align-items-center my-3'} role={'alert'}>
      <i className={'bi-exclamation-triangle-fill pe-2'} aria-hidden={true} />
      <div className={'me-auto'}>
        {text}
        <button type="button"
                className={"btn-close"}
                data-bs-dismiss="alert"
                aria-label="Close" />
      </div>
    </div>
  );
}

export default ErrorPage;
