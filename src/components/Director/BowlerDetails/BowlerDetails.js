import {useState, useEffect, useMemo} from "react";
import {useTable} from "react-table";
import {Button} from "react-bootstrap";

import {useDirectorContext} from "../../../store/DirectorContext";

import classes from './BowlerDetails.module.scss';

const bowlerDetails = ({bowler, bowlerUpdateSubmitted}) => {
  const directorContext = useDirectorContext();

  let identifier;
  if (directorContext && directorContext.tournament) {
    identifier = directorContext.tournament.identifier;
  }

  return <p>Aww yeah</p>;
}

export default bowlerDetails;