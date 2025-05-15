"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { TaskProvider } from "@/contexts/task-context"
import { TaskList } from "@/components/task-list"
import { AddTaskForm } from "@/components/add-task-form"
import { TaskCalendar } from "@/components/task-calendar"

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn) {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })

    router.push("/")
  }

  return (
    <TaskProvider>
      <div className="flex min-h-screen flex-col p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <AddTaskForm />
            <TaskList />
          </div>

          <div className="space-y-6">
            <TaskCalendar />

            <div className="border rounded-lg p-4 bg-card">
              <h2 className="text-lg font-medium mb-4">Notifications</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Task reminders will appear here and as browser notifications if you've granted permission.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  if (Notification.permission !== "granted") {
                    Notification.requestPermission()
                  } else {
                    toast({
                      title: "Notifications already enabled",
                      description: "You will receive notifications for task reminders",
                    })
                  }
                }}
              >
                Enable Notifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TaskProvider>
  )
}
