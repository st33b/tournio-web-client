const SuccessAlert = ({message, className='', onClose=()=>{}}) => {
  if (!message) {
    return '';
  }

  return (
    <div className={`alert alert-success alert-dismissible fade show ${className}`}>
      <span>
        <i className={'bi bi-check2-circle pe-2'} aria-hidden={true} />
        <strong>Success!</strong>{' '}
        {message}
      </span>
      <button type={`button`}
              className={`btn-close`}
              data-bs-dismiss={`alert`}
              onClick={onClose}
              aria-label={'Close'}></button>
    </div>
  );
}

export default SuccessAlert;
