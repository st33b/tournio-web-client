const SuccessAlert = ({message}) => {
  if (!message) {
    return '';
  }

  return (
    <div className={`alert alert-success alert-dismissible fade show`}>
      <span>
        <i className={'bi bi-exclamation-circle-fill pe-2'} aria-hidden={true} />
        <strong>Success!</strong>{' '}
        {message}
      </span>
      <button type={`button`}
              className={`btn-close`}
              data-bs-dismiss={`alert`}
              aria-label={'Close'}></button>
    </div>
  );
}

export default SuccessAlert;
