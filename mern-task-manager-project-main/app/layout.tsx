import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Task Manager</title>
        <meta name="description" content="Task manager application" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
