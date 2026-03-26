import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Trash2, AlertTriangle } from "lucide-react"
import { useKanbanStore } from "../store/kanbanStore"
import { KanbanCard } from "./KanbanCard"
import { AddCardForm } from "./AddCardForm"
import type { Column } from "../types"

interface Props {
  column: Column
}

export function KanbanColumn({ column }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const allCards = useKanbanStore((s) => s.cards)
  const deleteColumn = useKanbanStore((s) => s.deleteColumn)
  const cards = allCards.filter((c) => c.columnId === column.id)

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  })

  const isOverLimit = column.limit !== null && cards.length > column.limit
  const isAtLimit = column.limit !== null && cards.length === column.limit

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
            {column.title}
          </h2>
          <span
            className={`text-xs font-mono px-1.5 py-0.5 rounded-md min-w-[1.5rem] text-center
              ${
                isOverLimit
                  ? "bg-rose-900/60 text-rose-300"
                  : isAtLimit
                    ? "bg-amber-900/60 text-amber-300"
                    : "bg-gray-700 text-gray-400"
              }`}
          >
            {cards.length}
            {column.limit !== null ? `/${column.limit}` : ""}
          </span>
          {isOverLimit && (
            <AlertTriangle size={13} className="text-rose-400 flex-shrink-0" />
          )}
        </div>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => deleteColumn(column.id)}
              className="text-xs px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-1.5 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1 text-gray-600 hover:text-gray-400 transition-colors"
            aria-label="Delete column"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`
          flex-1 flex flex-col gap-2 min-h-24 p-2 rounded-xl border transition-colors duration-150
          ${
            isOver
              ? "bg-gray-800/80 border-indigo-500/60"
              : "bg-gray-900/40 border-gray-800"
          }
        `}
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-gray-600 py-4">
            Drop cards here
          </div>
        )}
      </div>

      <div className="mt-2 px-1">
        <AddCardForm columnId={column.id} />
      </div>
    </div>
  )
}
