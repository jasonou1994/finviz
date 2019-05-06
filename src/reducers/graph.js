import { Map } from "immutable";
import { GRAPH_FIDELITY, SET_GRAPH_FIDELITY } from "../constants/index";

const initialState = Map({
  [GRAPH_FIDELITY]: 7
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
    default: {
      newState = state;
    }
  }
  return newState;
}

export const graphFidelitySelector = state => state.get(GRAPH_FIDELITY);
