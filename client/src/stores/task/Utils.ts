import { Order, SortTasksBy } from './Reducer';

export const toggleOrderBy = (currentOrder: Order) => (currentOrder === 'asc' ? 'desc' : 'asc');

export const toggleOrderOnSort = (
  currentOrder: Order,
  currentSort: SortTasksBy,
  sort: SortTasksBy,
) => {
  if (currentSort === sort) {
    return toggleOrderBy(currentOrder);
  }
  return 'asc';
};
