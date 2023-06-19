const ErrorAlert = ({message, className=''}) => {
  if (!message) {
    return '';
  }

  return (
    <div className={`alert alert-danger alert-dismissible fade show ${className}`}>
      <span>
        <i className={'bi bi-exclamation-triangle pe-2'} aria-hidden={true} />
        <strong>Error:</strong>{' '}
        {message}
      </span>
      <button type={`button`}
              className={`btn-close`}
              data-bs-dismiss={`alert`}
              aria-label={'Close'}></button>
    </div>
  );
}

export default ErrorAlert;
