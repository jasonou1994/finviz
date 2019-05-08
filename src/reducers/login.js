import { Map, List } from "immutable";
import { ACCESS_TOKENS, SET_ACCESS_TOKEN } from "../constants/index";

const initialState = Map({
  [ACCESS_TOKENS]: List([
    "access-development-b5ba0e81-997a-4883-bc93-4f660f6d0a84",
    "access-development-80d68117-a3bc-40e6-a9d1-400a14f815fc"
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
