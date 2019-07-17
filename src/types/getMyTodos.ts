/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMyTodos
// ====================================================

export interface getMyTodos_todos {
  __typename: "todos";
  id: number;
  title: string;
  created_at: any;
  is_completed: boolean;
}

export interface getMyTodos {
  /**
   * fetch data from the table: "todos"
   */
  todos: getMyTodos_todos[];
}
