type OrderBy<T> = {
  [K in keyof T]: 'asc' | 'desc';
};

export interface Pagination<T> {
  page: number;
  show: number;
  orderBy: OrderBy<T>[];
}

export interface FindOneOption<T> {
  key: keyof T;
  value: keyof typeof T;
}
