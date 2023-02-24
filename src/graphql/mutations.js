/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMindMap = /* GraphQL */ `
  mutation CreateMindMap(
    $vertex: String
    $source_vertex: String
    $title: String
    $description: String
    $url: String
    $author: String
    $contributors: [String]
    $current_version: Int
    $published_date: AWSDateTime
    $last_modified_date: AWSDateTime
  ) {
    createMindMap(
      vertex: $vertex
      source_vertex: $source_vertex
      title: $title
      description: $description
      url: $url
      author: $author
      contributors: $contributors
      current_version: $current_version
      published_date: $published_date
      last_modified_date: $last_modified_date
    ) {
      result
    }
  }
`;
