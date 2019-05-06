import { Map } from "immutable";
import {
  SELECTED_TRANSACTION_KEY,
  SET_SELECTED_TRANSACTION_KEY
} from "../constants/index";

const initialState = Map({
  [SELECTED_TRANSACTION_KEY]: ""
});

export default function grid(state = initialState, action) {
  const { type, payload } = action;
  let newState;

  switch (type) {
    case SET_SELECTED_TRANSACTION_KEY: {
      const { key } = payload;

      newState = state.setIn([SELECTED_TRANSACTION_KEY], key);

      break;
    }
    default: {
      newState = state;
    }
  }
  return newState;
}

export const selectedTransactionKeySelector = state =>
  state.get(SELECTED_TRANSACTION_KEY);
