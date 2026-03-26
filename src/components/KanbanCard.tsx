import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, User, Tag } from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import { PRIORITY_CONFIG, type Card } from '../types'

interface Props {
  card: Card
  isDragOverlay?: boolean
}

export function KanbanCard({ card, isDragOverlay = false }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const deleteCard = useKanbanStore((s) => s.deleteCard)
  const priority = PRIORITY_CONFIG[card.priority]

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', card },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isDragOverlay ? 0.3 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-gray-800 border border-gray-700 rounded-lg p-3
        cursor-default select-none
        ${isDragOverlay ? 'shadow-2xl rotate-2 scale-105 border-indigo-500' : 'hover:border-gray-500'}
        ${isDragging && !isDragOverlay ? 'ring-1 ring-indigo-500/50' : ''}
        transition-colors duration-150
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 flex-shrink-0 text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors"
          aria-label="Drag card"
        >
          <GripVertical size={14} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-100 leading-snug">{card.title}</p>

          {card.description && (
            <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {card.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${priority.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>

            {card.labels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-300"
              >
                <Tag size={9} />
                {label}
              </span>
            ))}
          </div>

          {card.assignee && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <User size={10} />
              <span>{card.assignee}</span>
            </div>
          )}
        </div>

        {(isHovered || isDragOverlay) && (
          <button
            onClick={() => deleteCard(card.id)}
            className="flex-shrink-0 p-0.5 text-gray-600 hover:text-rose-400 transition-colors"
            aria-label="Delete card"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
