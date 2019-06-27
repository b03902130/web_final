import React from "react";
import x from "./x.png";

const Todo = ({ todo: { complete, text }, toggleComplete, onDelete }) => (
  <li className="todo-app__item">
    <div onClick={toggleComplete} className="todo-app__checkbox">
      <label
        style={{
          background: !complete ? "rgba(99, 99, 99, 0.698)" : "#26ca299b"
        }}
      />
    </div>
    <h1
      className="todo-app__item-detail"
      style={{
        textDecoration: complete ? "line-through" : "",
        opacity: complete ? 0.5 : 1
      }}
    >
      {text}
    </h1>
    <img src={x} alt="X" className="todo-app__item-x" onClick={onDelete} />
  </li>
);

export default Todo;
