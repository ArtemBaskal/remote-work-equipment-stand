import React from 'react';
import { RootState } from 'app/rootReducer';
import { useSelector, useDispatch } from 'react-redux';
import { VisibilityFilter } from 'features/visibilityFilter/visibilityFilterSlice';
import { toggleTodo } from './todoSlice';
import TodoListItem from './TodoListItem';
import { Todo } from './types';

const getVisibleTodos = (todos: Todo[], filter: VisibilityFilter) => {
  switch (filter) {
    case VisibilityFilter.ShowAll:
      return todos;
    case VisibilityFilter.ShowCompleted:
      return todos.filter((t) => t.completed);
    case VisibilityFilter.ShowActive:
      return todos.filter((t) => !t.completed);
    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

export default function TodoList(): Element {
  const dispatch = useDispatch();

  const todos = useSelector(
    (state: RootState) => getVisibleTodos(state.todos, state.visibilityFilter),
  );

  return (
    <ul>
      {todos.map((todo) => (
        <TodoListItem key={todo.id} {...todo} onClick={() => dispatch(toggleTodo(todo))} />

      ))}
    </ul>
  );
}
