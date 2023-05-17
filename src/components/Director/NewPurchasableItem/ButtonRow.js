const ButtonRow = ({onCancel, disableSave}) => (
  <div className={'row'}>
    <div className={'d-flex justify-content-end pe-0'}>
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
  </div>
);

export default ButtonRow;
