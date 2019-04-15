import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import {
  composeWithDevTools,
  devToolsEnhancer
} from "redux-devtools-extension";
import rootReducer from "./reducers/index";
import saga from "./sagas/sagas";
import createSagaMiddleware from "redux-saga";
import App from "./containers/App";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(saga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
