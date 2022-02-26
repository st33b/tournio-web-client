import classes from "./SortableTableHeader.module.scss";

// column is a Column instance from react-table
const sortableTableHeader = ({column, text}) => {
  const headerClassName = column.canSort ? 'link-primary' : '';
  return (
    <span className={`${classes.SortableTableHeader} ${headerClassName}`}>
        {text}
      <i className={column.isSorted
        ? classes.SortIndicator + ' ' + (column.isSortedDesc ? 'bi-caret-down-fill' : 'bi-caret-up-fill')
        : 'visually-hidden'
      }
      />
    </span>
  );
};

export default sortableTableHeader;