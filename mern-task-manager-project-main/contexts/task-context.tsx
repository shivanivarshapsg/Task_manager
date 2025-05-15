"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Task } from "@/types/task"
import { useToast } from "@/hooks/use-toast"

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  getTasksByDate: (date: Date) => Task[]
  scheduleNotification: (task: Task) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const { toast } = useToast()

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Check for tasks that need notifications
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      tasks.forEach((task) => {
        if (task.reminderTime) {
          const reminderTime = new Date(task.reminderTime)
          // If the reminder time is within the last minute and the task is not completed
          if (!task.completed && reminderTime <= now && reminderTime > new Date(now.getTime() - 60000)) {
            // Show notification
            toast({
              title: "Task Reminder",
              description: task.title,
            })

            // Show browser notification if permission is granted
            if (Notification.permission === "granted") {
              new Notification("Task Reminder", {
                body: task.title,
              })
            }
          }
        }
      })
    }

    // Check for reminders every minute
    const intervalId = setInterval(checkReminders, 60000)
    // Also check immediately
    checkReminders()

    return () => clearInterval(intervalId)
  }, [tasks, toast])

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }, [])

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    }
    setTasks((prevTasks) => [...prevTasks, newTask])

    // Schedule notification if reminder is set
    if (newTask.reminderTime) {
      scheduleNotification(newTask as Task)
    }
  }

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const getTasksByDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.dueDate.startsWith(dateString))
  }

  const scheduleNotification = (task: Task) => {
    if (!task.reminderTime) return

    const reminderTime = new Date(task.reminderTime).getTime()
    const now = Date.now()
    const delay = reminderTime - now

    // Only schedule if the reminder is in the future
    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("Task Reminder", {
            body: task.title,
          })
        }

        toast({
          title: "Task Reminder",
          description: task.title,
        })
      }, delay)
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksByDate,
        scheduleNotification,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
