import { Map, List } from "immutable";
import {
  SET_TRANSACTIONS,
  SET_ACCOUNTS,
  TRANSACTIONS,
  ACCOUNTS,
  RESET_TRANSACTIONS
} from "../constants/index";

const initialState = Map({
  transactions: List(),
  accounts: List()
});

export default function transactions(state = initialState, action) {
  const { type, payload } = action;
  let newState;

  switch (type) {
    case SET_TRANSACTIONS: {
      newState = state.updateIn([TRANSACTIONS], list => list.push(...payload));
      break;
    }
    case SET_ACCOUNTS: {
      newState = state.setIn([ACCOUNTS], List(payload));
      break;
    }
    case RESET_TRANSACTIONS: {
      console.log("rest");
      newState = state.set(TRANSACTIONS, initialState.get(TRANSACTIONS));
      console.log(newState);
    }
    default: {
      newState = state;
    }
  }

  return newState;
}
