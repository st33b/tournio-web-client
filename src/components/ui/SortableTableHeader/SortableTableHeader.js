import classes from "./SortableTableHeader.module.scss";

// column is a Column instance from react-table
const SortableTableHeader = ({column, text}) => {
  const headerClassName = column.canSort ? 'link-primary' : '';
  const caretClass = column.isSortedDesc ? 'bi-caret-down-fill' : 'bi-caret-up-fill';
  const iconClass = column.isSorted ? classes.SortIndicator + ' ' + caretClass : 'visually-hidden';
  return (
    <span className={`text-nowrap ${classes.SortableTableHeader} ${headerClassName}`}>
      {text}
      <i className={iconClass} />
    </span>
  );
};

export default SortableTableHeader;
