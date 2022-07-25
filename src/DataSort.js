import React from "react";
import style from "./DataSort.module.css";
import { SORT } from "./constants.js";

const DataSort = ({ sortItemOnDate, sort }) => {
  return (
    <div className={style.sorting}>
      <p>
        Sort by Date
        <button
          className={
            sort === SORT.ASC
              ? `${style.sortingActive} ${style.up}`
              : `${style.up}`
          }
          onClick={(sort) => sortItemOnDate(SORT.ASC)}
        ></button>
        <button
          className={style.down}
          onClick={(sort) => sortItemOnDate(SORT.DESC)}
        ></button>
      </p>
    </div>
  );
};

export default DataSort;
