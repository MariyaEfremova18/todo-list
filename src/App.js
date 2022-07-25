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
  const [itemsTitle, setItemsTitle] = useState("");
  const [filter, setFilter] = useState(FILTER.ALL);
  const [sort, setSort] = useState(SORT.ASC);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsCount, setItemsCount] = useState(0);

  useEffect(() => {
    API({
      method: "get",
      url: `/tasks/${USER_ID}`,
      params: {
        filterBy: `${filter}`,
        order: `${sort}`,
        pp: `${ITEMS_PER_PAGE}`,
        page: `${currentPage}`,
      },
    }).then((response) => {
      setItems(response.data.tasks);
      setItemsCount(response.data.count);
    });
  }, [currentPage, sort, filter, itemsTitle]);

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

  const changeCurrentPage = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const nextPage = (value) => setCurrentPage(value);

  const prevPage = (value) => setCurrentPage(value);

  const handleFilterItem = (filter) => {
    setCurrentPage(1);
    setFilter(filter);
  };

  const sortItemOnDate = (sort) => {
    setSort(sort);
    setCurrentPage(1);
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

      {itemsCount >= 1 ? (
        <DataSort sort={sort} sortItemOnDate={sortItemOnDate} />
      ) : (
        ""
      )}

      <List
        // onHandleChange={onHandleChange}
        items={items}
        deleteItem={deleteItem}
        checkItem={checkItem}
        // editItem={editItem}
        // cancelChanges={cancelChanges}
      />

      {itemsCount >= 1 ? (
        <Filter filter={filter} handleFilterItem={handleFilterItem} />
      ) : (
        ""
      )}

      {itemsCount > ITEMS_PER_PAGE ? (
        <Pagination
          currentPage={currentPage}
          items={items}
          changeCurrentPage={changeCurrentPage}
          nextPage={nextPage}
          prevPage={prevPage}
          itemsCount={itemsCount}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
