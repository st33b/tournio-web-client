import classes from './VisibleTournament.module.scss';
import {Placeholder, Card, ListGroup} from "react-bootstrap";
import ConfigItemForm from "./ConfigItemForm";

const EditableConfiguration = ({tournament, editableKeys}) => {
  let content = (
    <Placeholder animation={'glow'}>
      <Placeholder xs={2} />{' '}
      <Placeholder xs={9} />
      <Placeholder xs={2} />{' '}
      <Placeholder xs={8} />
    </Placeholder>
  )
  if (tournament && editableKeys) {
    const items = tournament.config_items.filter(({key}) => editableKeys.includes(key));

    content = (
      <ListGroup>
        {items.map((item) => <ConfigItemForm item={item} key={item.key} editable={true}/>)}
      </ListGroup>
    );
  }

  return (
    <div className={classes.EditableConfiguration}>
      {content}
    </div>
  );
}

export default EditableConfiguration;
