const ButtonRow = ({onCancel, disableSave, onDelete}) => (
  <div className={'d-flex justify-content-end'}>
    {onDelete &&
      <button type={'button'}
              title={'Delete'}
              onClick={onDelete}
              className={'btn btn-danger me-auto'}>
        <i className={'bi bi-slash-circle pe-2'} aria-hidden={true}/>
        Delete
      </button>
    }
    <button type={'button'}
            title={'Cancel'}
            onClick={onCancel}
            className={'btn btn-secondary me-2'}>
      Cancel
    </button>
    <button type={'submit'}
            title={'Save'}
            disabled={disableSave}
            className={'btn btn-primary'}>
      Save
    </button>
  </div>
);

export default ButtonRow;
