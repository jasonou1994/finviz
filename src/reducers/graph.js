import { Map } from "immutable";
import moment from "moment";
import {
  GRAPH_FIDELITY,
  SET_GRAPH_FIDELITY,
  START_DATE,
  END_DATE,
  SET_START_DATE,
  SET_END_DATE
} from "../constants/index";

const initialState = Map({
  [GRAPH_FIDELITY]: 7,
  [START_DATE]: moment()
    .subtract(1, "year")
    .format("YYYY-MM-DD"),
  [END_DATE]: moment().format("YYYY-MM-DD")
});

export default function graph(state = initialState, action) {
  const { type, payload } = action;
  let newState;

  switch (type) {
    case SET_GRAPH_FIDELITY: {
      const { graphFidelity } = payload;

      newState = state.setIn([GRAPH_FIDELITY], Number(graphFidelity));

      break;
    }

    case SET_START_DATE: {
      const { startDate } = payload;

      newState = state.setIn([START_DATE], startDate);

      break;
    }
    case SET_END_DATE: {
      const { endDate } = payload;

      newState = state.setIn([END_DATE], endDate);

      break;
    }

    default: {
      newState = state;
    }
  }
  return newState;
}

export const graphFidelitySelector = state => state.get(GRAPH_FIDELITY);
