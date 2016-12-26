import * as Repo from './repos';
import * as Users from './users';
import { normalize } from '../../../../../src';

export const STATE_KEY = 'commits';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case Action.ADD_COMMITS:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

const Action = {
  ADD_COMMITS: 'ADD_COMMITS'
};

export const addCommits = (commits = {}) => ({
  type: Action.ADD_COMMITS,
  payload: commits
});

export const getCommits = ({ page = 0 } = {}) => (dispatch, getState, { api, schema }) => {
  const state = getState();
  const owner = Repo.selectOwner(state);
  const repo = Repo.selectRepo(state);
  return api.repos.getCommits({
    owner,
    repo
  }).then((response) => {
    const data = normalize(response, [ schema.commit ]);
    dispatch(Users.addUsers(data.entities.users));
    dispatch(addCommits(data.entities.commits));
    return response;
  }).catch((error) => {
    console.error(error);
  });
};
