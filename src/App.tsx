import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Plus, LayoutDashboard } from "lucide-react"
import { useKanbanStore } from "./store/kanbanStore"
import { KanbanColumn } from "./components/KanbanColumn"
import { KanbanCard } from "./components/KanbanCard"
import type { Card } from "./types"

export default function App() {
  const { columns, cards, addColumn, moveCard, reorderCard } = useKanbanStore()
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [newColTitle, setNewColTitle] = useState("")
  const [addingCol, setAddingCol] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === "card") {
      setActiveCard(event.active.data.current.card as Card)
    }
  }, [])

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeData = active.data.current
      const overData = over.data.current

      if (activeData?.type !== "card") return

      const activeCard = activeData.card as Card
      const overIsColumn = overData?.type === "column"
      const overIsCard = overData?.type === "card"

      if (overIsColumn && activeCard.columnId !== over.id) {
        moveCard(activeCard.id, over.id as string)
      } else if (overIsCard) {
        const overCard = overData.card as Card
        if (activeCard.columnId !== overCard.columnId) {
          moveCard(activeCard.id, overCard.columnId, overCard.id)
        }
      }
    },
    [moveCard],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveCard(null)

      if (!over) return

      const activeData = active.data.current
      const overData = over.data.current

      if (
        activeData?.type === "card" &&
        overData?.type === "card" &&
        active.id !== over.id
      ) {
        const activeCard = activeData.card as Card
        const overCard = overData.card as Card
        if (activeCard.columnId === overCard.columnId) {
          reorderCard(active.id as string, over.id as string)
        }
      }
    },
    [reorderCard],
  )

  const handleAddColumn = () => {
    if (newColTitle.trim()) {
      addColumn(newColTitle.trim())
      setNewColTitle("")
      setAddingCol(false)
    }
  }

  const totalCards = cards.length
  const doneCards = cards.filter((c) => c.columnId === "done").length
  const progress =
    totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} className="text-indigo-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Kanban Board
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>
                {doneCards}/{totalCards} done
              </span>
              <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-gray-500">{progress}%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 items-start">
            {columns.map((col) => (
              <KanbanColumn key={col.id} column={col} />
            ))}

            <div className="w-72 flex-shrink-0">
              {addingCol ? (
                <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-3 space-y-2">
                  <input
                    autoFocus
                    value={newColTitle}
                    onChange={(e) => setNewColTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddColumn()
                      if (e.key === "Escape") setAddingCol(false)
                    }}
                    placeholder="Column title..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddColumn}
                      className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Add Column
                    </button>
                    <button
                      onClick={() => {
                        setAddingCol(false)
                        setNewColTitle("")
                      }}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingCol(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-700 hover:border-gray-500 text-gray-500 hover:text-gray-300 rounded-xl transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Column
                </button>
              )}
            </div>
          </div>

          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: "cubic-bezier(0.18,0.67,0.6,1.22)",
            }}
          >
            {activeCard && <KanbanCard card={activeCard} isDragOverlay />}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  )
}
