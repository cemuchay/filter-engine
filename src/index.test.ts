import { describe, it, expect } from 'vitest';
import { applyFilters, FilterQuery } from './index.js';

describe('Filter Engine - Extensive Suite', () => {
  const users = [
    { name: 'Alice', age: 30, status: 'active', tags: ['admin', 'editor'] },
    { name: 'Bob', age: 25, status: 'inactive', tags: ['user'] },
    { name: 'Charlie', age: 35, status: 'active', tags: ['user'] },
    { name: 'alice', age: 20, status: 'pending', tags: [] },
  ];

  describe('Basic Operators', () => {
    it('handles "gt" (greater than)', () => {
      const query: FilterQuery<(typeof users)[0]> = { field: 'age', operator: 'gt', value: 30 };
      expect(applyFilters(users, query)).toHaveLength(1); // Charlie
    });

    it('handles "lte" (less than or equal)', () => {
      const query: FilterQuery<(typeof users)[0]> = { field: 'age', operator: 'lte', value: 25 };
      const result = applyFilters(users, query);
      expect(result).toHaveLength(2); // Bob (25) and alice (20)
    });

    it('handles "contains" with case sensitivity toggles', () => {
      const query: FilterQuery<(typeof users)[0]> = { 
        field: 'name', 
        operator: 'contains', 
        value: 'li', 
        options: { caseSensitive: true } 
      };
      // Matches Alice and Charlie, but not "alice" (if we strictly check casing, though 'li' is lowercase in all)
      // Let's test a better case:
      const sensitive = applyFilters(users, { field: 'name', operator: 'contains', value: 'A', options: { caseSensitive: true } });
      const insensitive = applyFilters(users, { field: 'name', operator: 'contains', value: 'A', options: { caseSensitive: false } });
      
      expect(sensitive).toHaveLength(1); // Alice
      expect(insensitive).toHaveLength(3); // Alice, Charlie, alice
    });
  });

  describe('Logical Groups', () => {
    it('handles "AND" logic', () => {
      const query: FilterQuery<(typeof users)[0]> = {
        AND: [
          { field: 'status', operator: 'equals', value: 'active' },
          { field: 'age', operator: 'gt', value: 32 }
        ]
      };
      expect(applyFilters(users, query)).toHaveLength(1); // Only Charlie
    });

    it('handles "OR" logic', () => {
      const query: FilterQuery<(typeof users)[0]> = {
        OR: [
          { field: 'name', operator: 'equals', value: 'Bob' },
          { field: 'name', operator: 'equals', value: 'Charlie' }
        ]
      };
      expect(applyFilters(users, query)).toHaveLength(2);
    });
  });

  describe('Complex Nesting', () => {
    it('handles nested AND/OR combinations', () => {
      // (Status is active AND Age > 25) OR (Name is Bob)
      const query: FilterQuery<(typeof users)[0]> = {
        OR: [
          {
            AND: [
              { field: 'status', operator: 'equals', value: 'active' },
              { field: 'age', operator: 'gt', value: 25 }
            ]
          },
          { field: 'name', operator: 'equals', value: 'Bob' }
        ]
      };
      const result = applyFilters(users, query);
      expect(result).toHaveLength(3); // Alice, Charlie, and Bob
    });
  });

  describe('Edge Cases', () => {
    it('returns empty array when no matches found', () => {
      const query: FilterQuery<(typeof users)[0]> = { field: 'age', operator: 'gt', value: 100 };
      expect(applyFilters(users, query)).toEqual([]);
    });

    it('throws error for unregistered operators', () => {
      const query = { field: 'name', operator: 'invalid_op', value: 'test' };
      // @ts-expect-error - testing runtime failure
      expect(() => applyFilters(users, query)).toThrow();
    });
  });
});