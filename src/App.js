import React, { useEffect, useState } from "react";
import style from "./App.module.css";
import List from "./List";
import DataSort from "./DataSort";
import Filter from "./Filter";
import Pagination from "./Pagination";
import { ITEMS_PER_PAGE, FILTER, SORT, USER_ID } from "./constants.js";
import API from "./api";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [tasks, setTasks] = useState(items);
  const [itemsTitle, setItemsTitle] = useState("");
  const [filter, setFilter] = useState(FILTER.ALL);
  const [filterBy, setFilterBy] = useState("filterBy=done");
  const [sort, setSort] = useState(SORT.ASC);
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    // const startItem = (currentPage - 1) * ITEMS_PER_PAGE;
    // const endItem = ITEMS_PER_PAGE * currentPage;
    API.get(`tasks/${USER_ID}`).then((response) =>
      setItems(response.data.tasks)
    );
  }, []);

  const addItem = async (event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      await API.post(`/task/${USER_ID}`, {
        name: itemsTitle,
      });
      setItemsTitle("");
    }
  };

  const checkItem = (uuid) => {
    items.forEach((i) => {
      if (i.uuid === uuid) {
        const element = { ...i };
        element.done = !i.done;
        const doneStatus = element.done;
        API.patch(`/task/${USER_ID}/${uuid}`, { done: doneStatus });
      }
    });
  };

  const deleteItem = async (uuid) => {
    await API.delete(`/task/${USER_ID}/${uuid}`);

    const remainingItems = items.filter((item) => item.uuid !== uuid);

    const pageNumber = items.length % 5 === 1 ? currentPage - 1 : currentPage;

    setCurrentPage(pageNumber);
    setItems(remainingItems);
  };

  const changeCurrentPage = (value) => {
    setCurrentPage(value);
  };

  const nextPage = () => setCurrentPage((prev) => prev + 1);

  const prevPage = () => setCurrentPage((prev) => prev - 1);

  const handleFilterItem = (filter) => {
    setCurrentPage(1);
    setFilter(filter);

    API({
      method: "get",
      url: `/tasks/${USER_ID}`,
      params: {
        filterBy: `${filter}`,
        order: `${sort}`,
        pp: `${ITEMS_PER_PAGE}`,
        page: `${currentPage}`,
      },
    }).then((response) => setItems(response.data.tasks));
  };

  const sortItemOnDate = (sort) => {
    setSort(sort);

    API({
      method: "get",
      url: `/tasks/${USER_ID}`,
      params: {
        filterBy: `${filter}`,
        order: `${sort}`,
        pp: `${ITEMS_PER_PAGE}`,
        page: `${currentPage}`,
      },
    }).then((response) => setItems(response.data.tasks));
  };

  return (
    <div className={style.wrapper}>
      <h1>ToDo</h1>

      <input
        className={style.inputItem}
        type="text"
        value={itemsTitle}
        onChange={(event) => setItemsTitle(event.target.value)}
        onKeyDown={addItem}
        placeholder="I want to..."
      />

      {items.length >= 1 ? (
        <DataSort sort={sort} sortItemOnDate={sortItemOnDate} />
      ) : (
        ""
      )}

      <List
        // onHandleChange={onHandleChange}
        filteredTasks={items}
        deleteItem={deleteItem}
        checkItem={checkItem}
        // editItem={editItem}
        // cancelChanges={cancelChanges}
      />

      {items.length >= 1 ? (
        <Filter filter={filter} handleFilterItem={handleFilterItem} />
      ) : (
        ""
      )}

      {items.length > ITEMS_PER_PAGE ? (
        <Pagination
          currentPage={currentPage}
          items={items}
          changeCurrentPage={changeCurrentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
