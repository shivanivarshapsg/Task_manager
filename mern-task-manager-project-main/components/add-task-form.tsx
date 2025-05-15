"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { useTaskContext } from "@/contexts/task-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function AddTaskForm() {
  const { addTask } = useTaskContext()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined)
  const [reminderTime, setReminderTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    if (!dueDate) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    // Create reminder datetime if both date and time are set
    let reminderDateTime: string | undefined = undefined
    if (reminderDate && reminderTime) {
      const [hours, minutes] = reminderTime.split(":").map(Number)
      const reminder = new Date(reminderDate)
      reminder.setHours(hours, minutes)
      reminderDateTime = reminder.toISOString()
    }

    addTask({
      title,
      description,
      completed: false,
      dueDate: dueDate.toISOString(),
      reminderTime: reminderDateTime,
    })

    // Reset form
    setTitle("")
    setDescription("")
    setDueDate(new Date())
    setReminderDate(undefined)
    setReminderTime("")
    setIsOpen(false)

    toast({
      title: "Success",
      description: "Task added successfully",
    })
  }

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Cancel" : "Add New Task"}</Button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 border rounded-lg p-4 bg-card">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date *</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Set Reminder (Optional)</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !reminderDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reminderDate ? format(reminderDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={reminderDate} onSelect={setReminderDate} initialFocus />
                </PopoverContent>
              </Popover>

              <div className="flex items-center gap-2 flex-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      )}
    </div>
  )
}
