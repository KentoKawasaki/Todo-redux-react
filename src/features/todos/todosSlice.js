import { client } from '../../api/client'

const initialState = []
// const initialState = [
//   { id: 0, text: "Learn React", completed: true },
//   { id: 1, text: "Learn Redux", completed: false, color: "purple" },
//   { id: 2, text: "Build somthing fun!", completed: false, color: "blue" },
// ];
// const initialState = []

// Update the latest id of todos
// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
//   return maxId + 1;
// }

// Use the initialState as a default value.
export default function todosReducer(state = initialState, action) {
  // The reducer normally looks at the action type field to decide what happens.
  switch (action.type) {
    case "todos/todoAdded":
      // Can return just the new todos array - no extra object arount it.
      return [
        ...state,
        // {
        //   id: nextTodoId(state),
        //   text: action.payload,
        //   completed: false,
        // },
        action.payload
      ];

    case "todos/todoToggled":
      return state.map((todo) => {
        if (todo.id !== action.payload) {
          return todo;
        }
        return {
          ...todo,
          completed: !todo.completed,
        };
      });

    case "todos/colorSelected":
      const { color, todoId } = action.payload;
      return state.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        return {
          ...todo,
          color,
        };
      });

    case "todos/todoDeleted":
      return state.filter((todo) => todo.id !== action.payload);

    case "todos/allCompleted":
      return state.map((todo) => {
        return { ...todo, completed: true };
      });

    case "todos/completedCleared":
      return state.filter((todo) => !todo.completed);

    case 'todos/todosLoaded':
      return action.payload

    /* 
     If this reducer doesn't rcognize the action type, or doesn't care about this specific action,
     return the existing state unchanged.
    */
    default:
      return state;
  }
}

// Thunk function
export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')

  const stateBefore = getState()
  console.log('Todos before dispatch: ', stateBefore.todos.length)
  dispatch({ type: 'todos/todosLoaded', payload: response.todos })

  const stateAfter = getState()
  console.log('Todos after dispatch: ', stateAfter.todos.length)
}

// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    // send text value to the server
    const initialTodo = { text }
    console.log('todoSlice/initial', initialTodo)
    const response = await client.post('/fakeApi/todos', {todo: initialTodo})
    console.log('todoSlice/response', response)
    dispatch({ type: 'todos/todoAdded', payload: response.todo})
  }
}