import React from "react";
import style from "./Item.module.css";

const Item = ({
  item,
  checkItem,
  deleteItem,
  editItem,
  onHandleChange,
  cancelChanges,
}) => {
  const date = item.createdAt.slice(0, 10);
  // const currentDate = date.getDate();
  // const currentMonth = date.getMonth();
  // const currentYear = String(date.getFullYear()).slice(2);
  // const strDate = `${currentDate}/${currentMonth}/${currentYear}`;

  return (
    <div className={style.itemOfList} onDoubleClick={() => editItem(item.uuid)}>
      <div className={style.content}>
        <input
          type="checkbox"
          className={style.checkbox}
          defaultChecked={item.done}
          onClick={() => checkItem(item.uuid)}
        />
        {item.edited ? (
          <input
            autoFocus
            className={style.editInput}
            defaultValue={item.name}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim() !== "") {
                onHandleChange("title", e.target.value.trim());
              } else if (e.key === "Escape") {
                cancelChanges(item.uuid);
              }
            }}
          />
        ) : (
          <p>{item.name}</p>
        )}
      </div>
      <div className={style.dateAndDelete}>
        <p className={style.date}>{date}</p>
        <button onClick={() => deleteItem(item.uuid)}></button>
      </div>
    </div>
  );
};

export default Item;
