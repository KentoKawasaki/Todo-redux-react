import React from "react";
import { useSelector } from "react-redux";
// import { useSelector, shallowEqual } from "react-redux";

// import { selectTodoIds, } from './todosSlice'
import { selectFilteredTodoIds } from './todosSlice'

import TodoListItem from "./TodoListItem";

// const selectTodoIds = state => state.todos.map(todo => todo.id)
const TodoList = () => {
  // const todos = useSelector((state) => state.todos);
  // const todoIds = useSelector(selectTodoIds, shallowEqual)

  const todoIds = useSelector(selectFilteredTodoIds)
  const loadingStatus = useSelector(state => state.todos.status)

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />;
  });

  return <ul className="todo-list">{renderedListItems}</ul>;
};

export default TodoList;
