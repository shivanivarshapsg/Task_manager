export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate: string // ISO string format
  reminderTime?: string // ISO string format
}
