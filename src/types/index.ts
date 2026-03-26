export type CardPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Card {
  id: string
  title: string
  description: string
  priority: CardPriority
  labels: string[]
  assignee: string
  createdAt: string
  columnId: string
}

export interface Column {
  id: string
  title: string
  color: string
  limit: number | null
}

export interface KanbanState {
  columns: Column[]
  cards: Card[]
  addColumn: (title: string) => void
  deleteColumn: (columnId: string) => void
  addCard: (columnId: string, card: Omit<Card, 'id' | 'createdAt' | 'columnId'>) => void
  updateCard: (cardId: string, updates: Partial<Card>) => void
  deleteCard: (cardId: string) => void
  moveCard: (cardId: string, targetColumnId: string, overCardId?: string) => void
  reorderCard: (activeId: string, overId: string) => void
}

export const PRIORITY_CONFIG: Record<CardPriority, { label: string; color: string; dot: string }> = {
  low:      { label: 'Low',      color: 'text-slate-500',  dot: 'bg-slate-400'  },
  medium:   { label: 'Medium',   color: 'text-blue-500',   dot: 'bg-blue-400'   },
  high:     { label: 'High',     color: 'text-amber-500',  dot: 'bg-amber-400'  },
  critical: { label: 'Critical', color: 'text-rose-500',   dot: 'bg-rose-500'   },
}
