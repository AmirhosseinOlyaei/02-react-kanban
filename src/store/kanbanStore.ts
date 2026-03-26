import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Card, Column, KanbanState } from '../types'

const DEFAULT_COLUMNS: Column[] = [
  { id: 'backlog',     title: 'Backlog',      color: '#6b7280', limit: null },
  { id: 'todo',        title: 'To Do',        color: '#3b82f6', limit: null },
  { id: 'in-progress', title: 'In Progress',  color: '#f59e0b', limit: 3    },
  { id: 'review',      title: 'In Review',    color: '#8b5cf6', limit: null },
  { id: 'done',        title: 'Done',         color: '#10b981', limit: null },
]

const DEFAULT_CARDS: Card[] = [
  {
    id: 'card-1', title: 'Set up project scaffold', description: 'Initialise Vite + React + TS',
    priority: 'high', labels: ['setup'], assignee: 'Alice', createdAt: new Date().toISOString(), columnId: 'done',
  },
  {
    id: 'card-2', title: 'Implement drag-and-drop', description: 'Use @dnd-kit/sortable for card DnD across columns',
    priority: 'critical', labels: ['feature', 'ux'], assignee: 'Bob', createdAt: new Date().toISOString(), columnId: 'in-progress',
  },
  {
    id: 'card-3', title: 'Zustand persistence', description: 'Persist board state to localStorage via zustand/middleware',
    priority: 'medium', labels: ['infra'], assignee: 'Alice', createdAt: new Date().toISOString(), columnId: 'todo',
  },
  {
    id: 'card-4', title: 'Column WIP limits', description: 'Warn when a column exceeds its work-in-progress limit',
    priority: 'low', labels: ['feature'], assignee: '', createdAt: new Date().toISOString(), columnId: 'backlog',
  },
]

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      columns: DEFAULT_COLUMNS,
      cards:   DEFAULT_CARDS,

      addColumn: (title) =>
        set((s) => ({
          columns: [...s.columns, { id: nanoid(), title, color: '#6b7280', limit: null }],
        })),

      deleteColumn: (columnId) =>
        set((s) => ({
          columns: s.columns.filter((c) => c.id !== columnId),
          cards:   s.cards.filter((c) => c.columnId !== columnId),
        })),

      addCard: (columnId, card) =>
        set((s) => ({
          cards: [
            ...s.cards,
            { ...card, id: nanoid(), createdAt: new Date().toISOString(), columnId },
          ],
        })),

      updateCard: (cardId, updates) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
        })),

      deleteCard: (cardId) =>
        set((s) => ({ cards: s.cards.filter((c) => c.id !== cardId) })),

      moveCard: (cardId, targetColumnId, overCardId) => {
        const { cards } = get()
        const card = cards.find((c) => c.id === cardId)
        if (!card) return

        const filtered = cards.filter((c) => c.id !== cardId)
        const movedCard = { ...card, columnId: targetColumnId }

        if (overCardId) {
          const overIdx = filtered.findIndex((c) => c.id === overCardId)
          filtered.splice(overIdx, 0, movedCard)
          set({ cards: filtered })
        } else {
          set({ cards: [...filtered, movedCard] })
        }
      },

      reorderCard: (activeId, overId) => {
        const { cards } = get()
        const activeIdx = cards.findIndex((c) => c.id === activeId)
        const overIdx   = cards.findIndex((c) => c.id === overId)
        if (activeIdx === -1 || overIdx === -1) return

        const next = [...cards]
        const [moved] = next.splice(activeIdx, 1)
        next.splice(overIdx, 0, moved)
        set({ cards: next })
      },
    }),
    { name: 'kanban-store' },
  ),
)
