/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getResult = /* GraphQL */ `
  query GetResult($title: String!, $value: String!) {
    getResult(title: $title, value: $value) {
      id
      label
      title
      description
      author_admins
      current_version
      latest_version
      isPublic
      isPinned
      published_date
      last_modified_date
    }
  }
`;
export const getMaxResults = /* GraphQL */ `
  query GetMaxResults($value: String!) {
    getMaxResults(value: $value) {
      id
      label
      title
      description
      author_admins
      current_version
      latest_version
      isPublic
      isPinned
      published_date
      last_modified_date
    }
  }
`;
export const getMap = /* GraphQL */ `
  query GetMap($title: String!, $value: String!) {
    getMap(title: $title, value: $value) {
      search_title
      maps
    }
  }
`;
export const getGraphInfo = /* GraphQL */ `
  query GetGraphInfo($value: String!) {
    getGraphInfo(value: $value) {
      nodes {
        id
        label
        title
        description
        url
        author
        contributors
        current_version
        latest_version
        isPublic
        isPinned
        published_date
        last_modified_date
      }
      links {
        source
        target
        type
      }
    }
  }
`;
