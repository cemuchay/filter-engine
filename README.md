# 🚀 Advanced Filter Engine
### A headless, type-safe logic library for complex data filtering.

Forget messy `if/else` chains. Build complex, nested filters with full TypeScript support and zero dependencies.

---

## ✨ Features
* **🧩 Nested Logic:** Supports infinite `AND` / `OR` groups.
* **🛡️ Type-Safe:** Automatically infers fields from your data models.
* **🔤 Case Control:** Toggle case sensitivity at the rule level.
* **⚙️ Extensible:** Easy to add custom operators.
* **🪶 Headless:** Use it with any UI framework (React, Vue, Svelte) or Node.js.

---

## 📦 Installation

```bash
npm install @chizalam/filter-engine

🚀 Quick Start
import { applyFilters } from '@chizalam/filter-engine';

const users = [
  { id: 1, name: 'Alice', age: 30, status: 'active' },
  { id: 2, name: 'Bob', age: 22, status: 'inactive' },
];

const result = applyFilters(users, {
  field: 'age',
  operator: 'gte',
  value: 25
});

// Output: [{ id: 1, name: 'Alice', ... }]

🔥 Advanced UsageNested Logical GroupsYou can mix and match AND and OR for complex queries:TypeScriptconst query = {
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
Case SensitivityControl how string comparisons are handled:TypeScriptconst query = {
  field: 'name',
  operator: 'equals',
  value: 'ALICE',
  options: { caseSensitive: false } // Matches 'Alice', 'alice', 'ALICE'
};
🛠️ Supported OperatorsOperatorDescriptionequalsStrict equality (supports case toggle)containsPartial string match (supports case toggle)gt / gteGreater than / Greater than or equal tolt / lteLess than / Less than or equal to🧪 Development & TestingWe use Vitest for a lightning-fast testing experience.Bash# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
📜 LicenseMIT © 2026 Chizalam