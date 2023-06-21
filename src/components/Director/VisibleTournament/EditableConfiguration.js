import classes from './VisibleTournament.module.scss';
import {Placeholder, Card, ListGroup} from "react-bootstrap";
import ConfigItemForm from "./ConfigItemForm";
import {useTournament} from "../../../director";

const EditableConfiguration = ({editableKeys}) => {
  const {loading, tournament} = useTournament();

  if (loading) {
    return '';
  }

  const items = tournament.config_items.filter(({key}) => editableKeys.includes(key));

  return (
    <div className={classes.EditableConfiguration}>
      <ListGroup>
        {items.map((item) => <ConfigItemForm item={item} key={item.key} editable={true}/>)}
      </ListGroup>
    </div>
  );
}

export default EditableConfiguration;
