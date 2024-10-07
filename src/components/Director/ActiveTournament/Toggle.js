const Toggle = ({name, label, htmlId, checked, onChange}) => (
  <div className={'form-check form-switch'}>
    <input type={'checkbox'}
           className={'form-check-input'}
           role={'switch'}
           name={name}
           id={htmlId}
           checked={checked}
           onChange={onChange}/>
    <label className={'form-check-label'}
           htmlFor={htmlId}>
      {label}
    </label>
  </div>
);

export default Toggle;
