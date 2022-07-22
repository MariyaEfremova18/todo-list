import React from "react";
import Item from "./Item";
import style from "./List.module.css";

const List = ({
  onHandleChange,
  filteredTasks,
  deleteItem,
  checkItem,
  editItem,
  cancelChanges,
}) => {
  return (
    <ul className={style.list}>
      {filteredTasks.map((item) => (
        <Item
          // onHandleChange={onHandleChange(item.id)}
          key={item.uuid}
          deleteItem={deleteItem}
          item={item}
          checkItem={checkItem}
          // editItem={editItem}
          // cancelChanges={cancelChanges}
        />
      ))}
    </ul>
  );
};

export default List;
