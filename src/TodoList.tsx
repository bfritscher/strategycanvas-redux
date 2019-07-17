import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Todos, TodosVariables } from './types/Todos';

const todosQuery = gql`
  query Todos($order_by:order_by=desc) {
    todos(
      where: { is_public: { _eq: false } }
      order_by: { created_at: $order_by }
    ) {
      id
      title
      created_at
      is_completed
    }
  }
`;

const TodoList = () => {
  return (
    <Query<Todos, TodosVariables> query={todosQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div>Loading...</div>;
        }
        if (error) {
          return <div>Error!</div>;
        }
        if (data) {
          return (
            <ul>
              {data.todos.map((note) => (
                <li key={note.id}>{note.title}</li>
              ))}
            </ul>
          );
        }
      }}
    </Query>
  );
};

export default TodoList;
