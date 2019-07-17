import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Todos, TodosVariables } from './types/Todos';
import { order_by } from './types/graphql-global-types';

const todosQuery = gql`
  query Todos($order_by:order_by=desc) {
    todos(
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
  const [sort, setSort] = React.useState(order_by.desc);
  return (
    <>
    <div onClick={()=> setSort(sort === order_by.asc ? order_by.desc : order_by.asc)}>{sort}</div>
    <Query<Todos, TodosVariables> query={todosQuery} variables={{order_by: sort}}>
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
    </>
  );
};

export default TodoList;
