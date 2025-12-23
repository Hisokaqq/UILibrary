## React Component Library Demo

### 🚀 Quick Start

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

### 🏗 Architecture & Design Decisions

#### 1. DataGrid

- **Philosophy:** Inspired by the TanStack Table headless architecture. I built the logic (sorting, filtering, pagination) from scratch but kept the UI separate using Shadcn UI (styled HTML tables).
- **Reusability:** Designed to be completely generic. It works with any dataset without refactoring—the consumer simply defines the columns and the component handles the rest.

#### 2. Timeline

- **Flexibility:** I focused on "Inversion of Control." The component handles the complex logic (grouping by date, keyboard navigation, accessibility), while the visual presentation is fully delegated to the parent via a render prop.
- **Result:** A developer can drastically change the look of the timeline items without touching the core logic.

#### 3. Event Form

- **Trade-off:** I initially considered building a fully generic form generator that iterates through a Zod schema to create inputs automatically. However, I decided that was "over-engineering" for this scope.
- **Decision:** I built a specialized form for Events to ensure better UX and maintainability, avoiding the complexity of a robust generic form builder.

### ⚠️ Challenges & Learnings

#### 1. Date Formatting

- **Challenge:** Syncing dates between the JavaScript Date object, the Calendar picker, and the Table display was tricky (issues with timezones shifting dates by -1 day).
- **Solution:** Standardized inputs/outputs to simple string formats to ensure consistency.

#### 2. Sorting Logic

- **Challenge:** Designing a robust sort behavior that feels intuitive when a user "clears" a sort.
- **Solution:** I implemented a "Tri-State" cycle (Ascending → Descending → Off). Crucially, when a specific column's sort is cleared, the grid automatically falls back to the provided defaultSort prop (Date) rather than showing a random order.
- **Optimization:** By formatting dates as YYYY/MM/DD strings, I utilized standard string comparison for sorting. This avoided the performance overhead of parsing Date objects for every row while ensuring correct chronological order.

#### 3. Modal State Management

- **Challenge:** Closing the Dialog programmatically after a successful submission proved difficult when managing state via Context.
- **Workaround:** I implemented a useRef solution on the hidden "Cancel" button to trigger the close action upon success. While I recognize this is a "hack" compared to a pure state-driven approach, it effectively solved the user flow problem for this iteration.

### 🛠 Tech Stack

- React(Vite) / TypeScript
- Shadcn UI (Radix Primitives)
- Tailwind CSS
- React Hook Form + Zod
- Context API (State Management)
