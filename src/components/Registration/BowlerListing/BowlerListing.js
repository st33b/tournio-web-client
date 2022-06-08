import {useEffect, useMemo, useRef, useState} from 'react';
import {useTable, useSortBy, useFilters} from 'react-table';
import {List} from 'immutable';

import SortableTableHeader from "../../ui/SortableTableHeader/SortableTableHeader";
import {doesNotEqual, isOrIsNot} from "../../../utils";


import classes from './BowlerListing.module.scss';

const BowlerListing = ({caption, bowlers}) => {
  return (
    <div className={classes.BowlerListing}>
      Coming soon...
    </div>
  );
}

export default BowlerListing;