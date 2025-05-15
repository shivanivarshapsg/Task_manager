"use client"

import { useState } from "react"
import { Check, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTaskContext } from "@/contexts/task-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function TaskList() {
  const { tasks, toggleTaskCompletion, deleteTask } = useTaskContext()
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Your Tasks</h2>
        <div className="flex space-x-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-start justify-between p-3 border rounded-md",
                task.completed ? "bg-muted/50" : "",
              )}
            >
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-5 w-5 rounded-full p-0 flex items-center justify-center",
                    task.completed ? "bg-primary text-primary-foreground" : "",
                  )}
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed && <Check className="h-3 w-3" />}
                </Button>
                <div>
                  <p className={cn("font-medium", task.completed ? "line-through text-muted-foreground" : "")}>
                    {task.title}
                  </p>
                  {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
