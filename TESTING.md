# ConceptGuide Testing Documentation

This document provides comprehensive information about the testing infrastructure, test suites, and how to run tests for the ConceptGuide application.

## Table of Contents

1. [Testing Framework Overview](#testing-framework-overview)
2. [Getting Started](#getting-started)
3. [Running Tests](#running-tests)
4. [Test File Structure](#test-file-structure)
5. [Test Suites Breakdown](#test-suites-breakdown)
6. [Writing New Tests](#writing-new-tests)
7. [Mocking Guidelines](#mocking-guidelines)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Testing Framework Overview

### Technologies Used

| Technology | Purpose |
|------------|---------|
| **Vitest** | Test runner - Fast, Vite-native testing framework |
| **@testing-library/react** | React component testing utilities |
| **@testing-library/jest-dom** | Custom DOM element matchers |
| **@testing-library/user-event** | User interaction simulation |
| **jsdom** | Browser environment simulation |
| **@vitest/coverage-v8** | Code coverage reporting |
| **@vitest/ui** | Interactive test UI |

### Configuration Files

- `vitest.config.js` - Main Vitest configuration
- `src/tests/setup.js` - Global test setup and mocks

---

## Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm installed.

### Installing Dependencies

```bash
npm install
```

This installs all testing dependencies defined in `package.json`:

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@vitest/coverage-v8": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "jsdom": "^25.0.1",
    "vitest": "^2.1.8"
  }
}
```

---

## Running Tests

### Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run tests in watch mode (re-runs on file changes) |
| `npm run test:run` | Run all tests once and exit |
| `npm run test:ui` | Open interactive test UI in browser |
| `npm run test:coverage` | Run tests with code coverage report |

### Examples

#### Watch Mode (Development)
```bash
npm test
```
Best for development - tests re-run automatically when files change.

#### Single Run (CI/CD)
```bash
npm run test:run
```
Runs all tests once and exits. Ideal for CI/CD pipelines.

#### Interactive UI
```bash
npm run test:ui
```
Opens a browser-based UI showing all tests with detailed results.

#### Coverage Report
```bash
npm run test:coverage
```
Generates coverage report in:
- Terminal (text summary)
- `coverage/` folder (HTML report - open `coverage/index.html`)

### Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- --grep "GoalCard"

# Run tests in a specific file
npm test -- src/tests/components/GoalCard.test.jsx

# Run tests in a specific directory
npm test -- src/tests/services/
```

---

## Test File Structure

```
src/tests/
├── setup.js                          # Global test configuration
├── utils/
│   └── testUtils.jsx                 # Shared test utilities
├── services/
│   └── goalsService.test.js          # Service layer tests
├── store/
│   ├── useAppStore.test.js           # App store tests
│   └── useGoalsStore.test.js         # Goals store tests
├── components/
│   ├── GoalCard.test.jsx             # Goal card component tests
│   ├── NotificationToast.test.jsx    # Notification component tests
│   └── LearningCard.test.jsx         # Learning card component tests
└── integration/
    └── learningFlow.test.jsx         # End-to-end flow tests
```

---

## Test Suites Breakdown

### 1. Service Tests (`src/tests/services/`)

#### `goalsService.test.js`

Tests the goal service business logic including progress calculation, reminders, and period handling.

| Test Case | Description |
|-----------|-------------|
| `calculateGoalProgress - session count` | Verifies correct session counting for progress |
| `calculateGoalProgress - time progress` | Tests time-based goal tracking |
| `calculateGoalProgress - mastery progress` | Tests average mastery score calculation |
| `calculateGoalProgress - empty sessions` | Handles edge case of no sessions |
| `calculateGoalProgress - null goal` | Handles null/undefined inputs gracefully |
| `calculateGoalProgress - cap percentage` | Ensures percentage doesn't exceed 100% |
| `shouldShowReminder - completed goals` | Returns false for completed goals |
| `shouldShowReminder - ending soon` | Returns true for urgent deadlines |
| `shouldShowReminder - last day` | Returns true on final day |
| `shouldShowReminder - good progress` | Returns false when on track |
| `getReminderMessage - success` | Returns celebration message for completed goals |
| `getReminderMessage - urgent` | Returns urgent message on last day |
| `getReminderMessage - warning` | Returns warning for approaching deadlines |
| `getReminderMessage - null` | Returns null when no reminder needed |

**Run only this suite:**
```bash
npm test -- src/tests/services/goalsService.test.js
```

---

### 2. Store Tests (`src/tests/store/`)

#### `useGoalsStore.test.js`

Tests the Zustand goals store state management.

| Test Case | Description |
|-----------|-------------|
| `initial state` | Verifies store initializes with correct defaults |
| `addGoal` | Tests goal creation and state update |
| `removeGoal` | Tests goal deletion from state |
| `toggleGoalActive` | Tests pausing/resuming goals |
| `getGoalsWithProgress` | Tests progress computation |
| `reset` | Tests store reset functionality |
| `dismissReminder` | Tests individual reminder dismissal |
| `clearReminders` | Tests clearing all reminders |

**Run only this suite:**
```bash
npm test -- src/tests/store/useGoalsStore.test.js
```

#### `useAppStore.test.js`

Tests the main application store.

| Test Case | Description |
|-----------|-------------|
| `Initial State` | Verifies all initial state values |
| `PDF State - setPdfData` | Tests PDF data storage |
| `PDF State - clear on new PDF` | Tests session clearing on PDF switch |
| `Selection State` | Tests text selection handling |
| `Confusion Button` | Tests button visibility toggle |
| `Questions and Answers` | Tests Q&A state management |
| `Question Modal` | Tests modal visibility |
| `Session State` | Tests session ID and review mode |
| `History - addSession` | Tests session creation |
| `History - getSessionById` | Tests session retrieval |
| `History - deleteSession` | Tests session deletion |
| `History - getAllSessions` | Tests session sorting |
| `History - updateSessionProgress` | Tests progress updates |
| `Reset` | Tests state reset while preserving history |

**Run only this suite:**
```bash
npm test -- src/tests/store/useAppStore.test.js
```

---

### 3. Component Tests (`src/tests/components/`)

#### `GoalCard.test.jsx`

Tests the GoalCard component UI and interactions.

| Test Case | Description |
|-----------|-------------|
| `render goal information` | Verifies goal name, target, progress display |
| `status badge - active` | Shows "In Progress" for active goals |
| `status badge - completed` | Shows "Completed" badge |
| `status badge - ending soon` | Shows urgent warning badge |
| `status badge - paused` | Shows "Paused" for inactive goals |
| `pause/resume button` | Tests toggle interaction |
| `delete confirmation` | Tests two-click delete safety |
| `days remaining` | Shows countdown correctly |
| `reminder indicator` | Shows when reminders enabled |
| `goal type icons` | Displays correct icon per type |

**Run only this suite:**
```bash
npm test -- src/tests/components/GoalCard.test.jsx
```

#### `NotificationToast.test.jsx`

Tests the notification/reminder toast system.

| Test Case | Description |
|-----------|-------------|
| `empty reminders` | Renders nothing when no reminders |
| `render all reminders` | Shows multiple notifications |
| `show messages` | Displays reminder messages |
| `show progress` | Shows progress bars |
| `dismiss callback` | Calls onDismiss correctly |
| `hide dismissed` | Hides dismissed notifications |
| `goal names` | Displays goal names |
| `success type` | Correct styling for success |
| `info type` | Correct styling for info |

**Run only this suite:**
```bash
npm test -- src/tests/components/NotificationToast.test.jsx
```

#### `LearningCard.test.jsx`

Tests the learning path card component.

| Test Case | Description |
|-----------|-------------|
| `render step information` | Shows step number, concept name |
| `why this step section` | Renders explanation |
| `render examples` | Shows example content |
| `render practice problem` | Shows question and options |
| `disable button before solution` | Blocks progression |
| `answer selection` | Handles MCQ selection |
| `check answer button` | Shows after answer selected |
| `show solution` | Reveals correct answer |
| `enable after solution` | Allows progression |
| `call onMarkComplete` | Triggers parent callback |
| `last step button text` | Shows "Complete" for final step |
| `connection to next` | Shows for non-final steps |
| `handle no practice problem` | Works without MCQ |
| `time estimate badge` | Displays duration |

**Run only this suite:**
```bash
npm test -- src/tests/components/LearningCard.test.jsx
```

---

### 4. Integration Tests (`src/tests/integration/`)

#### `learningFlow.test.jsx`

Tests complete user flows through the learning experience.

| Test Case | Description |
|-----------|-------------|
| `display first step` | Shows initial learning card |
| `progress bar` | Shows step progress |
| `step indicators` | Shows step navigation dots |
| `advance to next step` | Tests step progression |
| `previous button` | Shows after first step |
| `go back to previous` | Tests backward navigation |
| `complete learning path` | Tests full completion |
| `empty steps` | Handles no steps gracefully |
| `practice problem display` | Shows MCQ in steps |
| `work without session` | Works without session ID |

**Run only this suite:**
```bash
npm test -- src/tests/integration/learningFlow.test.jsx
```

---

## Writing New Tests

### Basic Test Structure

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const mockHandler = vi.fn();
    render(<MyComponent onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
```

### Using Test Utilities

```javascript
import { 
  renderWithProviders, 
  createMockSession, 
  createMockGoal 
} from '../utils/testUtils';

describe('ComponentWithRouter', () => {
  it('should work with router', () => {
    renderWithProviders(<MyComponent />, { route: '/goals' });
    // ... assertions
  });

  it('should use mock data', () => {
    const session = createMockSession({ masteryScore: 90 });
    const goal = createMockGoal({ target: 10 });
    // ... test with mock data
  });
});
```

---

## Mocking Guidelines

### Mocking Zustand Stores

```javascript
vi.mock('../../store/useAppStore', () => ({
  useAppStore: vi.fn((selector) => {
    const state = {
      history: { sessions: [] },
      currentSessionId: null,
      // ... other state
    };
    return typeof selector === 'function' ? selector(state) : state;
  }),
}));
```

### Mocking Firebase

Firebase is mocked globally in `setup.js`:

```javascript
vi.mock('../firebase/config', () => ({
  db: {},
  auth: { currentUser: null },
}));
```

### Mocking Fetch

```javascript
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: 'test' }),
});
```

---

## Best Practices

### 1. Test Naming

Use descriptive names that explain what's being tested:

```javascript
// ✅ Good
it('should show error message when form submission fails')

// ❌ Bad
it('test error')
```

### 2. Arrange-Act-Assert Pattern

```javascript
it('should update count when button clicked', () => {
  // Arrange
  render(<Counter initialCount={0} />);
  
  // Act
  fireEvent.click(screen.getByText('Increment'));
  
  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 3. Avoid Implementation Details

```javascript
// ✅ Good - Tests behavior
expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();

// ❌ Bad - Tests implementation
expect(component.state.isSubmitEnabled).toBe(true);
```

### 4. Use Appropriate Queries

Priority order for queries:
1. `getByRole` - Accessible queries
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Inputs
4. `getByText` - Text content
5. `getByTestId` - Last resort

### 5. Async Testing

```javascript
it('should load data asynchronously', async () => {
  render(<AsyncComponent />);
  
  // Wait for element to appear
  expect(await screen.findByText('Loaded')).toBeInTheDocument();
});
```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

**Solution:** Ensure the import path is correct and the file exists.

```javascript
// Check relative paths
import Component from '../../components/Component'; // Not '../components'
```

#### 2. "act() warning"

**Solution:** Wrap state updates in `act()`:

```javascript
import { act } from '@testing-library/react';

await act(async () => {
  fireEvent.click(button);
});
```

#### 3. Mock not working

**Solution:** Ensure mock is defined before imports:

```javascript
// ✅ Correct - vi.mock is hoisted
vi.mock('./myModule', () => ({ myFunc: vi.fn() }));
import { myFunc } from './myModule';

// ❌ Wrong - Import before mock
import { myFunc } from './myModule';
vi.mock('./myModule', () => ({ myFunc: vi.fn() }));
```

#### 4. State persisting between tests

**Solution:** Reset state in `beforeEach`:

```javascript
beforeEach(() => {
  vi.clearAllMocks();
  // Reset store state if needed
});
```

#### 5. Multiple elements found

**Solution:** Use more specific queries:

```javascript
// ❌ Ambiguous
screen.getByText('Submit');

// ✅ Specific
screen.getByRole('button', { name: 'Submit' });
screen.getAllByText('Submit')[0];
```

---

## Coverage Report

After running `npm run test:coverage`, view the HTML report:

```bash
# Open coverage report
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

### Coverage Thresholds

Current coverage targets:
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

*Last updated: November 2024*

