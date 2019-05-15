import {
  SET_GRAPH_FIDELITY,
  SET_START_DATE,
  SET_END_DATE
} from "../constants/index";

export const setGraphFidelity = fidelity => ({
  type: SET_GRAPH_FIDELITY,
  payload: fidelity
});

export const setStartDate = ({ startDate }) => ({
  type: SET_START_DATE,
  payload: { startDate }
});

export const setEndDate = ({ endDate }) => ({
  type: SET_END_DATE,
  payload: { endDate }
});
