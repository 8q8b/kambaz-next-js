"use client";
import { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Button, FormControl } from "react-bootstrap";
import { useTodos } from "./todosContext";

function TodoFormContext() {
  const { todo, addTodo, updateTodo, setTodo } = useTodos();
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
      <Button onClick={handleAdd} id="wd-context-add-todo-click">
        Add
      </Button>
      <Button onClick={handleUpdate} id="wd-context-update-todo-click">
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

function TodoItemContext({ todo }: { todo: { id: string; title: string } }) {
  const { deleteTodo, setTodo } = useTodos();
  return (
    <ListGroupItem key={todo.id}>
      <Button onClick={() => deleteTodo(todo.id)} id="wd-context-delete-todo-click">
        Delete
      </Button>
      <Button onClick={() => setTodo(todo)} id="wd-context-edit-todo-click">
        Edit
      </Button>
      {todo.title}
    </ListGroupItem>
  );
}

export default function ReactContextTodoList() {
  const { todos } = useTodos();
  return (
    <div id="wd-context-todo-list">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoFormContext />
        {todos.map((todo) => (
          <TodoItemContext key={todo.id} todo={todo} />
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
