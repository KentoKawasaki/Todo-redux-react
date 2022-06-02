import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => setText(e.target.value);

  const handleKeyDown = (e) => {
    const trimmedText = text.trim();
    if (e.which === 13 && trimmedText) {
      // dispatch({ type: "todos/todoAdded", payload: trimmedText });

      // Create the thunk function with the thunk function itself
      // const saveNewTodoThunk = saveNewTodo(trimmedText)
      dispatch(saveNewTodo(trimmedText))
      // clear out the text input
      setText("");
    }
  };

  return (
    <header className="header">
      <input
        className="new-todo"
        type="text"
        placeholder="What needs to be done?"
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </header>
    
  );
};

export default Header;
