"use client";
import { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Button, FormControl } from "react-bootstrap";
import { useTodoStore } from "./useTodoStore";

function TodoFormZustand() {
  const todo = useTodoStore((state) => state.todo);
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const setTodo = useTodoStore((state) => state.setTodo);
  const [title, setTitle] = useState(typeof todo?.title === "string" ? todo.title : "");

  useEffect(() => {
    setTitle(typeof todo?.title === "string" ? todo.title : "");
  }, [todo?.title]);

  const handleAdd = () => {
    addTodo({ title });
    setTitle("");
  };

  const handleUpdate = () => {
    if (todo?.id) {
      updateTodo({ id: todo.id, title });
      setTitle("");
    }
  };

  return (
    <ListGroupItem>
      <Button onClick={handleAdd} id="wd-zustand-add-todo-click">
        Add
      </Button>
      <Button onClick={handleUpdate} id="wd-zustand-update-todo-click">
        Update
      </Button>
      <FormControl
        value={title}
        onChange={(e) => {
          const v = e.target.value;
          setTitle(v);
          setTodo({ ...todo, title: v });
        }}
      />
    </ListGroupItem>
  );
}

function TodoItemZustand({ todo }: { todo: { id: string; title: string } }) {
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const setTodo = useTodoStore((state) => state.setTodo);
  return (
    <ListGroupItem key={todo.id}>
      <Button onClick={() => deleteTodo(todo.id)} id="wd-zustand-delete-todo-click">
        Delete
      </Button>
      <Button onClick={() => setTodo(todo)} id="wd-zustand-edit-todo-click">
        Edit
      </Button>
      {todo.title}
    </ListGroupItem>
  );
}

export default function ZustandTodoList() {
  const todos = useTodoStore((state) => state.todos);
  return (
    <div id="wd-zustand-todo-list">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoFormZustand />
        {todos.map((todo) => (
          <TodoItemZustand key={todo.id} todo={todo} />
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
