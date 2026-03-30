"use client";
import React, { useState, useEffect } from "react";
import * as client from "./client";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";
import { FormControl } from "react-bootstrap";

export default function WorkingWithArraysAsynchronously() {
    const [todos, setTodos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchTodos = async () => {
        const todos = await client.fetchTodos();
        setTodos(todos);
    };
    const removeTodo = async (todo: any) => {
        const updatedTodos = await client.removeTodo(todo);
        setTodos(updatedTodos);
    };
    const createNewTodo = async () => {
        const todos = await client.createNewTodo();
        setTodos(todos);
    };
    const postNewTodo = async () => {
        const newTodo = await client.postNewTodo({
            title: "New Posted Todo",
            completed: false,
        });
        setTodos((prev) => [...prev, newTodo]);
    };
    const deleteTodo = async (todo: any) => {
        try {
            await client.deleteTodo(todo);
            setTodos((prev) => prev.filter((t) => t.id !== todo.id));
            setErrorMessage(null);
        } catch (error: any) {
            console.log(error);
            setErrorMessage(
                error.response?.data?.message ?? "Error deleting todo"
            );
        }
    };
    const editTodo = (todo: any) => {
        const updatedTodos = todos.map((t) =>
            t.id === todo.id ? { ...todo, editing: true } : t
        );
        setTodos(updatedTodos);
    };
    const updateTodo = async (todo: any) => {
        try {
            await client.updateTodo(todo);
            setTodos((prev) =>
                prev.map((t) => (t.id === todo.id ? todo : t))
            );
            setErrorMessage(null);
        } catch (error: any) {
            console.log(error);
            setErrorMessage(
                error.response?.data?.message ?? "Error updating todo"
            );
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);
    return (
        <div id="wd-asynchronous-arrays">
            <h3>Working with Arrays Asynchronously</h3>
            {errorMessage && (
                <div className="alert alert-danger mb-2">{errorMessage}</div>
            )}
            <h4>
                Todos
                <FaPlusCircle
                    onClick={createNewTodo}
                    className="text-success float-end fs-3"
                />
                <FaPlusCircle
                    onClick={postNewTodo}
                    className="text-primary float-end fs-3 me-3"
                    id="wd-post-todo"
                />
                <TiDelete
                    onClick={() => todos[0] && deleteTodo(todos[0])}
                    className="text-danger float-end me-2 fs-3"
                    id="wd-delete-todo"
                />
            </h4>
            <ListGroup>
                {todos.map((todo) => (
                    <ListGroupItem key={todo.id}>
                        <FaPencil
                            onClick={() => editTodo(todo)}
                            className="text-primary float-end me-2 mt-1"
                        />

                        <FaTrash
                            onClick={() => removeTodo(todo)}
                            className="text-danger float-end mt-1"
                            id="wd-remove-todo"
                        />

                        <input
                            type="checkbox"
                            className="form-check-input me-2"
                            defaultChecked={todo.completed}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateTodo({
                                    ...todo,
                                    completed: e.target.checked,
                                })
                            }
                        />
                        {!todo.editing ? (
                            <span
                                style={{
                                    textDecoration: todo.completed
                                        ? "line-through"
                                        : "none",
                                }}
                            >
                                {todo.title}
                            </span>
                        ) : (
                            <FormControl
                                className="w-50 float-start"
                                defaultValue={todo.title}
                                onKeyDown={(
                                    e: React.KeyboardEvent<HTMLInputElement>
                                ) => {
                                    if (e.key === "Enter") {
                                        updateTodo({
                                            ...todo,
                                            editing: false,
                                        });
                                    }
                                }}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    updateTodo({
                                        ...todo,
                                        title: e.target.value,
                                    })
                                }
                            />
                        )}
                    </ListGroupItem>
                ))}
            </ListGroup>{" "}
            <hr />
        </div>
    );
}
