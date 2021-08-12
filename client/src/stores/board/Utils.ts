import { Order, SortTasksBy } from './Reducer';

export const toggleOrderBy = (currentOrder: Order) => {
  return currentOrder === 'asc' ? 'desc' : 'asc';
};

export const toggleOrderOnSort = (
  currentOrder: Order,
  currentSort: SortTasksBy,
  sort: SortTasksBy,
) => {
  if (currentSort === sort) {
    return toggleOrderBy(currentOrder);
  } else {
    return 'asc';
  }
};
