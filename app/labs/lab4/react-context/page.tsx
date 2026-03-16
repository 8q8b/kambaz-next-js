"use client";
import { CounterProvider } from "./counter/counter";
import CounterContext from "./counter";
import { TodosProvider } from "./todosContext";
import ReactContextTodoList from "./ReactContextTodoList";

export default function ReactContextExamples() {
  return (
    <div>
      <h1>React Context Examples</h1>
      <CounterProvider>
        <CounterContext />
      </CounterProvider>
      <TodosProvider>
        <ReactContextTodoList />
      </TodosProvider>
    </div>
  );
}

