# OrgChart

### Summary

OrgChart lets you view and manage an employee hierarchy with an interactive drag-and-drop org chart. You can reassign managers by dragging employees, use a sidebar to view, focus, and filter employees by team or search.

### Netlify

https://roaring-semolina-13c192.netlify.app/

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sahilsehwag/org-chart-assignment.git
   cd org-chart-assignment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Run tests (optional):**

   ```bash
   npm run test
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Tech Stack

This project uses a modern web stack and several supporting libraries:

- **React**, **TypeScript**, **Vite**: Set up project with Vite and React + TypeScript
- **Tailwind CSS**: Added Tailwind CSS and configured styling
- **shadcn/ui**, **Radix UI**, **class-variance-authority (cva)**: Integrated shadcn/ui and Radix UI components
- **react-flow**, **d3-hierarchy**: Implemented Org Chart with react-flow and d3-hierarchy
- **react-query**: Used react-query for data fetching/caching
- **sonner**: Added toast notifications with sonner
- **Vitest**, **react-testing-library**: Wrote unit/component tests with Vitest and react-testing-library
- **miragejs**: Mocked API with miragejs for local development/testing
- **lucide-react**: Added icons with lucide-react
- **ESLint**: Set up ESLint for code linting
- **Netlify**: Deployed to Netlify
- **CI workflow**: Configured CI workflow (lint, test, build)

**Other details:**

- Node.js 18+ is required for development and running scripts.
- See `package.json` for the full list of dependencies and devDependencies.
