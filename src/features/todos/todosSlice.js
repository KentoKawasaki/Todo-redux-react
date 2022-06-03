import { client } from '../../api/client'
import { createSelector } from 'reselect'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle',
  entities: [],
}
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
    case 'todos/todoAdded':
      // Can return just the new todos array - no extra object arount it.
      return {
        ...state,
        // {
        //   id: nextTodoId(state),
        //   text: action.payload,
        //   completed: false,
        // },
        entities: [...state.entities, action.payload],
      }

    case 'todos/todoToggled':
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id !== action.payload) {
            return todo
          }
          return {
            ...todo,
            completed: !todo.completed,
          }
        }),
      }

    case 'todos/colorSelected':
      const { color, todoId } = action.payload
      return {
        ...state,
        entities: state.entities.map((todo) => {
          if (todo.id !== todoId) {
            return todo
          }

          return {
            ...todo,
            color,
          }
        })
      }

    case 'todos/todoDeleted':
      return {
        ...state,
        entities: state.entities.filter((todo) => todo.id !== action.payload)
      }

    case 'todos/allCompleted':
      return {
        ...state,
        entities: state.entities.map((todo) => {
          return {...todo, completed: true}
        })
      }

    case 'todos/completedCleared':
      return {
        ...state,
        entities: state.entities.filter((todo) => !todo.completed)
      }

    case 'todos/todosLoading':
      return {
        ...state,
        status: 'loading',
      }
    case 'todos/todosLoaded':
      return {
        ...state,
        status: 'idle',
        entities: action.payload,
      }

    /* 
     If this reducer doesn't rcognize the action type, or doesn't care about this specific action,
     return the existing state unchanged.
    */
    default:
      return state
  }
}

// Action Creators
export const todoAdded = (todo) => ({type: 'todos/todoAdded', payload: todo})

export const todoToggled = (todoId) => ({
  type: 'todos/todoToggled',
  payload: todoId,
})

export const todoColorSelected = (todoId, color) => ({
  type: 'todos/colorSelected',
  payload: { todoId, color}
})

export const todoDeleted = (todoId) => ({
  type: 'todos/todoDeleted',
  payload: todoId,
})

export const allTodosCompleted = () => ({type: 'todos/allCompleted'})

export const completedTodosCleared = () => ({
  type: 'todos/completedCleared'
})

export const todosLoading = () => ({type: 'todos/todosLoading'})

export const todosLoaded = (todos) => ({
    type: 'todos/todosLoaded',
    payload: todos,
  })


// Memorized Selectors
export const selectTodos = (state) => state.todos.entities

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find((todo) => todo.id === todoId)
}
export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTodos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (todos) => todos.map((todo) => todo.id)
)

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector : current status filter
  (state) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      console.log('todoSlice/filterselector/if', status)
      console.log(todos)
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filterd
    return todos.filter((todo) => {
      console.log('todoSlice/filterselector', status)
      console.log('todoSlice/filterselector/todo', todo)
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memorized selector as an iniput
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
)

// Thunk action creator
export const fetchTodos = () => async dispatch => {
  dispatch(todosLoading())
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}
// export function fetchTodos() {
//   // Thunk function
//   return async function fetchTodosThunk(dispatch, getState) {
//     const response = await client.get('/fakeApi/todos')

//     // const stateBefore = getState()
//     // console.log('Todos before dispatch: ', stateBefore.todos.length)
//     // dispatch({ type: 'todos/todosLoaded', payload: response.todos })

//     dispatch(todosLoaded(response.todos))

//     // const stateAfter = getState()
//     // console.log('Todos after dispatch: ', stateAfter.todos.length)
//   }
// }


// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    // send text value to the server
    const initialTodo = { text }
    console.log('todoSlice/initial', initialTodo)
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    console.log('todoSlice/response', response)
    // dispatch({ type: 'todos/todoAdded', payload: response.todo })
    dispatch(todoAdded(response.todo))
  }
}
