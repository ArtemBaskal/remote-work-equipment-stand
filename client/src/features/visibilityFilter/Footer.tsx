import React from 'react';
import { VisibilityFilter } from 'features/visibilityFilter/visibilityFilterSlice';
import FilterButton from './FilterButton';

// eslint-disable-next-line no-undef
export default function Footer(): JSX.Element {
  return (
    <div>
      <span>Show: </span>
      <FilterButton visibilityFilter={VisibilityFilter.ShowAll} text="All" />
      <FilterButton visibilityFilter={VisibilityFilter.ShowActive} text="Active" />
      <FilterButton visibilityFilter={VisibilityFilter.ShowCompleted} text="Completed" />
    </div>
  );
}
