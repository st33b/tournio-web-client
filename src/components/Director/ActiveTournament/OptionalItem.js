import classes from './ActiveTournament.module.scss';
import Toggle from "./Toggle";

const OptionalItem = ({item, onEnableToggle}) => {
  if (!item) {
    return (
      <div className="row pb-3">
        <span className={"placeholder col-2 col-md-2 col-lg-1"}></span>
        <span className={"placeholder col ms-3"}></span>
      </div>
    );
  }

  if (item.category === 'product' && item.determination === 'apparel') {
    if (item.configuration.parent_identifier) {
      return '';
    }
  }

  let additionalText = '';
  if (item.refinement === 'division') {
    additionalText = `Division: ${item.configuration['division']}`;
    if (item.configuration.note) {
      additionalText += ` (${item.configuration.note})`;
    }
  } else if (item.configuration.note) {
    additionalText = item.configuration.note;
  }

  const label = (
    <span className={`${classes.Name}`}>
      {item.name}
      {additionalText && (
        <span className={`line ${classes.Additional}`}>
          {additionalText}
        </span>
      )}
    </span>
  );

  return (
    <div className={classes.Item}>
      <Toggle name={`optional-item-toggle--${item.identifier}`}
              label={label}
              title={item.enabled ? 'Disable purchase of this' : 'Enable purchase of this'}
              id={`optional-item-toggle--${item.identifier}`}
              checked={item.enabled}
              onChange={() => {}}
              />
      {/*<div className={'d-flex w-100 justify-content-start'}>*/}
      {/*  {item.category !== 'ledger' && (*/}
      {/*    <div className={'form-check form-switch'}*/}
      {/*         title={item.enabled ? 'Disable purchase of this' : 'Enable purchase of this'}>*/}
      {/*      <input type={'checkbox'}*/}
      {/*             className={'form-check-input'}*/}
      {/*             role={'switch'}*/}
      {/*             name={`purchasable_item_${item.key}`}*/}
      {/*             id={item.key}*/}
      {/*             checked={item.enabled}*/}
      {/*             onChange={() => onEnableToggle(item.identifier, !item.enabled)}/>*/}
      {/*    </div>*/}
      {/*  )}*/}

      {/*  <span className={`${classes.Name}`}>*/}
      {/*    {item.name}*/}
      {/*    {additionalText && <span className={`line ${classes.Additional}`}>*/}
      {/*      {additionalText}*/}
      {/*      </span>*/}
      {/*    }*/}
      {/*  </span>*/}

      {/*  <span className={`ms-auto ${classes.Price}`}>${item.value}</span>*/}
      {/*</div>*/}
    </div>
  )
}

export default OptionalItem;
