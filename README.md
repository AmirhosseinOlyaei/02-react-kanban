# React Kanban Board

**Feature:** Full drag-and-drop Kanban board with multi-column DnD, WIP limits, card creation, and localStorage persistence.

## Stack
- React 19 + TypeScript strict mode
- Vite 6 + Tailwind CSS v4 (`@tailwindcss/vite`)
- `@dnd-kit/core` + `@dnd-kit/sortable` — pointer & keyboard accessible DnD
- Zustand v5 with `persist` middleware (localStorage)
- `nanoid` for collision-resistant IDs
- `lucide-react` icons

## Architecture
```
src/
  types/index.ts          ← Card, Column, KanbanState, PRIORITY_CONFIG
  store/kanbanStore.ts    ← Zustand store: columns + cards + all mutations
  components/
    KanbanCard.tsx        ← Sortable card with drag handle, priority, labels
    KanbanColumn.tsx      ← Droppable column with SortableContext, WIP badge
    AddCardForm.tsx       ← Inline card creation with priority/assignee/labels
  App.tsx                 ← DndContext, DragOverlay, column management, progress bar
  main.tsx / index.css    ← Entry point + Tailwind v4 base styles
```

## Key DnD patterns
- **Drag handle** — grip icon only; card body remains clickable
- **Cross-column moves** — handled in `onDragOver` via `moveCard` (immediate feedback)
- **Same-column reorder** — handled in `onDragEnd` via `reorderCard`
- **DragOverlay** — ghost card with rotation/scale for polished feel
- **WIP limit** — amber badge at limit, rose badge + warning icon when exceeded

## Setup
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run typecheck
```
