/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { order_by } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: Todos
// ====================================================

export interface Todos_todos {
  __typename: "todos";
  id: number;
  title: string;
  created_at: any;
  is_completed: boolean;
}

export interface Todos {
  /**
   * fetch data from the table: "todos"
   */
  todos: Todos_todos[];
}

export interface TodosVariables {
  order_by?: order_by | null;
}
