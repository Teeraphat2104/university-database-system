import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold tracking-tight">University DB</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
