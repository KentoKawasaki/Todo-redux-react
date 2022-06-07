import { configureStore} from '@reduxjs/toolkit'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

// import { createStore, compose } from 'redux';
// import { createStore, applyMiddleware } from "redux";
// import thunkMiddleware from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'
// import rootReducer from "./reducer";
// import {
//   sayHiOnDispatch,
//   includeMeaningOfLife,
// } from "./exampleAddons/enhancers";
// import { print1, print2, print3} from "./exampleAddons/middleware";
// import {
//   loggerMiddleware,
//   alwaysReturnHelloMiddleware,
//   delayedMessageMiddleware,
// } from "./exampleAddons/middleware";

// let preloadedState;
// const persistedTodosString = localStorage.getItem("todos");

// if (persistedTodosString) {
//   preloadedState = {
//     todos: JSON.parse(persistedTodosString),
//   };
// }

// const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife);
// const middlewareEnhancer = applyMiddleware(print1, print2, print3);
// const middlewareEnhancer = applyMiddleware(
//   loggerMiddleware,
//   alwaysReturnHelloMiddleware,
//   delayedMessageMiddleware
// );

// const composedEnhancer = composeWithDevTools(
//     applyMiddleware(print1, print2, print3)
// )

// const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
// const store = createStore(rootReducer, composedEnhancer);

const store = configureStore({
    reducer: {
        // Define a top-level state field named `todos`, handled by `todosReducer`
        todos: todosReducer,
        filters: filtersReducer
    }
})
export default store;
