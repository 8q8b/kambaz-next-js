import HelloRedux from "./hello";
import ReduxProvider from "./ReduxProvider";
import CounterRedux from "./CounterRedux";
import AddRedux from "./AddRedux";
import TodoList from "./todos/TodoList";
export default function ReduxExamples() {
  return (
    <ReduxProvider>
      <div>
        <h2>Redux Examples</h2>
        <HelloRedux />
        <CounterRedux />
        <AddRedux />
        <TodoList />
      </div>
    </ReduxProvider>
  );
}
   