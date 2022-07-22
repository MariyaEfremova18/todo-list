import React, { useEffect, useState } from "react";
import style from "./App.module.css";
import List from "./List";
import DataSort from "./DataSort";
import Filter from "./Filter";
import Pagination from "./Pagination";
import { ITEMS_PER_PAGE, FILTER, SORT, USER_ID } from "./constants.js";
import API from "./api";

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

  // const fetchData = () => {
  //   // if (filter === FILTER.DONE) {
  //   //   setFilterBy("filterBy=done");
  //   // } else if (filter === FILTER.UNDONE) {
  //   //   setFilterBy("filterBy=undone");
  //   // }

  //   // if (sort === SORT.ASC) {
  //   //   setSort("order=asc");
  //   // } else if (filter === FILTER.UNDONE) {
  //   //   setSort("order=desc");
  //   // }

  //   // const requestUrl = `API/tasks/${USER_ID}?/${filterBy}&${order}&pp=${ITEMS_PER_PAGE}&page=${currentPage}`;
  //   const response = API.get(
  //     `tasks/${USER_ID}?/filterBy=done&order=desc&pp=5&page=1`
  //   );
  //   // setItems(response.data.tasks);
  // };

  // fetchData();

  useEffect(() => {
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE;
    const endItem = ITEMS_PER_PAGE * currentPage;

    async function fetchData() {
      // const requestUrl = `API/tasks/${USER_ID}?/${filterBy}&${order}&pp=${ITEMS_PER_PAGE}&page=${currentPage}`;

      const response = await API.get(
        `tasks/${USER_ID}?filterBy=done&order=desc&pp=5&page=1`
      );
      setItems(response.data.tasks);
    }
    fetchData();

    //   const todos = items
    //     .filter((item) => {
    //       switch (filter) {
    //         case FILTER.ALL:
    //           return item;
    //         case FILTER.DONE:
    //           return item.done === true;
    //         case FILTER.UNDONE:
    //           return item.done === false;
    //       }
    //     })
    //     .sort((a, b) => {
    //       if (sort === SORT.ASC) {
    //         return a.createdAt - b.createdAt;
    //       } else if (sort === SORT.DESC) {
    //         return b.createdAt - a.createdAt;
    //       }
    //     })
    //     .slice(startItem, endItem);
    //   setFilteredTasks(todos);
  }, []);

  const addItem = async (event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      await API.post(`/task/${USER_ID}`, {
        name: itemsTitle,
      });
      setItemsTitle("");
    }
  };

  const checkItem = async (uuid) => {
    const checkedItems = items.map((i) => {
      if (i.uuid === uuid) {
        const element = { ...i };
        element.done = !i.done;
        const doneStatus = element.done;
        API.patch(`/task/${USER_ID}/${uuid}`, { done: doneStatus });
        return element;
      }
      return i;
    });
    setItems(checkedItems);
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

  const handleFilterItem = (value) => {
    setCurrentPage(1);
    setFilter(value);
  };

  const sortItemOnDate = (value) => setSort(value);

  // const editItem = (uuid) => {
  //   const editedItem = items.map((item) => {
  //     if (item.uuid === uuid) {
  //       const element = { ...item };
  //       element.edited = !item.edited;
  //       return element;
  //     }
  //     return item;
  //   });
  //   setItems(editedItem);
  // };

  // const onHandleChange = (id) => {
  //   return (key, value) =>
  //     setItems((prev) =>
  //       prev.map((todo) => {
  //         if (todo.id === id) {
  //           return { ...todo, [key]: value, edited: false };
  //         }
  //         return todo;
  //       })
  //     );
  // };

  // const cancelChanges = (id) => {
  //   const unchangedItems = items.map((item) => {
  //     if (item.id === id) {
  //       return { ...item, edited: false };
  //     }
  //     return item;
  //   });
  //   setItems(unchangedItems);
  // };

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
