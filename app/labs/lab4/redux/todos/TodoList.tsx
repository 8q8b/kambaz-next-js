"use client";
import React from "react";
import { ListGroup } from "react-bootstrap";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
export default function TodoList() {
  const todosReducerState = useSelector((state: RootState) => state.todosReducer);
  const todos = todosReducerState?.todos ?? [];
  return (
    <div id="wd-todo-list-redux">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ListGroup>
      <hr/>
    </div>
);}
