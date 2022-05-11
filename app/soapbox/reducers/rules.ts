import { RULES_FETCH_REQUEST, RULES_FETCH_SUCCESS } from '../actions/rules';

import type { RulesActions } from '../actions/rules';

export type Rule = {
  id: string
  text: string
  subtext: string
  rule_type: 'content' | 'account'
}

type RulesState = {
  items: Rule[],
  isLoading: boolean
}

const initialState: RulesState = {
  items: [],
  isLoading: false,
};

export default function rules(state: RulesState = initialState, action: RulesActions): RulesState {
  switch (action.type) {
    case RULES_FETCH_REQUEST:
      return { ...state, isLoading: true };
    case RULES_FETCH_SUCCESS:
      return { ...state, isLoading: false, items: action.payload };
    default:
      return state;
  }
}
