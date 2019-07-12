import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_MY_TODOS = gql`
  query getMyTodos {
    todos(
      where: { is_public: { _eq: false } }
      order_by: { created_at: desc }
    ) {
      id
      title
      created_at
      is_completed
    }
  }
`;

type Todo = {
  id: number;
  title: string;
  is_completed: boolean;
  created_at: Date;
};

interface Data {
  todos: Array<Todo>
}

const TodoList = () => {
  return (
    <Query<Data> query={GET_MY_TODOS}>
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
