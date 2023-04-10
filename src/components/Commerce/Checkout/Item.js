import classes from './Item.module.scss';

const item = ({item}) => {
  if (!item) {
    return '';
  }

  const nameClasses = [];
  let note = '';
  let value = '$' + item.value;

  if (item.category === 'bowling' && item.determination === 'single_use' || item.category === 'sanction') {
    nameClasses.push('col-9');
    if (item.configuration.division) {
      note = (
        <p className={classes.Note + ' col-12 mt-0 ms-2'}>
          Division: {item.configuration.division}
        </p>
      );
    }
  } else {
    nameClasses.push('col-8');
    const totalValue = item.value * item.quantity;
    value = (
      <span>
        ${item.value} &times; {item.quantity} = ${totalValue}
      </span>
    );
  }

  return (
    <div className={classes.Item}>
      <div className='row'>
        <p className={nameClasses.join(' ')}>
          {item.name}
        </p>
        <p className={classes.Value + ' col'}>
          {value}
        </p>
        {note}
      </div>

    </div>
  );
}

export default item;
