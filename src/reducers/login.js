import { Map, List } from "immutable";
import { ACCESS_TOKENS, SET_ACCESS_TOKEN } from "../constants/index";

const initialState = Map({
  [ACCESS_TOKENS]: List([
    "access-development-4c9d03ed-08b6-417f-9c0c-d972490568d3",
    "access-development-c5ee827e-1eab-4ea2-957f-53a70998f0a7"
  ])
});

export default function login(state = initialState, action) {
  const { type, payload } = action;
  let newState;

  switch (type) {
    case SET_ACCESS_TOKEN: {
      const { accessToken } = payload;

      newState = state.updateIn([ACCESS_TOKENS], list =>
        list.push(accessToken)
      );
      break;
    }
    default: {
      newState = state;
    }
  }
  return newState;
}

export const accessTokensSelector = state => state.get(ACCESS_TOKENS);
