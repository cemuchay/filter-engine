// src/index.ts

export type Operator = 'equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | string;

export interface FilterOptions {
  caseSensitive?: boolean;
}

export type FilterRule<T> = {
  field: keyof T;
  operator: Operator;
  value: any;
  options?: FilterOptions;
};

export type FilterGroup<T> = {
  AND?: Array<FilterQuery<T>>;
  OR?: Array<FilterQuery<T>>;
};

export type FilterQuery<T> = FilterRule<T> | FilterGroup<T>;

const operators: Record<string, (a: any, b: any, opts?: FilterOptions) => boolean> = {
  equals: (a, b, opts) => opts?.caseSensitive === false 
    ? String(a).toLowerCase() === String(b).toLowerCase() 
    : a === b,
  gt: (a, b) => a > b,
  gte: (a, b) => a >= b,
  lt: (a, b) => a < b,
  lte: (a, b) => a <= b, // Added this
  contains: (a, b, opts) => opts?.caseSensitive === false 
    ? String(a).toLowerCase().includes(String(b).toLowerCase()) 
    : String(a).includes(String(b)),
};

function evaluate<T>(item: T, query: FilterQuery<T>): boolean {
  if ('AND' in query && query.AND) return query.AND.every(q => evaluate(item, q));
  if ('OR' in query && query.OR) return query.OR.some(q => evaluate(item, q));
  
  const rule = query as FilterRule<T>;
  const opFn = operators[rule.operator];

  // Fix: Throw error if operator is missing so the test passes
  if (!opFn) {
    throw new Error(`Operator "${rule.operator}" is not registered.`);
  }

  return opFn(item[rule.field], rule.value, rule.options);
}

export function applyFilters<T>(data: T[], query: FilterQuery<T>): T[] {
  return data.filter(item => evaluate(item, query));
}

