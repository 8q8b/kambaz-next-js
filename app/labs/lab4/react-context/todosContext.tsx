"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export interface Todo {
  id: string;
  title: string;
}

interface TodosContextState {
  todos: Todo[];
  todo: Partial<Todo>;
  addTodo: (todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Partial<Todo>) => void;
}

const TodosContext = createContext<TodosContextState | undefined>(undefined);

const initialTodos: Todo[] = [
  { id: "1", title: "Learn React" },
  { id: "2", title: "Learn Node" },
];

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [todo, setTodoState] = useState<Partial<Todo>>({ title: "" });

  const addTodo = useCallback((payload: Partial<Todo>) => {
    setTodos((prev) => [
      ...prev,
      {
        ...payload,
        id: new Date().getTime().toString(),
        title: payload.title ?? "",
      } as Todo,
    ]);
    setTodoState({ title: "" });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateTodo = useCallback((payload: Todo) => {
    setTodos((prev) =>
      prev.map((item) => (item.id === payload.id ? payload : item))
    );
    setTodoState({ title: "" });
  }, []);

  const setTodo = useCallback((payload: Partial<Todo>) => {
    setTodoState(payload);
  }, []);

  const value: TodosContextState = {
    todos,
    todo,
    addTodo,
    deleteTodo,
    updateTodo,
    setTodo,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodosContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodosProvider");
  }
  return context;
}
