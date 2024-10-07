import classes from './ActiveTournament.module.scss';
import {devConsoleLog} from "../../../utils";
import Toggle from "./Toggle";

const ControlPanel = ({configItems}) => {
  const panelItems = [
    'enable_free_entries',
    'accept_payments',
    'enable_unpaid_signups',
    'display_capacity',
    'publicly_listed',
  ];
  const devOnlyPanelItems = [
    'email_in_dev',
    'skip_stripe',
  ];

  // @admin
  // TODO: handle config item toggle

  return (
    <div className={classes.ControlPanel}>
      <div className="card mb-3">
        <h4 className={'card-header'}>
          Control Panel
        </h4>
        <ul className={'list-group list-group-flush'}>
          {panelItems.map(itemKey => {
            devConsoleLog("Current item:", itemKey);
            const item = configItems.find(({key}) => key === itemKey);
            if (!item) {
              devConsoleLog('Whoops, could not find a config item:', itemKey);
              return '';
            }
            return (
              <li className={'list-group-item'}
                  key={`${itemKey}--panel`}>
                <Toggle name={`control_panel--${itemKey}`}
                        label={item.label}
                        htmlId={`control_panel--${itemKey}`}
                        checked={!!item.value}
                        onChange={() => {}}
                        />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  )
}

export default ControlPanel;
