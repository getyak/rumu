```markdown
# rumu Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `rumu` repository, a TypeScript React codebase. You'll learn how to structure files, write imports/exports, follow commit message styles, and implement and test features in a way that's consistent with the repository's established practices.

## Coding Conventions

### File Naming
- Use **PascalCase** for file and component names.
  - Example: `UserProfile.tsx`, `DashboardHeader.ts`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```typescript
    import UserProfile from './UserProfile';
    import { getUserData } from '../utils/user';
    ```

### Export Style
- **Mixed** export style: both default and named exports are used.
  - Example (default export):
    ```typescript
    export default function Dashboard() { ... }
    ```
  - Example (named export):
    ```typescript
    export function getUserData() { ... }
    ```

### Commit Patterns
- **Freeform** commit messages, often with a short prefix.
- Average commit message length: ~58 characters.
- Example:
  ```
  Add user avatar to profile page
  Fix bug in notification dropdown
  ```

## Workflows

### Adding a New Component
**Trigger:** When you need to introduce a new UI component.
**Command:** `/add-component`

1. Create a new file in PascalCase (e.g., `MyComponent.tsx`).
2. Use a relative import for any dependencies.
3. Export the component (default or named as appropriate).
4. Write a corresponding test file (`MyComponent.test.tsx`).

### Updating an Existing Feature
**Trigger:** When modifying or enhancing an existing feature.
**Command:** `/update-feature`

1. Locate the relevant file(s) using PascalCase naming.
2. Make changes, using relative imports for any new dependencies.
3. Update or add tests as needed.
4. Write a clear, concise commit message describing the change.

### Writing Tests
**Trigger:** When adding or updating functionality.
**Command:** `/write-test`

1. Create or update a test file matching the pattern `*.test.*` (e.g., `UserProfile.test.tsx`).
2. Use the project's preferred (unknown) testing framework.
3. Ensure tests cover the new or changed functionality.

## Testing Patterns

- Test files use the `*.test.*` pattern (e.g., `Component.test.tsx`).
- Testing framework is not specified; follow existing patterns in the repo.
- Place test files alongside the components they test or in a dedicated test directory.

## Commands
| Command         | Purpose                                 |
|-----------------|-----------------------------------------|
| /add-component  | Scaffold a new React component          |
| /update-feature | Update or enhance an existing feature   |
| /write-test     | Create or update a test file            |
```
