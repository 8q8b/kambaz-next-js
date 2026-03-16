import { create } from "zustand";

export interface Todo {
  id: string;
  title: string;
}

interface TodoState {
  todos: Todo[];
  todo: Partial<Todo>;
  addTodo: (payload: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (payload: Todo) => void;
  setTodo: (payload: Partial<Todo>) => void;
}

const initialTodos: Todo[] = [
  { id: "1", title: "Learn React" },
  { id: "2", title: "Learn Node" },
];

export const useTodoStore = create<TodoState>((set) => ({
  todos: initialTodos,
  todo: { title: "" },
  addTodo: (payload) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          ...payload,
          id: new Date().getTime().toString(),
          title: payload.title ?? "",
        } as Todo,
      ],
      todo: { title: "" },
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((item) => item.id !== id),
    })),
  updateTodo: (payload) =>
    set((state) => ({
      todos: state.todos.map((item) =>
        item.id === payload.id ? payload : item
      ),
      todo: { title: "" },
    })),
  setTodo: (payload) => set({ todo: payload }),
}));
