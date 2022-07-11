import React, { useState } from "react";
import List from "./List";
import style from "./App.module.css";

const App = () => {
  const [items, setItems] = useState([]);

  const [itemsTitle, setitemsTitle] = useState("");

  const addItem = (event) => {
    if (event.key === "Enter" && event.target.value != "") {
      setItems([
        ...items,
        {
          id: Date.now(),
          title: itemsTitle,
          completed: false,
        },
      ]);

      setitemsTitle("");
    }
  };

  return (
    <div className={style.wrapper}>
      <h1>ToDo</h1>

      <input
        type="text"
        value={itemsTitle}
        onChange={(event) => setitemsTitle(event.target.value)}
        onKeyDown={addItem}
        placeholder="I want to..."
      />

      <List items={items} />
    </div>
  );
};

export default App;
