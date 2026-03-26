import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useKanbanStore } from '../store/kanbanStore'
import { type CardPriority, PRIORITY_CONFIG } from '../types'

interface Props {
  columnId: string
}

export function AddCardForm({ columnId }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<CardPriority>('medium')
  const [assignee, setAssignee] = useState('')
  const [labelsInput, setLabelsInput] = useState('')
  const addCard = useKanbanStore((s) => s.addCard)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const labels = labelsInput
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)

    addCard(columnId, { title: title.trim(), description, priority, assignee, labels })
    setTitle('')
    setDescription('')
    setPriority('medium')
    setAssignee('')
    setLabelsInput('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors"
      >
        <Plus size={14} />
        Add card
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-600 rounded-lg p-3 space-y-2.5">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title *"
        className="w-full bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as CardPriority)}
          className="bg-gray-900 border border-gray-700 rounded-md px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {(Object.keys(PRIORITY_CONFIG) as CardPriority[]).map((p) => (
            <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>
          ))}
        </select>

        <input
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Assignee"
          className="bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <input
        value={labelsInput}
        onChange={(e) => setLabelsInput(e.target.value)}
        placeholder="Labels (comma-separated)"
        className="w-full bg-gray-900 border border-gray-700 rounded-md px-2.5 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      <div className="flex gap-2 pt-0.5">
        <button
          type="submit"
          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </form>
  )
}
