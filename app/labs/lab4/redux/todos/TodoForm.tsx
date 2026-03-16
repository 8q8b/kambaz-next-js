"use client";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";
export default function TodoForm(
    ) {
      const todosReducerState = useSelector((state: RootState) => state.todosReducer);
      const todo = todosReducerState?.todo ?? { title: "" };
      const dispatch = useDispatch();
      const title = typeof todo?.title === "string" ? todo.title : "";
      return (
        <ListGroupItem>
          <Button onClick={() => dispatch(addTodo(todo))}
                  id="wd-add-todo-click"> Add </Button>
          <Button onClick={() => dispatch(updateTodo(todo))}
                  id="wd-update-todo-click"> Update </Button>
          <FormControl
            value={title}
            onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
          />
        </ListGroupItem>
    );}
    