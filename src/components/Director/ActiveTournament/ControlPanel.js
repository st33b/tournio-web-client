import classes from './ActiveTournament.module.scss';
import {devConsoleLog, updateObject} from "../../../utils";
import Toggle from "./Toggle";
import CardHeader from "./CardHeader";
import {useEffect, useState} from "react";

const ControlPanel = ({configItems, onChange}) => {
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

  const [configValues, setConfigValues] = useState({
    enable_free_entries: {
      id: '',
      value: false,
    },
    accept_payments: {
      id: '',
      value: false,
    },
    enable_unpaid_signups: {
      id: '',
      value: false,
    },
    display_capacity: {
      id: '',
      value: false,
    },
    publicly_listed: {
      id: '',
      value: false,
    },
    email_in_dev: {
      id: '',
      value: false,
    },
    skip_stripe: {
      id: '',
      value: false,
    },
  });

  useEffect(() => {
    if (!configItems) {
      return;
    }
    const newValues = {};
    panelItems.forEach(itemKey => {
      const item = configItems.find(({key}) => key === itemKey);
      newValues[itemKey] = {
        id: item.id,
        value: !!item.value,
      }
    });
    setConfigValues(updateObject(configValues, newValues));
  }, [configItems]);

  // @admin
  // TODO: add dev-only items

  const toggled = (event) => {
    const name = event.target.name.split('--')[1];
    const changes = {};
    changes[name] = {
      id: configValues[name].id,
      value: !configValues[name].value,
    }
    setConfigValues(configValues, changes);
    onChange(changes[name].id, changes[name].value);
  }

  return (
    <div className={classes.ControlPanel}>
      <div className="card mb-3">
        <CardHeader headerText={'Control Panel'}
                    titleText={'Changing these takes effect immediately'}
                    id={'control-panel--tooltip'}/>
        <ul className={'list-group list-group-flush'}>
          {panelItems.map(itemKey => {
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
                        checked={item.value}
                        onChange={toggled}
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
