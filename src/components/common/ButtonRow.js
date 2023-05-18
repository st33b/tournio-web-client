const ButtonRow = ({onCancel, disableSave}) => (
  <div className={'d-flex justify-content-end'}>
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
