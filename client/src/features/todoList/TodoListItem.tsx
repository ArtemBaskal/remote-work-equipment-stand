import React from 'react';

interface TodoProps {
    completed: boolean,
    text: string,
    onClick: () => any,
}

export default function TodoListItem({ completed, text, onClick }: TodoProps) {
  return (
  // eslint-disable-next-line max-len
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? 'line-through' : 'none',
      }}
    >
      {text}
    </li>
  );
}
