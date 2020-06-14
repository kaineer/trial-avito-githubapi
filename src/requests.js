// src/requests.js

import {buildQuery} from './utils';

const buildAPIUrl = (path, params) => {
  const host = 'https://api.github.com';

  return host.concat(
    [path, buildQuery(params)].filter(x => x).join('?')
  );
};

const requestAuthorizedData = (path, params = {}) => {
  const headers = {
    'Authorization': 'Token 9f3f4f144b7cb35a49fb55f79a900db9fa2f1be7'
  };

  const url = buildAPIUrl(path, params);

  return fetch(url, {
    method: 'GET',
    headers
  })
  .then(response => response.json());
};

export const searchRepositories = (term, page = 1) => (
  requestAuthorizedData('/search/repositories', {
    q: term,
    per_page: 10,
    page,
    sort: 'stars',
    order: 'desc'
  })
);

export const getRepository = (fullName) => (
  requestAuthorizedData('/repos/'.concat(fullName), {})
);

export const getLanguages = (fullName) => (
  requestAuthorizedData('/repos/'.concat(fullName, '/languages'))
);

export const getContributors = (fullName) => (
  requestAuthorizedData('/repos/'.concat(fullName, '/contributors'))
);
