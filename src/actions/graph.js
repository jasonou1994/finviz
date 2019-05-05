import { SET_GRAPH_FIDELITY } from "../constants/index";

export const setGraphFidelity = fidelity => ({
  type: SET_GRAPH_FIDELITY,
  payload: fidelity
});
