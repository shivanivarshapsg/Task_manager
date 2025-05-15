import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Welcome</h1>
        <LoginForm />
      </div>
    </div>
  )
}
