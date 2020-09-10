import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, AppDispatch } from 'app/store';
import { Todo } from 'features/todoList/types';

const initialState: Todo[] = [];

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    receiveTodos(state, action: PayloadAction<Todo[]>) {
      return action.payload;
    },
    receiveTodo(state, action: PayloadAction<Todo>) {
      state.push(action.payload);
    },
    toggleTodo(state, action: PayloadAction<Todo>) {
      const todo = state.find((_todo) => _todo.id === action.payload.id);

      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});
export const { toggleTodo } = todoSlice.actions;

export const addTodo = (
  text: string,
): AppThunk => async (dispatch: AppDispatch) => {
  const newTodo: Todo = {
    id: Math.random().toString(36).substr(2, 9),
    completed: false,
    text,
  };

  dispatch(todoSlice.actions.receiveTodo(newTodo));
};

export default todoSlice.reducer;
